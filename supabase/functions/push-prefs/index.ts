import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { requireUserId, serviceClient } from "../_shared/auth.ts";

const DEFAULTS = {
  day_plan_enabled: true,
  day_plan_time: "08:00",
  day_plan_tz: "Africa/Niamey",
  mentoring_enabled: true,
  mentoring_lead_minutes: 60,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const userId = await requireUserId(req);
  if (!userId) return jsonResponse({ error: "unauthorized" }, 401);

  const body = await req.json().catch(() => ({}));
  const supabase = serviceClient();

  if (body.op === "get") {
    const { data } = await supabase
      .from("notification_preferences")
      .select("day_plan_enabled, day_plan_time, day_plan_tz, mentoring_enabled, mentoring_lead_minutes")
      .eq("user_id", userId)
      .maybeSingle();
    return jsonResponse({ ...DEFAULTS, ...(data ?? {}) });
  }

  if (body.op === "set") {
    const p = (body.prefs ?? {}) as Record<string, unknown>;
    const lead = Number(p.mentoring_lead_minutes ?? DEFAULTS.mentoring_lead_minutes);
    const row = {
      user_id: userId,
      day_plan_enabled: Boolean(p.day_plan_enabled ?? DEFAULTS.day_plan_enabled),
      day_plan_time: typeof p.day_plan_time === "string" ? p.day_plan_time : DEFAULTS.day_plan_time,
      day_plan_tz: typeof p.day_plan_tz === "string" ? p.day_plan_tz : DEFAULTS.day_plan_tz,
      mentoring_enabled: Boolean(p.mentoring_enabled ?? DEFAULTS.mentoring_enabled),
      mentoring_lead_minutes: Number.isFinite(lead) ? Math.min(720, Math.max(5, lead)) : 60,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("notification_preferences")
      .upsert(row, { onConflict: "user_id" });
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "unknown_op" }, 400);
});
