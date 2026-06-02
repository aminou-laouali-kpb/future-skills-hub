import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/types/database";
import {
  type LearnerProfile,
  type OnboardingPayload,
  loadMockProfile,
  saveMockProfile,
} from "@/types/profile";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type CohortRow = Database["public"]["Tables"]["cohorts"]["Row"];

function mapRow(row: ProfileRow, cohort: CohortRow | null): LearnerProfile {
  return {
    id: row.id,
    cohortId: row.cohort_id,
    cohortCode: cohort?.code ?? null,
    cohortName: cohort?.name ?? null,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    city: row.city,
    level: row.level ?? "beginner",
    goal: row.goal ?? "employment",
    whatsappOptIn: row.whatsapp_opt_in,
    phone: row.phone,
    contact: row.contact,
    programDay: row.program_day,
    totalDays: cohort?.total_days ?? 10,
    onboardingCompleted: row.onboarding_completed,
  };
}

async function fetchCohortByCode(code: string): Promise<CohortRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("cohorts")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProfile(userId: string): Promise<LearnerProfile | null> {
  if (!isSupabaseConfigured) {
    const mock = loadMockProfile();
    return mock?.id === userId ? mock : null;
  }

  const supabase = getSupabase()!;
  const { data: row, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  let cohort: CohortRow | null = null;
  if (row.cohort_id) {
    const { data: c } = await supabase.from("cohorts").select("*").eq("id", row.cohort_id).maybeSingle();
    cohort = c;
  }

  return mapRow(row, cohort);
}

export async function completeOnboarding(
  userId: string,
  contact: string,
  payload: OnboardingPayload
): Promise<LearnerProfile> {
  const cohortCode = payload.cohortCode.trim().toUpperCase();

  if (!isSupabaseConfigured) {
    const profile: LearnerProfile = {
      id: userId,
      cohortId: null,
      cohortCode,
      cohortName: "Future Skills Cohorte 1",
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      city: payload.city.trim() || null,
      level: payload.level,
      goal: payload.goal,
      whatsappOptIn: payload.whatsappOptIn,
      phone: payload.whatsappOptIn ? payload.phone.trim() : null,
      contact,
      programDay: 1,
      totalDays: 10,
      onboardingCompleted: true,
    };
    saveMockProfile(profile);
    return profile;
  }

  const cohort = await fetchCohortByCode(cohortCode);
  if (!cohort) {
    throw new Error("INVALID_COHORT");
  }

  const supabase = getSupabase()!;
  const updates: Database["public"]["Tables"]["profiles"]["Update"] = {
    cohort_id: cohort.id,
    first_name: payload.firstName.trim(),
    last_name: payload.lastName.trim(),
    city: payload.city.trim() || null,
    level: payload.level,
    goal: payload.goal,
    whatsapp_opt_in: payload.whatsappOptIn,
    phone: payload.whatsappOptIn ? payload.phone.trim() : null,
    contact,
    program_day: 1,
    onboarding_completed: true,
  };

  const { data: row, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(row, cohort);
}
