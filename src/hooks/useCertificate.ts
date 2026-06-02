import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLearnerDisplay } from "@/hooks/useLearnerDisplay";
import { useProgressStore } from "@/hooks/useProgress";
import {
  evaluateCertificateEligibility,
  getIssuedCertificate,
  issueCertificate,
  type CertificateEligibility,
  type IssuedCertificate,
} from "@/services/certificateService";

function subscribe(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("fs-certificate-updated", handler);
  window.addEventListener("fs-progress-updated", handler);
  window.addEventListener("fs-mentoring-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("fs-certificate-updated", handler);
    window.removeEventListener("fs-progress-updated", handler);
    window.removeEventListener("fs-mentoring-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

export function useCertificate() {
  const { user } = useAuth();
  const learner = useLearnerDisplay();
  const { progress, userId } = useProgressStore();

  const learnerName = `${learner.firstName} ${learner.lastName}`.trim();
  const cohortCode = learner.cohort;

  const eligibility = useMemo(
    (): CertificateEligibility => evaluateCertificateEligibility(userId, progress),
    [userId, progress]
  );

  const issued = useSyncExternalStore(
    subscribe,
    () => getIssuedCertificate(userId),
    () => getIssuedCertificate(userId)
  );

  const claim = useCallback((): IssuedCertificate | null => {
    return issueCertificate(userId, learnerName, cohortCode, progress);
  }, [userId, learnerName, cohortCode, progress]);

  return {
    eligibility,
    issued,
    claim,
    isAuthenticated: !!user || learner.isAuthenticated,
  };
}
