import type { LearnerGoal } from "@/types/database";

export type RecommendationType =
  | "next_lesson"
  | "retry_quiz"
  | "review_feedback"
  | "submit_deliverable"
  | "goal_focus"
  | "explore_resources"
  | "all_complete";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: number;
  href: string;
  titleKey: keyof RecommendationCopyKeys;
  descriptionKey: keyof RecommendationCopyKeys;
  reasonKey: keyof RecommendationCopyKeys;
  ctaKey: keyof RecommendationCopyKeys;
  reasonParams?: Record<string, string>;
}

/** Keys under translations.recommendations.items */
export type RecommendationCopyKeys =
  | "nextLessonTitle"
  | "nextLessonDesc"
  | "nextLessonReason"
  | "nextLessonCta"
  | "retryQuizTitle"
  | "retryQuizDesc"
  | "retryQuizReason"
  | "retryQuizCta"
  | "feedbackTitle"
  | "feedbackDesc"
  | "feedbackReason"
  | "feedbackCta"
  | "deliverableTitle"
  | "deliverableDesc"
  | "deliverableReason"
  | "deliverableCta"
  | "goalTitle"
  | "goalDesc"
  | "goalReason"
  | "goalCta"
  | "resourcesTitle"
  | "resourcesDesc"
  | "resourcesReason"
  | "resourcesCta"
  | "completeTitle"
  | "completeDesc"
  | "completeReason"
  | "completeCta";

export interface LearnerRecoProfile {
  goal: LearnerGoal | "emploi" | "entrepreneuriat" | string;
  programDay: number;
  level: string;
}
