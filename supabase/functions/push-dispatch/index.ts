// Cron entrypoint — schedule every 5 minutes via pg_cron + pg_net.
// Scans notification_preferences + mentoring_registrations and sends due notifications.
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";
import { sendWebPush } from "../_shared/webPush.ts";

// Mentoring catalog — must mirror src/data/mentoringCatalog.ts entries that aren't `past`.
// Format: { id, dateISO (UTC), theme }
const MENTORING_SESSIONS: { id: string; theme: string; dateISO: string }[] = [
  { id: "s1", theme: "Gestion du temps & productivité", dateISO: "2025-03-20T10:00:00+01:00" },
  { id: "s2", theme: "Préparer son pitch 60 secondes", dateISO: "2025-03-22T14:00:00+01:00" },
];

const WINDOW_MS = 5 * 60 * 1000; // ±5 min tolerance

function localHmInTz(date: Date, tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const h = parts.find((p) => p.type === "hour")?.value ?? "00";
    const m = parts.find((p) => p.type === "minute")?.value ?? "00";
    return `${h}:${m}`;
  } catch {
    return "00:00";
  }
}

function minutesBetween(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return Math.abs(ah * 60 + am - (bh * 60 + bm));
}

async function dispatch(): Promise<{ sent: number; errors: number }> {
  const supabase = serviceClient();
  const now = new Date();
  let sent = 0;
  let errors = 0;

  // --- 1. Day plan reminders ---
  const { data: dayPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, day_plan_enabled, day_plan_time, day_plan_tz")
    .eq("day_plan_enabled", true);

  for (const p of dayPrefs ?? []) {
    const local = localHmInTz(now, p.day_plan_tz || "Africa/Niamey");
    const target = (p.day_plan_time as string).slice(0, 5);
    if (minutesBetween(local, target) > 5) continue;

    const todayKey = now.toISOString().slice(0, 10);
    const result = await sendToUser(supabase, p.user_id, {
      kind: "day_plan",
      related_id: todayKey,
      scheduled_for: now.toISOString(),
      title: "Ton plan du jour t'attend",
      body: "Découvre ta mission et ton quiz du jour.",
      url: "/plan-jour",
    });
    sent += result.sent;
    errors += result.errors;
  }

  // --- 2. Mentoring session reminders ---
  const { data: mentoringPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, mentoring_enabled, mentoring_lead_minutes")
    .eq("mentoring_enabled", true);

  if (mentoringPrefs?.length) {
    const userIds = mentoringPrefs.map((p) => p.user_id);
    const { data: regs } = await supabase
      .from("mentoring_registrations")
      .select("user_id, session_id")
      .in("user_id", userIds);

    const byUser = new Map<string, string[]>();
    for (const r of regs ?? []) {
      const list = byUser.get(r.user_id) ?? [];
      list.push(r.session_id);
      byUser.set(r.user_id, list);
    }

    for (const p of mentoringPrefs) {
      const sessionIds = byUser.get(p.user_id) ?? [];
      for (const sid of sessionIds) {
        const session = MENTORING_SESSIONS.find((s) => s.id === sid);
        if (!session) continue;
        const startTs = new Date(session.dateISO).getTime();
        const lead = (p.mentoring_lead_minutes as number) * 60 * 1000;
        const fireAt = startTs - lead;
        if (Math.abs(now.getTime() - fireAt) > WINDOW_MS) continue;

        const result = await sendToUser(supabase, p.user_id, {
          kind: "mentoring",
          related_id: sid,
          scheduled_for: new Date(fireAt).toISOString(),
          title: `Mentorat dans ${p.mentoring_lead_minutes} min`,
          body: session.theme,
          url: "/mentoring",
        });
        sent += result.sent;
        errors += result.errors;
      }
    }
  }

  return { sent, errors };
}

interface NotifSpec {
  kind: "day_plan" | "mentoring";
  related_id: string;
  scheduled_for: string;
  title: string;
  body: string;
  url: string;
}

async function sendToUser(
  supabase: ReturnType<typeof serviceClient>,
  userId: string,
  spec: NotifSpec
): Promise<{ sent: number; errors: number }> {
  // Idempotency log — UNIQUE (user_id, kind, related_id, scheduled_for)
  const { data: inserted, error: insErr } = await supabase
    .from("scheduled_notifications")
    .insert({
      user_id: userId,
      kind: spec.kind,
      related_id: spec.related_id,
      scheduled_for: spec.scheduled_for,
      title: spec.title,
      body: spec.body,
      url: spec.url,
    })
    .select("id")
    .maybeSingle();

  if (insErr) {
    // Duplicate (already sent in this window) — skip silently
    if (String(insErr.code) === "23505") return { sent: 0, errors: 0 };
    return { sent: 0, errors: 1 };
  }
  if (!inserted) return { sent: 0, errors: 0 };

  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);
  if (!subs?.length) {
    await supabase.from("scheduled_notifications").update({ sent_at: new Date().toISOString() }).eq("id", inserted.id);
    return { sent: 0, errors: 0 };
  }

  let sent = 0;
  let errors = 0;
  for (const sub of subs) {
    const res = await sendWebPush(sub, {
      title: spec.title,
      body: spec.body,
      url: spec.url,
      kind: spec.kind,
      tag: `${spec.kind}-${spec.related_id}`,
    }).catch(() => ({ ok: false, gone: false, status: 0, body: "throw" }));
    if (res.ok) sent++;
    else errors++;
    if (res.gone) {
      await supabase.from("push_subscriptions").delete().eq("id", sub.id);
    }
  }

  await supabase
    .from("scheduled_notifications")
    .update({ sent_at: new Date().toISOString() })
    .eq("id", inserted.id);

  return { sent, errors };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const result = await dispatch();
    return jsonResponse({ ok: true, ...result });
  } catch (e) {
    return jsonResponse({ ok: false, error: String(e) }, 500);
  }
});
