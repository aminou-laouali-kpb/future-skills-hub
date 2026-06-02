import type { LearnerGoal, LearnerLevel } from "@/types/database";

export interface LearnerProfile {
  id: string;
  cohortId: string | null;
  cohortCode: string | null;
  cohortName: string | null;
  firstName: string;
  lastName: string;
  city: string | null;
  level: LearnerLevel;
  goal: LearnerGoal;
  whatsappOptIn: boolean;
  phone: string | null;
  contact: string | null;
  programDay: number;
  totalDays: number;
  onboardingCompleted: boolean;
}

export interface OnboardingPayload {
  cohortCode: string;
  firstName: string;
  lastName: string;
  city: string;
  level: LearnerLevel;
  goal: LearnerGoal;
  whatsappOptIn: boolean;
  phone: string;
}

const MOCK_STORAGE_KEY = "fs-mock-profile";
const MOCK_SESSION_KEY = "fs-mock-session";

export function loadMockSession(): { userId: string; contact: string } | null {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMockSession(userId: string, contact: string) {
  localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ userId, contact }));
}

export function clearMockSession() {
  localStorage.removeItem(MOCK_SESSION_KEY);
  localStorage.removeItem(MOCK_STORAGE_KEY);
}

export function loadMockProfile(): LearnerProfile | null {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMockProfile(profile: LearnerProfile) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(profile));
}
