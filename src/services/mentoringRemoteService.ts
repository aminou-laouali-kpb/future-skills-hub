import { mentoringSessions } from "@/data/mentoringCatalog";
import { getSupabase } from "@/lib/supabase";
import { canSyncToSupabase } from "@/lib/userId";
import type { MentoringRegistrationState } from "@/services/mentoringService";

export async function fetchRemoteMentoringRegistrations(
  userId: string
): Promise<string[] | null> {
  if (!canSyncToSupabase(userId)) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("mentoring_registrations")
    .select("session_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map((r) => r.session_id);
}

export async function fetchRemoteSpotsLeft(sessionId: string, capacity: number): Promise<number | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("mentoring_spots_left", {
    p_session_id: sessionId,
    p_capacity: capacity,
  });

  if (error) throw error;
  return typeof data === "number" ? data : null;
}

export async function pushRemoteMentoringRegistration(userId: string, sessionId: string): Promise<void> {
  if (!canSyncToSupabase(userId)) return;
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("mentoring_registrations").upsert(
    {
      user_id: userId,
      session_id: sessionId,
      registered_at: new Date().toISOString(),
    },
    { onConflict: "user_id,session_id" }
  );
  if (error) throw error;
}

export async function buildRemoteMentoringState(userId: string): Promise<MentoringRegistrationState | null> {
  const registeredIds = await fetchRemoteMentoringRegistrations(userId);
  if (registeredIds === null) return null;

  const spotsBySession: Record<string, number> = {};
  await Promise.all(
    mentoringSessions.map(async (session) => {
      if (session.past) {
        spotsBySession[session.id] = 0;
        return;
      }
      const left = await fetchRemoteSpotsLeft(session.id, session.spotsTotal);
      spotsBySession[session.id] = left ?? 0;
    })
  );

  return { registeredSessionIds: registeredIds, spotsBySession };
}
