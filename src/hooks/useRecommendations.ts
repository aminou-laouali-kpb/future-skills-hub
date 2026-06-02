import { useMemo } from "react";
import { useLearnerProfile } from "@/contexts/AuthContext";
import { useDeliverables } from "@/hooks/useDeliverables";
import { useLearnerDisplay } from "@/hooks/useLearnerDisplay";
import { useProgressStore } from "@/hooks/useProgress";
import {
  computeRecommendations,
  getPrimaryRecommendation,
  getSecondaryRecommendations,
  type RecommendationContext,
} from "@/services/recommendationEngine";

export function useRecommendations() {
  const { progress, modules } = useProgressStore();
  const { deliverables } = useDeliverables();
  const learner = useLearnerDisplay();
  const profile = useLearnerProfile();

  const ctx: RecommendationContext = useMemo(
    () => ({
      progress,
      modules,
      deliverables,
      learner: {
        goal: profile?.goal ?? learner.goal,
        programDay: learner.day,
        level: profile?.level ?? learner.level,
      },
    }),
    [progress, modules, deliverables, profile, learner]
  );

  const all = useMemo(() => computeRecommendations(ctx), [ctx]);
  const primary = useMemo(() => getPrimaryRecommendation(ctx), [ctx]);
  const secondary = useMemo(() => getSecondaryRecommendations(ctx, 2), [ctx]);

  return { all, primary, secondary, ctx };
}
