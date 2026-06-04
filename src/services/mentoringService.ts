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

const DEFAULT_CACHE_KEY = "__default__";
const registrationCache = new Map<string, { raw: string | null; data: MentoringRegistrationState }>();
const sessionsCache = new Map<string, { key: string; data: Array<MentoringSession & { registered: boolean; spotsLeft: number }> }>();

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
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey(userId));
    const cached = registrationCache.get(userId);
    if (cached && cached.raw === raw) return cached.data;
    if (raw) {
      const parsed = JSON.parse(raw) as MentoringRegistrationState;
      const data = {
        ...defaultState(),
        ...parsed,
        spotsBySession: { ...INITIAL_SPOTS, ...parsed.spotsBySession },
      };
      registrationCache.set(userId, { raw, data });
      return data;
    }
  } catch {
    /* empty */
  }
  const data = defaultState();
  registrationCache.set(userId, { raw, data });
  return data;
}

export function saveMentoringRegistrations(userId: string, state: MentoringRegistrationState): void {
  const raw = JSON.stringify(state);
  localStorage.setItem(storageKey(userId), raw);
  registrationCache.set(userId, { raw, data: state });
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
  const cacheKey = registrationCache.get(userId)?.raw ?? DEFAULT_CACHE_KEY;
  const cached = sessionsCache.get(userId);
  if (cached && cached.key === cacheKey) return cached.data;

  const data = mentoringSessions.map((session) => ({
    ...session,
    registered: state.registeredSessionIds.includes(session.id),
    spotsLeft: session.past ? 0 : (state.spotsBySession[session.id] ?? 0),
  }));

  sessionsCache.set(userId, { key: cacheKey, data });
  return data;
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
