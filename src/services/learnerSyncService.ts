import { canSyncToSupabase } from "@/lib/userId";
import { applyIssuedCertificateLocal } from "@/services/certificateService";
import { fetchRemoteIssuedCertificate, pushRemoteIssuedCertificate } from "@/services/certificateRemoteService";
import { loadDeliverables, saveDeliverables } from "@/services/deliverableService";
import { fetchRemoteDeliverables, insertRemoteDeliverable } from "@/services/deliverableRemoteService";
import { applyMentoringState, loadMentoringRegistrations } from "@/services/mentoringService";
import {
  buildRemoteMentoringState,
  pushRemoteMentoringRegistration,
} from "@/services/mentoringRemoteService";
import { mergeProgressData } from "@/services/progressMerge";
import { fetchRemoteProgress, pushRemoteProgress } from "@/services/progressRemoteService";
import { loadProgress, saveProgress } from "@/services/progressService";
import { getIssuedCertificate } from "@/services/certificateService";

export const LEARNER_HYDRATED_EVENT = "fs-learner-hydrated";

function dispatchHydrated() {
  window.dispatchEvent(new Event(LEARNER_HYDRATED_EVENT));
  window.dispatchEvent(new Event("fs-progress-updated"));
  window.dispatchEvent(new Event("fs-deliverables-updated"));
  window.dispatchEvent(new Event("fs-mentoring-updated"));
  window.dispatchEvent(new Event("fs-certificate-updated"));
}

async function hydrateMentoring(userId: string): Promise<void> {
  const local = loadMentoringRegistrations(userId);
  const remote = await buildRemoteMentoringState(userId);

  if (!remote) return;

  const mergedIds = [...new Set([...local.registeredSessionIds, ...remote.registeredSessionIds])];

  if (remote.registeredSessionIds.length === 0 && local.registeredSessionIds.length > 0) {
    for (const sessionId of local.registeredSessionIds) {
      await pushRemoteMentoringRegistration(userId, sessionId);
    }
    const refreshed = await buildRemoteMentoringState(userId);
    if (refreshed) applyMentoringState(userId, refreshed);
    return;
  }

  applyMentoringState(userId, {
    registeredSessionIds: mergedIds,
    spotsBySession: remote.spotsBySession,
  });
}

async function hydrateCertificate(userId: string): Promise<void> {
  const local = getIssuedCertificate(userId);
  const remote = await fetchRemoteIssuedCertificate(userId);

  if (remote) {
    applyIssuedCertificateLocal(userId, remote);
    return;
  }

  if (local) {
    await pushRemoteIssuedCertificate(userId, local);
    applyIssuedCertificateLocal(userId, local);
  }
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

  await hydrateMentoring(userId);
  await hydrateCertificate(userId);

  dispatchHydrated();
}