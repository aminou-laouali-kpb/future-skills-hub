import { getSupabase } from "@/lib/supabase";
import { VAPID_PUBLIC_KEY } from "@/lib/vapidConfig";

export type PushStatus =
  | { state: "unsupported"; reason: string }
  | { state: "denied" }
  | { state: "default" }
  | { state: "subscribed"; endpoint: string };

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function isPreviewHost(): boolean {
  const h = window.location.hostname;
  return h.includes("id-preview--") || h.includes("lovableproject.com") || h === "localhost";
}

export type PushSupport = { ok: true; reason: null } | { ok: false; reason: string };

export function pushEnvironmentSupport(): PushSupport {
  if (!("serviceWorker" in navigator)) return { ok: false, reason: "no_sw" };
  if (!("PushManager" in window)) return { ok: false, reason: "no_push" };
  if (!("Notification" in window)) return { ok: false, reason: "no_notification" };
  if (isInIframe()) return { ok: false, reason: "iframe" };
  if (isPreviewHost()) return { ok: false, reason: "preview" };
  return { ok: true, reason: null };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function bufToB64Url(buf: ArrayBuffer | null): string {
  if (!buf) return "";
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  const support = pushEnvironmentSupport();
  if (!support.ok) return null;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return null;
  return await reg.pushManager.getSubscription();
}

export async function getPushStatus(): Promise<PushStatus> {
  const support = pushEnvironmentSupport();
  if (!support.ok) return { state: "unsupported", reason: support.reason };
  if (Notification.permission === "denied") return { state: "denied" };
  const sub = await getCurrentSubscription();
  if (sub) return { state: "subscribed", endpoint: sub.endpoint };
  if (Notification.permission === "granted") return { state: "default" };
  return { state: "default" };
}

export async function enablePush(lang: string): Promise<PushStatus> {
  const support = pushEnvironmentSupport();
  if (!support.ok) return { state: "unsupported", reason: support.reason };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { state: "denied" };

  // Wait for the PWA-managed service worker to be ready
  const reg = await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const keyBytes = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyBytes.buffer.slice(
        keyBytes.byteOffset,
        keyBytes.byteOffset + keyBytes.byteLength
      ) as ArrayBuffer,
    });
  }

  const supabase = getSupabase();
  if (!supabase) throw new Error("supabase_not_configured");

  const p256dh = bufToB64Url(sub.getKey("p256dh"));
  const auth = bufToB64Url(sub.getKey("auth"));

  const { error } = await supabase.functions.invoke("push-subscribe", {
    body: {
      endpoint: sub.endpoint,
      p256dh,
      auth,
      user_agent: navigator.userAgent,
      lang,
    },
  });
  if (error) throw error;

  return { state: "subscribed", endpoint: sub.endpoint };
}

export async function disablePush(): Promise<void> {
  const sub = await getCurrentSubscription();
  if (!sub) return;

  const supabase = getSupabase();
  await sub.unsubscribe();
  if (supabase) {
    await supabase.functions.invoke("push-subscribe", {
      body: { endpoint: sub.endpoint, unsubscribe: true },
    });
  }
}

export async function sendTestPush(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("supabase_not_configured");
  const { error } = await supabase.functions.invoke("push-test", { body: {} });
  if (error) throw error;
}

export interface NotificationPrefs {
  day_plan_enabled: boolean;
  day_plan_time: string; // HH:mm
  day_plan_tz: string;
  mentoring_enabled: boolean;
  mentoring_lead_minutes: number;
}

export const DEFAULT_PREFS: NotificationPrefs = {
  day_plan_enabled: true,
  day_plan_time: "08:00",
  day_plan_tz: "Africa/Niamey",
  mentoring_enabled: true,
  mentoring_lead_minutes: 60,
};

export async function loadPrefs(): Promise<NotificationPrefs> {
  const supabase = getSupabase();
  if (!supabase) return DEFAULT_PREFS;
  const { data, error } = await supabase.functions.invoke("push-prefs", { body: { op: "get" } });
  if (error || !data) return DEFAULT_PREFS;
  return { ...DEFAULT_PREFS, ...(data as Partial<NotificationPrefs>) };
}

export async function savePrefs(prefs: NotificationPrefs): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("supabase_not_configured");
  const { error } = await supabase.functions.invoke("push-prefs", { body: { op: "set", prefs } });
  if (error) throw error;
}
