import { getSupabase } from "@/lib/supabase";
import { canSyncToSupabase } from "@/lib/userId";
import type { ModuleId } from "@/data/curriculum";
import type { UserProgressData } from "@/services/progressService";

export async function fetchRemoteProgress(userId: string): Promise<UserProgressData | null> {
  if (!canSyncToSupabase(userId)) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const [lessonsRes, quizRes] = await Promise.all([
    supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", userId),
    supabase.from("user_quiz_scores").select("module_id, best_percent").eq("user_id", userId),
  ]);

  if (lessonsRes.error) throw lessonsRes.error;
  if (quizRes.error) throw quizRes.error;

  const quizBestByModule: Partial<Record<ModuleId, number>> = {};
  for (const row of quizRes.data ?? []) {
    quizBestByModule[row.module_id as ModuleId] = row.best_percent;
  }

  return {
    completedLessonIds: (lessonsRes.data ?? []).map((r) => r.lesson_id),
    quizBestByModule,
  };
}

export async function pushRemoteLessonComplete(userId: string, lessonId: string): Promise<void> {
  if (!canSyncToSupabase(userId)) return;
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("user_lesson_progress").upsert(
    { user_id: userId, lesson_id: lessonId, completed_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" }
  );
  if (error) throw error;
}

export async function pushRemoteQuizScore(userId: string, moduleId: ModuleId, percent: number): Promise<void> {
  if (!canSyncToSupabase(userId)) return;
  const supabase = getSupabase();
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("user_quiz_scores")
    .select("best_percent")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .maybeSingle();

  const best = Math.max(existing?.best_percent ?? 0, percent);

  const { error } = await supabase.from("user_quiz_scores").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      best_percent: best,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id" }
  );
  if (error) throw error;
}

export async function pushRemoteProgress(userId: string, data: UserProgressData): Promise<void> {
  if (!canSyncToSupabase(userId)) return;

  await Promise.all([
    ...data.completedLessonIds.map((lessonId) => pushRemoteLessonComplete(userId, lessonId)),
    ...(Object.entries(data.quizBestByModule) as [ModuleId, number][]).map(([moduleId, score]) =>
      pushRemoteQuizScore(userId, moduleId, score)
    ),
  ]);
}
