import { describe, it, expect, beforeEach } from "vitest";
import {
  loadProgress,
  saveProgress,
  enrichModules,
  isModuleComplete,
  isModuleUnlocked,
  markLessonComplete,
  saveQuizScore,
  LESSON_THRESHOLD_PERCENT,
  QUIZ_PASS_PERCENT,
} from "@/services/progressService";
import { getLessonsForModule } from "@/data/curriculum";

const USER = "test-user-progress";

beforeEach(() => {
  localStorage.removeItem(`fs-progress-${USER}`);
});

describe("progressService", () => {
  it("unlocks m1 by default and locks m2", () => {
    const modules = enrichModules(loadProgress(USER));
    expect(modules.find((m) => m.id === "m1")?.status).not.toBe("locked");
    expect(modules.find((m) => m.id === "m2")?.status).toBe("locked");
  });

  it("completes module when 80% lessons and 60% quiz", () => {
    const lessons = getLessonsForModule("m1");
    const needed = Math.ceil((lessons.length * LESSON_THRESHOLD_PERCENT) / 100);
    let data = loadProgress(USER);
    for (let i = 0; i < needed; i++) {
      data = markLessonComplete(USER, lessons[i].id);
    }
    data = saveQuizScore(USER, "m1", QUIZ_PASS_PERCENT);
    const completed = new Set(data.completedLessonIds);
    expect(isModuleComplete("m1", completed, data.quizBestByModule)).toBe(true);
    expect(isModuleUnlocked("m2", completed, data.quizBestByModule)).toBe(true);
  });

  it("persists progress in localStorage", () => {
    markLessonComplete(USER, "m1-l1");
    const stored = loadProgress(USER);
    expect(stored.completedLessonIds).toContain("m1-l1");
  });
});
