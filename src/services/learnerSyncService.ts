import { canSyncToSupabase } from "@/lib/userId";
import { loadDeliverables, saveDeliverables } from "@/services/deliverableService";
import { fetchRemoteDeliverables, insertRemoteDeliverable } from "@/services/deliverableRemoteService";
import { mergeProgressData } from "@/services/progressMerge";
import { fetchRemoteProgress, pushRemoteProgress } from "@/services/progressRemoteService";
import { loadProgress, saveProgress } from "@/services/progressService";

export const LEARNER_HYDRATED_EVENT = "fs-learner-hydrated";

function dispatchHydrated() {
  window.dispatchEvent(new Event(LEARNER_HYDRATED_EVENT));
  window.dispatchEvent(new Event("fs-progress-updated"));
  window.dispatchEvent(new Event("fs-deliverables-updated"));
}

/**
 * Pull remote learner data into localStorage cache and merge with any local-only edits.
 */
export async function hydrateLearnerFromSupabase(userId: string): Promise<void> {
  if (!canSyncToSupabase(userId)) return;

  const localProgress = loadProgress(userId);
  const remoteProgress = await fetchRemoteProgress(userId);
  const mergedProgress = remoteProgress
    ? mergeProgressData(localProgress, remoteProgress)
    : localProgress;

  saveProgress(userId, mergedProgress);
  await pushRemoteProgress(userId, mergedProgress);

  const remoteDeliverables = (await fetchRemoteDeliverables(userId)) ?? [];
  const localDeliverables = loadDeliverables(userId, { skipSeed: true });

  if (remoteDeliverables.length === 0 && localDeliverables.length > 0) {
    const migrated = [];
    for (const d of localDeliverables) {
      migrated.push(await insertRemoteDeliverable(userId, d));
    }
    saveDeliverables(userId, migrated);
  } else {
    saveDeliverables(userId, remoteDeliverables);
  }

  dispatchHydrated();
}
