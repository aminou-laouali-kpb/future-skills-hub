import { modules as moduleCatalog, type Module } from "@/data/mockData";
import { getLessonsForModule, MODULE_IDS, type ModuleId } from "@/data/curriculum";
import { pushRemoteLessonComplete, pushRemoteQuizScore } from "@/services/progressRemoteService";

export const LESSON_THRESHOLD_PERCENT = 80;
export const QUIZ_PASS_PERCENT = 60;

export interface UserProgressData {
  completedLessonIds: string[];
  quizBestByModule: Partial<Record<ModuleId, number>>;
}

const STORAGE_PREFIX = "fs-progress-";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function loadProgress(userId: string): UserProgressData {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) return JSON.parse(raw) as UserProgressData;
  } catch {
    /* empty */
  }
  return { completedLessonIds: [], quizBestByModule: {} };
}

export function saveProgress(userId: string, data: UserProgressData): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(data));
}

export function lessonCompletionPercent(moduleId: string, completedIds: Set<string>): number {
  const lessons = getLessonsForModule(moduleId);
  if (lessons.length === 0) return 0;
  const done = lessons.filter((l) => completedIds.has(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}

export function isModuleLessonsComplete(moduleId: string, completedIds: Set<string>): boolean {
  return lessonCompletionPercent(moduleId, completedIds) >= LESSON_THRESHOLD_PERCENT;
}

export function isModuleQuizPassed(moduleId: string, quizBest: Partial<Record<ModuleId, number>>): boolean {
  const score = quizBest[moduleId as ModuleId];
  return score !== undefined && score >= QUIZ_PASS_PERCENT;
}

export function isModuleComplete(
  moduleId: ModuleId,
  completedIds: Set<string>,
  quizBest: Partial<Record<ModuleId, number>>
): boolean {
  return isModuleLessonsComplete(moduleId, completedIds) && isModuleQuizPassed(moduleId, quizBest);
}

export function isModuleUnlocked(
  moduleId: ModuleId,
  completedIds: Set<string>,
  quizBest: Partial<Record<ModuleId, number>>
): boolean {
  const index = MODULE_IDS.indexOf(moduleId);
  if (index <= 0) return true;
  const prev = MODULE_IDS[index - 1];
  return isModuleComplete(prev, completedIds, quizBest);
}

export function computeModuleStatus(
  moduleId: ModuleId,
  completedIds: Set<string>,
  quizBest: Partial<Record<ModuleId, number>>
): Module["status"] {
  if (!isModuleUnlocked(moduleId, completedIds, quizBest)) return "locked";
  if (isModuleComplete(moduleId, completedIds, quizBest)) return "completed";
  return "in_progress";
}

export function enrichModules(progress: UserProgressData): Module[] {
  const completedSet = new Set(progress.completedLessonIds);

  return moduleCatalog.map((m) => {
    const moduleId = m.id as ModuleId;
    const status = computeModuleStatus(moduleId, completedSet, progress.quizBestByModule);
    const progressPercent = lessonCompletionPercent(moduleId, completedSet);
    return { ...m, status, progress: progressPercent };
  });
}

function syncLessonToRemote(userId: string, lessonId: string) {
  void pushRemoteLessonComplete(userId, lessonId).catch((err) => {
    console.warn("[Future Skills] sync lesson failed", err);
  });
}

function syncQuizToRemote(userId: string, moduleId: ModuleId, percent: number) {
  void pushRemoteQuizScore(userId, moduleId, percent).catch((err) => {
    console.warn("[Future Skills] sync quiz failed", err);
  });
}

export function markLessonComplete(userId: string, lessonId: string): UserProgressData {
  const data = loadProgress(userId);
  if (!data.completedLessonIds.includes(lessonId)) {
    data.completedLessonIds.push(lessonId);
  }
  saveProgress(userId, data);
  syncLessonToRemote(userId, lessonId);
  return data;
}

export function saveQuizScore(userId: string, moduleId: ModuleId, percent: number): UserProgressData {
  const data = loadProgress(userId);
  const prev = data.quizBestByModule[moduleId] ?? 0;
  data.quizBestByModule[moduleId] = Math.max(prev, percent);
  saveProgress(userId, data);
  syncQuizToRemote(userId, moduleId, data.quizBestByModule[moduleId]!);
  return data;
}
