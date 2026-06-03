import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { requireUserId, serviceClient } from "../_shared/auth.ts";
import { sendWebPush } from "../_shared/webPush.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const userId = await requireUserId(req);
  if (!userId) return jsonResponse({ error: "unauthorized" }, 401);

  const supabase = serviceClient();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);
  if (error) return jsonResponse({ error: error.message }, 500);
  if (!subs?.length) return jsonResponse({ error: "no_subscription" }, 404);

  const payload = {
    title: "Future Skills",
    body: "Notification test reçue ✅",
    url: "/dashboard",
    kind: "test",
  };

  let sent = 0;
  for (const sub of subs) {
    const res = await sendWebPush(sub, payload).catch((e) => ({
      ok: false,
      gone: false,
      status: 0,
      body: String(e),
    }));
    if (res.ok) sent++;
    if (res.gone) {
      await supabase.from("push_subscriptions").delete().eq("id", sub.id);
    }
  }

  return jsonResponse({ ok: true, sent });
});
