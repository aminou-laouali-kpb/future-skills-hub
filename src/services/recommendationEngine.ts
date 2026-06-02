import type { Module } from "@/data/mockData";
import { getLessonsForModule, MODULE_IDS, type ModuleId } from "@/data/curriculum";
import type { Deliverable } from "@/services/deliverableService";
import {
  isModuleComplete,
  isModuleQuizPassed,
  isModuleUnlocked,
  lessonCompletionPercent,
  QUIZ_PASS_PERCENT,
  type UserProgressData,
} from "@/services/progressService";
import type { LearnerRecoProfile, Recommendation } from "@/types/recommendation";
import type { LearnerGoal } from "@/types/database";

export interface RecommendationContext {
  progress: UserProgressData;
  modules: Module[];
  learner: LearnerRecoProfile;
  deliverables: Deliverable[];
}

function normalizeGoal(goal: LearnerRecoProfile["goal"]): LearnerGoal {
  const map: Record<string, LearnerGoal> = {
    emploi: "employment",
    employment: "employment",
    entrepreneuriat: "entrepreneurship",
    entrepreneurship: "entrepreneurship",
    ai: "ai",
    productivity: "productivity",
  };
  return map[String(goal)] ?? "employment";
}

function firstIncompleteLesson(moduleId: string, completed: Set<string>) {
  return getLessonsForModule(moduleId).find((l) => !completed.has(l.id));
}

function activeModule(modules: Module[]): Module | undefined {
  return modules.find((m) => m.status === "in_progress") ?? modules.find((m) => m.status !== "locked" && m.status !== "completed");
}

function goalModuleId(goal: LearnerGoal): ModuleId | null {
  switch (goal) {
    case "employment":
      return "m4";
    case "entrepreneurship":
      return "m5";
    case "ai":
      return "m3";
    case "productivity":
      return "m2";
    default:
      return null;
  }
}

export function computeRecommendations(ctx: RecommendationContext): Recommendation[] {
  const completed = new Set(ctx.progress.completedLessonIds);
  const recs: Recommendation[] = [];
  const goal = normalizeGoal(ctx.learner.goal);

  const feedbackPending = ctx.deliverables.find((d) => d.status === "feedback" && d.feedback);
  if (feedbackPending) {
    recs.push({
      id: "reco-feedback",
      type: "review_feedback",
      priority: 1,
      href: `/deliverables/${feedbackPending.id}/feedback`,
      titleKey: "feedbackTitle",
      descriptionKey: "feedbackDesc",
      reasonKey: "feedbackReason",
      ctaKey: "feedbackCta",
      reasonParams: { title: feedbackPending.fileName ?? feedbackPending.linkUrl ?? "" },
    });
  }

  const mod = activeModule(ctx.modules);
  if (mod) {
    const moduleId = mod.id as ModuleId;
    const quizScore = ctx.progress.quizBestByModule[moduleId];
    const lessonsDone = lessonCompletionPercent(moduleId, completed);
    const lessonsComplete = lessonsDone >= 80;

    if (lessonsComplete && (quizScore === undefined || quizScore < QUIZ_PASS_PERCENT)) {
      recs.push({
        id: `reco-quiz-${moduleId}`,
        type: "retry_quiz",
        priority: 2,
        href: `/modules/${moduleId}/quiz`,
        titleKey: "retryQuizTitle",
        descriptionKey: "retryQuizDesc",
        reasonKey: "retryQuizReason",
        ctaKey: "retryQuizCta",
        reasonParams: { score: String(quizScore), module: mod.shortTitle },
      });
    }

    const nextLesson = firstIncompleteLesson(moduleId, completed);
    if (nextLesson) {
      recs.push({
        id: `reco-lesson-${nextLesson.id}`,
        type: "next_lesson",
        priority: 3,
        href: `/modules/${moduleId}`,
        titleKey: "nextLessonTitle",
        descriptionKey: "nextLessonDesc",
        reasonKey: "nextLessonReason",
        ctaKey: "nextLessonCta",
        reasonParams: { lesson: nextLesson.title, module: mod.title },
      });
    } else if (!lessonsComplete) {
      recs.push({
        id: `reco-lessons-${moduleId}`,
        type: "next_lesson",
        priority: 3,
        href: `/modules/${moduleId}`,
        titleKey: "nextLessonTitle",
        descriptionKey: "nextLessonDesc",
        reasonKey: "nextLessonReason",
        ctaKey: "nextLessonCta",
        reasonParams: { lesson: mod.title, module: mod.shortTitle },
      });
    }
  }

  const focusId = goalModuleId(goal);
  if (focusId) {
    const focusMod = ctx.modules.find((m) => m.id === focusId);
    if (focusMod && isModuleUnlocked(focusId, completed, ctx.progress.quizBestByModule) && focusMod.status !== "completed") {
      recs.push({
        id: `reco-goal-${focusId}`,
        type: "goal_focus",
        priority: 4,
        href: `/modules/${focusId}`,
        titleKey: "goalTitle",
        descriptionKey: "goalDesc",
        reasonKey: "goalReason",
        ctaKey: "goalCta",
        reasonParams: { module: focusMod.title },
      });
    }
  }

  const allComplete = MODULE_IDS.every((id) =>
    isModuleComplete(id, completed, ctx.progress.quizBestByModule)
  );
  if (allComplete) {
    recs.push({
      id: "reco-complete",
      type: "all_complete",
      priority: 10,
      href: "/resources",
      titleKey: "completeTitle",
      descriptionKey: "completeDesc",
      reasonKey: "completeReason",
      ctaKey: "completeCta",
    });
  } else if (recs.length === 0) {
    recs.push({
      id: "reco-resources",
      type: "explore_resources",
      priority: 8,
      href: "/resources",
      titleKey: "resourcesTitle",
      descriptionKey: "resourcesDesc",
      reasonKey: "resourcesReason",
      ctaKey: "resourcesCta",
    });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}

export function getPrimaryRecommendation(ctx: RecommendationContext): Recommendation | null {
  const list = computeRecommendations(ctx);
  return list[0] ?? null;
}

export function getSecondaryRecommendations(ctx: RecommendationContext, limit = 2): Recommendation[] {
  return computeRecommendations(ctx).slice(1, 1 + limit);
}

/** Plan du jour : priorité = reco principale si elle cible un module du jour. */
export function isDayPriority(dayModuleId: string, primary: Recommendation | null): boolean {
  if (!primary) return false;
  return primary.href.includes(`/modules/${dayModuleId}`);
}
