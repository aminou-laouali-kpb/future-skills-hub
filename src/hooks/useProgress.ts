import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  enrichModules,
  loadProgress,
  markLessonComplete,
  saveQuizScore,
  type UserProgressData,
} from "@/services/progressService";
import { getLessonsForModule } from "@/data/curriculum";
import type { Lesson, Module } from "@/data/mockData";
import type { ModuleId } from "@/data/curriculum";
import { LEARNER_HYDRATED_EVENT } from "@/services/learnerSyncService";

const GUEST_ID = "guest";

function useProgressUserId(): string {
  const { user } = useAuth();
  return user?.id ?? GUEST_ID;
}

function subscribe(_userId: string, onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("fs-progress-updated", handler);
  window.addEventListener(LEARNER_HYDRATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("fs-progress-updated", handler);
    window.removeEventListener(LEARNER_HYDRATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useProgressStore() {
  const userId = useProgressUserId();

  const progress = useSyncExternalStore(
    (onChange) => subscribe(userId, onChange),
    () => loadProgress(userId),
    () => loadProgress(userId)
  );

  const bump = useCallback(() => {
    window.dispatchEvent(new Event("fs-progress-updated"));
  }, []);

  const modules = useMemo(() => enrichModules(progress), [progress]);

  const completeLesson = useCallback(
    (lessonId: string) => {
      markLessonComplete(userId, lessonId);
      bump();
    },
    [userId, bump]
  );

  const recordQuiz = useCallback(
    (moduleId: ModuleId, percent: number) => {
      saveQuizScore(userId, moduleId, percent);
      bump();
    },
    [userId, bump]
  );

  return { progress, modules, completeLesson, recordQuiz, userId };
}

export function useLessonsWithProgress(moduleId: string | undefined): Lesson[] {
  const { progress } = useProgressStore();
  if (!moduleId) return [];
  const completed = new Set(progress.completedLessonIds);
  return getLessonsForModule(moduleId).map((l) => ({
    ...l,
    completed: completed.has(l.id),
  }));
}

export function useModule(moduleId: string | undefined): Module | undefined {
  const { modules } = useProgressStore();
  return modules.find((m) => m.id === moduleId);
}

export type { UserProgressData };
