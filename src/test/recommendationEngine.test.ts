import { describe, it, expect } from "vitest";
import { computeRecommendations, getPrimaryRecommendation } from "@/services/recommendationEngine";
import { enrichModules, type UserProgressData } from "@/services/progressService";
import { getLessonsForModule } from "@/data/curriculum";
import type { Deliverable } from "@/services/deliverableService";

const baseLearner = { goal: "employment" as const, programDay: 3, level: "beginner" };

describe("recommendationEngine", () => {
  it("suggests next lesson for fresh user", () => {
    const progress: UserProgressData = { completedLessonIds: [], quizBestByModule: {} };
    const modules = enrichModules(progress);
    const primary = getPrimaryRecommendation({
      progress,
      modules,
      learner: baseLearner,
      deliverables: [],
    });
    expect(primary?.type).toBe("next_lesson");
    expect(primary?.href).toContain("/modules/m1");
  });

  it("suggests retry quiz when lessons done but quiz low", () => {
    const lessons = getLessonsForModule("m1");
    const needed = Math.ceil(lessons.length * 0.8);
    const progress: UserProgressData = {
      completedLessonIds: lessons.slice(0, needed).map((l) => l.id),
      quizBestByModule: { m1: 40 },
    };
    const modules = enrichModules(progress);
    const recs = computeRecommendations({
      progress,
      modules,
      learner: baseLearner,
      deliverables: [],
    });
    expect(recs.some((r) => r.type === "retry_quiz")).toBe(true);
  });

  it("prioritizes feedback over lessons", () => {
    const progress: UserProgressData = { completedLessonIds: [], quizBestByModule: {} };
    const modules = enrichModules(progress);
    const deliverables: Deliverable[] = [
      {
        id: "d1",
        moduleId: "m1",
        type: "other",
        fileName: "test.pdf",
        context: "x",
        status: "feedback",
        feedback: {
          score: 80,
          strengths: "ok",
          improvements: "ok",
          nextSteps: "ok",
          mentorName: "M",
          date: "2025-01-01",
        },
      },
    ];
    const primary = getPrimaryRecommendation({
      progress,
      modules,
      learner: baseLearner,
      deliverables,
    });
    expect(primary?.type).toBe("review_feedback");
  });
});
