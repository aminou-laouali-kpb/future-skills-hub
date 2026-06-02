import { isSupabaseConfigured } from "@/lib/supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** True when this learner id can use Supabase tables (real auth user). */
export function canSyncToSupabase(userId: string | undefined | null): boolean {
  if (!userId || !isSupabaseConfigured) return false;
  if (userId === "guest" || userId.startsWith("mock-")) return false;
  return UUID_RE.test(userId);
}
