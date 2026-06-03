import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { requireUserId, serviceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const userId = await requireUserId(req);
  if (!userId) return jsonResponse({ error: "unauthorized" }, 401);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_body" }, 400);
  }

  const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
  if (!endpoint) return jsonResponse({ error: "missing_endpoint" }, 400);

  const supabase = serviceClient();

  if (body.unsubscribe) {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", userId)
      .eq("endpoint", endpoint);
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ ok: true });
  }

  const p256dh = typeof body.p256dh === "string" ? body.p256dh : "";
  const auth = typeof body.auth === "string" ? body.auth : "";
  if (!p256dh || !auth) return jsonResponse({ error: "missing_keys" }, 400);

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint,
      p256dh,
      auth,
      user_agent: typeof body.user_agent === "string" ? body.user_agent : null,
      lang: typeof body.lang === "string" ? body.lang : "fr",
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );
  if (error) return jsonResponse({ error: error.message }, 500);

  // Ensure prefs row exists
  await supabase
    .from("notification_preferences")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });

  return jsonResponse({ ok: true });
});
