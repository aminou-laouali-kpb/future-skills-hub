import { mentoringSessions, type MentoringSession } from "@/data/mentoringCatalog";
import { canSyncToSupabase } from "@/lib/userId";
import {
  buildRemoteMentoringState,
  pushRemoteMentoringRegistration,
} from "@/services/mentoringRemoteService";

const STORAGE_PREFIX = "fs-mentoring-";

const INITIAL_SPOTS: Record<string, number> = {
  s1: 5,
  s2: 1,
  s3: 0,
};

export interface MentoringRegistrationState {
  registeredSessionIds: string[];
  spotsBySession: Record<string, number>;
}

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function defaultState(): MentoringRegistrationState {
  return { registeredSessionIds: [], spotsBySession: { ...INITIAL_SPOTS } };
}

export function loadMentoringRegistrations(userId: string): MentoringRegistrationState {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as MentoringRegistrationState;
      return {
        ...defaultState(),
        ...parsed,
        spotsBySession: { ...INITIAL_SPOTS, ...parsed.spotsBySession },
      };
    }
  } catch {
    /* empty */
  }
  return defaultState();
}

export function saveMentoringRegistrations(userId: string, state: MentoringRegistrationState): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

export function registerForSession(userId: string, sessionId: string): MentoringRegistrationState {
  const state = loadMentoringRegistrations(userId);
  const session = mentoringSessions.find((s) => s.id === sessionId);
  if (!session || session.past) return state;
  if (state.registeredSessionIds.includes(sessionId)) return state;

  const spotsLeft = state.spotsBySession[sessionId] ?? 0;
  if (spotsLeft <= 0) return state;

  state.registeredSessionIds.push(sessionId);
  state.spotsBySession[sessionId] = spotsLeft - 1;
  saveMentoringRegistrations(userId, state);
  window.dispatchEvent(new Event("fs-mentoring-updated"));

  if (canSyncToSupabase(userId)) {
    void pushRemoteMentoringRegistration(userId, sessionId).catch((err) => {
      console.warn("[Future Skills] mentoring sync failed", err);
    });
  }

  return state;
}

export function isRegistered(userId: string, sessionId: string): boolean {
  return loadMentoringRegistrations(userId).registeredSessionIds.includes(sessionId);
}

export function hasMentoringRequirement(userId: string): number {
  return loadMentoringRegistrations(userId).registeredSessionIds.length;
}

export function listSessionsWithRegistration(userId: string) {
  const state = loadMentoringRegistrations(userId);
  return mentoringSessions.map((session) => ({
    ...session,
    registered: state.registeredSessionIds.includes(session.id),
    spotsLeft: session.past ? 0 : (state.spotsBySession[session.id] ?? 0),
  }));
}

/** Replace local cache from Supabase (called on hydrate). */
export function applyMentoringState(userId: string, state: MentoringRegistrationState): void {
  saveMentoringRegistrations(userId, state);
  window.dispatchEvent(new Event("fs-mentoring-updated"));
}

export async function refreshMentoringFromRemote(userId: string): Promise<void> {
  if (!canSyncToSupabase(userId)) return;
  const remote = await buildRemoteMentoringState(userId);
  if (remote) applyMentoringState(userId, remote);
}
