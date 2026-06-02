import { MODULE_IDS } from "@/data/curriculum";
import { canSyncToSupabase } from "@/lib/userId";
import { fetchRemoteIssuedCertificate, pushRemoteIssuedCertificate } from "@/services/certificateRemoteService";
import { loadDeliverables } from "@/services/deliverableService";
import { hasMentoringRequirement } from "@/services/mentoringService";
import {
  isModuleComplete,
  loadProgress,
  type UserProgressData,
} from "@/services/progressService";

export const MIN_DELIVERABLES_SUBMITTED = 3;
export const MIN_MENTORING_SESSIONS = 1;

export type CertificateCriterionId = "modules" | "deliverables" | "mentoring";

export interface CertificateCriterion {
  id: CertificateCriterionId;
  met: boolean;
  current: number;
  required: number;
}

export interface CertificateEligibility {
  eligible: boolean;
  criteria: CertificateCriterion[];
  completedModulesCount: number;
}

export interface IssuedCertificate {
  issuedAt: string;
  learnerName: string;
  cohortCode: string;
}

const ISSUED_PREFIX = "fs-certificate-issued-";

function issuedKey(userId: string) {
  return `${ISSUED_PREFIX}${userId}`;
}

export function getCompletedModulesCount(progress: UserProgressData): number {
  const completed = new Set(progress.completedLessonIds);
  return MODULE_IDS.filter((id) => isModuleComplete(id, completed, progress.quizBestByModule)).length;
}

export function countSubmittedDeliverables(userId: string): number {
  return loadDeliverables(userId, { skipSeed: canSyncToSupabase(userId) }).filter(
    (d) => d.status === "submitted" || d.status === "feedback"
  ).length;
}

export function evaluateCertificateEligibility(
  userId: string,
  progress: UserProgressData
): CertificateEligibility {
  const completedModulesCount = getCompletedModulesCount(progress);
  const modulesMet = completedModulesCount >= MODULE_IDS.length;
  const deliverableCount = countSubmittedDeliverables(userId);
  const deliverablesMet = deliverableCount >= MIN_DELIVERABLES_SUBMITTED;
  const mentoringCount = hasMentoringRequirement(userId);
  const mentoringMet = mentoringCount >= MIN_MENTORING_SESSIONS;

  return {
    eligible: modulesMet && deliverablesMet && mentoringMet,
    completedModulesCount,
    criteria: [
      {
        id: "modules",
        met: modulesMet,
        current: completedModulesCount,
        required: MODULE_IDS.length,
      },
      {
        id: "deliverables",
        met: deliverablesMet,
        current: deliverableCount,
        required: MIN_DELIVERABLES_SUBMITTED,
      },
      {
        id: "mentoring",
        met: mentoringMet,
        current: mentoringCount,
        required: MIN_MENTORING_SESSIONS,
      },
    ],
  };
}

export function getIssuedCertificate(userId: string): IssuedCertificate | null {
  try {
    const raw = localStorage.getItem(issuedKey(userId));
    if (raw) return JSON.parse(raw) as IssuedCertificate;
  } catch {
    /* empty */
  }
  return null;
}

export function saveIssuedCertificateLocal(userId: string, issued: IssuedCertificate): void {
  localStorage.setItem(issuedKey(userId), JSON.stringify(issued));
  window.dispatchEvent(new Event("fs-certificate-updated"));
}

export function issueCertificate(
  userId: string,
  learnerName: string,
  cohortCode: string,
  progress?: UserProgressData
): IssuedCertificate | null {
  const data = progress ?? loadProgress(userId);
  const eligibility = evaluateCertificateEligibility(userId, data);
  if (!eligibility.eligible) return null;

  const issued: IssuedCertificate = {
    issuedAt: new Date().toISOString(),
    learnerName,
    cohortCode,
  };

  saveIssuedCertificateLocal(userId, issued);

  if (canSyncToSupabase(userId)) {
    void pushRemoteIssuedCertificate(userId, issued).catch((err) => {
      console.warn("[Future Skills] certificate sync failed", err);
    });
  }

  return issued;
}

export function applyIssuedCertificateLocal(userId: string, issued: IssuedCertificate | null): void {
  if (issued) {
    saveIssuedCertificateLocal(userId, issued);
  } else {
    localStorage.removeItem(issuedKey(userId));
    window.dispatchEvent(new Event("fs-certificate-updated"));
  }
}
