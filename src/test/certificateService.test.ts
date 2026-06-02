import { beforeEach, describe, expect, it } from "vitest";
import {
  evaluateCertificateEligibility,
  getCompletedModulesCount,
  issueCertificate,
  MIN_DELIVERABLES_SUBMITTED,
} from "@/services/certificateService";
import { registerForSession } from "@/services/mentoringService";
import { createDeliverable, loadDeliverables, saveDeliverables } from "@/services/deliverableService";
import {
  loadProgress,
  markLessonComplete,
  saveQuizScore,
  LESSON_THRESHOLD_PERCENT,
  QUIZ_PASS_PERCENT,
} from "@/services/progressService";
import { getLessonsForModule, MODULE_IDS } from "@/data/curriculum";

const USER = "test-user-cert";

beforeEach(() => {
  localStorage.removeItem(`fs-progress-${USER}`);
  localStorage.removeItem(`fs-mentoring-${USER}`);
  localStorage.removeItem(`fs-deliverables-${USER}`);
  localStorage.removeItem(`fs-certificate-issued-${USER}`);
});

function completeAllModules() {
  for (const moduleId of MODULE_IDS) {
    const lessons = getLessonsForModule(moduleId);
    const needed = Math.ceil((lessons.length * LESSON_THRESHOLD_PERCENT) / 100);
    for (let i = 0; i < needed; i++) {
      markLessonComplete(USER, lessons[i].id);
    }
    saveQuizScore(USER, moduleId, QUIZ_PASS_PERCENT);
  }
}

function seedDeliverables(count: number) {
  saveDeliverables(
    USER,
    Array.from({ length: count }, (_, i) => ({
      id: `d-seed-${i}`,
      moduleId: "m1",
      type: "other",
      context: "test",
      status: "submitted" as const,
      submittedAt: "2025-03-01",
    }))
  );
}

describe("certificateService", () => {
  it("is not eligible until all criteria are met", () => {
    const progress = loadProgress(USER);
    const result = evaluateCertificateEligibility(USER, progress);
    expect(result.eligible).toBe(false);
    expect(result.criteria.find((c) => c.id === "modules")?.met).toBe(false);
  });

  it("becomes eligible with 5 modules, deliverables and mentoring", () => {
    completeAllModules();
    seedDeliverables(MIN_DELIVERABLES_SUBMITTED);
    registerForSession(USER, "s1");
    const progress = loadProgress(USER);
    const result = evaluateCertificateEligibility(USER, progress);
    expect(getCompletedModulesCount(progress)).toBe(5);
    expect(result.eligible).toBe(true);
  });

  it("issues certificate only when eligible", () => {
    const blocked = issueCertificate(USER, "Test User", "FS-2025-01");
    expect(blocked).toBeNull();
    completeAllModules();
    seedDeliverables(MIN_DELIVERABLES_SUBMITTED);
    registerForSession(USER, "s1");
    const issued = issueCertificate(USER, "Test User", "FS-2025-01");
    expect(issued?.learnerName).toBe("Test User");
    expect(issued?.cohortCode).toBe("FS-2025-01");
  });
});
