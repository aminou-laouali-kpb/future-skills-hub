import { getSupabase } from "@/lib/supabase";
import { canSyncToSupabase } from "@/lib/userId";
import type { IssuedCertificate } from "@/services/certificateService";

export async function fetchRemoteIssuedCertificate(userId: string): Promise<IssuedCertificate | null> {
  if (!canSyncToSupabase(userId)) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("issued_certificates")
    .select("learner_name, cohort_code, issued_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    learnerName: data.learner_name,
    cohortCode: data.cohort_code,
    issuedAt: data.issued_at,
  };
}

export async function pushRemoteIssuedCertificate(
  userId: string,
  certificate: IssuedCertificate
): Promise<void> {
  if (!canSyncToSupabase(userId)) return;
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("issued_certificates").upsert(
    {
      user_id: userId,
      learner_name: certificate.learnerName,
      cohort_code: certificate.cohortCode,
      issued_at: certificate.issuedAt,
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}
