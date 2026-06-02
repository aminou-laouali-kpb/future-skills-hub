import { getSupabase } from "@/lib/supabase";
import { canSyncToSupabase } from "@/lib/userId";
import type { Deliverable, DeliverableFeedback, DeliverableStatus } from "@/services/deliverableService";

type DeliverableRow = {
  id: string;
  module_id: string;
  type: string;
  file_name: string | null;
  link_url: string | null;
  context: string;
  status: DeliverableStatus;
  submitted_at: string | null;
  deliverable_feedback: DeliverableFeedbackRow | DeliverableFeedbackRow[] | null;
};

type DeliverableFeedbackRow = {
  score: number | null;
  strengths: string | null;
  improvements: string | null;
  next_steps: string | null;
  mentor_name: string | null;
  feedback_date: string | null;
};

function mapFeedback(row: DeliverableFeedbackRow | null | undefined): DeliverableFeedback | undefined {
  if (!row || row.score == null) return undefined;
  return {
    score: row.score,
    strengths: row.strengths ?? "",
    improvements: row.improvements ?? "",
    nextSteps: row.next_steps ?? "",
    mentorName: row.mentor_name ?? "",
    date: row.feedback_date ?? "",
  };
}

function mapRow(row: DeliverableRow): Deliverable {
  const fb = Array.isArray(row.deliverable_feedback)
    ? row.deliverable_feedback[0]
    : row.deliverable_feedback;

  return {
    id: row.id,
    moduleId: row.module_id,
    type: row.type,
    fileName: row.file_name ?? undefined,
    linkUrl: row.link_url ?? undefined,
    context: row.context,
    status: row.status,
    submittedAt: row.submitted_at ?? undefined,
    feedback: mapFeedback(fb),
  };
}

export async function fetchRemoteDeliverables(userId: string): Promise<Deliverable[] | null> {
  if (!canSyncToSupabase(userId)) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("deliverables")
    .select(
      `
      id,
      module_id,
      type,
      file_name,
      link_url,
      context,
      status,
      submitted_at,
      deliverable_feedback (
        score,
        strengths,
        improvements,
        next_steps,
        mentor_name,
        feedback_date
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as DeliverableRow[]).map(mapRow);
}

export async function insertRemoteDeliverable(
  userId: string,
  input: Omit<Deliverable, "id" | "feedback">
): Promise<Deliverable> {
  if (!canSyncToSupabase(userId)) throw new Error("REMOTE_SYNC_UNAVAILABLE");
  const supabase = getSupabase();
  if (!supabase) throw new Error("REMOTE_SYNC_UNAVAILABLE");

  const { data, error } = await supabase
    .from("deliverables")
    .insert({
      user_id: userId,
      module_id: input.moduleId,
      type: input.type,
      file_name: input.fileName ?? null,
      link_url: input.linkUrl ?? null,
      context: input.context,
      status: input.status,
      submitted_at: input.submittedAt ?? null,
    })
    .select(
      `
      id,
      module_id,
      type,
      file_name,
      link_url,
      context,
      status,
      submitted_at,
      deliverable_feedback (
        score,
        strengths,
        improvements,
        next_steps,
        mentor_name,
        feedback_date
      )
    `
    )
    .single();

  if (error) throw error;
  return mapRow(data as DeliverableRow);
}
