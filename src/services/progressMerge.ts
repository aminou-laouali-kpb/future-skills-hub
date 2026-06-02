import type { ModuleId } from "@/data/curriculum";
import type { UserProgressData } from "@/services/progressService";

/** Merge remote and local progress (union lessons, max quiz scores). */
export function mergeProgressData(local: UserProgressData, remote: UserProgressData): UserProgressData {
  const lessonSet = new Set([...local.completedLessonIds, ...remote.completedLessonIds]);
  const quizBestByModule = { ...local.quizBestByModule } as Partial<Record<ModuleId, number>>;

  for (const [moduleId, score] of Object.entries(remote.quizBestByModule)) {
    const id = moduleId as ModuleId;
    const prev = quizBestByModule[id] ?? 0;
    quizBestByModule[id] = Math.max(prev, score ?? 0);
  }

  return {
    completedLessonIds: [...lessonSet],
    quizBestByModule,
  };
}
