import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase";
import * as authService from "@/services/authService";
import { completeOnboarding, getProfile } from "@/services/profileService";
import { hydrateLearnerFromSupabase } from "@/services/learnerSyncService";
import {
  type LearnerProfile,
  type OnboardingPayload,
  loadMockProfile,
  loadMockSession,
} from "@/types/profile";

interface AuthContextValue {
  user: User | null;
  profile: LearnerProfile | null;
  loading: boolean;
  isMockMode: boolean;
  contact: string | null;
  sendOtp: (contact: string) => Promise<void>;
  verifyOtp: (contact: string, token: string) => Promise<LearnerProfile | null>;
  signOut: () => Promise<void>;
  saveOnboarding: (payload: OnboardingPayload) => Promise<LearnerProfile>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<string | null>(null);

  const isMockMode = !isSupabaseConfigured;

  const loadProfileForUser = useCallback(async (u: User, c?: string | null) => {
    const p = await getProfile(u.id);
    setProfile(p);
    if (c) setContact(c);
    else if (p?.contact) setContact(p.contact);
    try {
      await hydrateLearnerFromSupabase(u.id);
    } catch (err) {
      console.warn("[Future Skills] learner hydrate failed", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        if (isSupabaseConfigured) {
          const session = await authService.getSession();
          if (cancelled) return;
          if (session?.user) {
            setUser(session.user);
            await loadProfileForUser(session.user);
          }
        } else {
          const mockSession = loadMockSession();
          if (mockSession) {
            const mockUser = { id: mockSession.userId } as User;
            setUser(mockUser);
            setContact(mockSession.contact);
            const p = loadMockProfile();
            if (p) setProfile(p);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    const unsubscribe = authService.subscribeAuth(async (session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfileForUser(session.user);
      } else if (isSupabaseConfigured) {
        setUser(null);
        setProfile(null);
        setContact(null);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [loadProfileForUser]);

  const sendOtp = useCallback(async (c: string) => {
    setContact(c.trim());
    await authService.sendLoginOtp(c);
  }, []);

  const verifyOtp = useCallback(async (c: string, token: string) => {
    const { user: u } = await authService.verifyLoginOtp(c, token);
    setUser(u);
    setContact(c.trim());
    const prof = await getProfile(u.id);
    setProfile(prof);
    if (prof?.contact) setContact(prof.contact);
    return prof;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setContact(null);
  }, []);

  const saveOnboarding = useCallback(
    async (payload: OnboardingPayload) => {
      if (!user || !contact) throw new Error("NOT_AUTHENTICATED");
      const p = await completeOnboarding(user.id, contact, payload);
      setProfile(p);
      return p;
    },
    [user, contact]
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfileForUser(user);
  }, [user, loadProfileForUser]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isMockMode,
      contact,
      sendOtp,
      verifyOtp,
      signOut,
      saveOnboarding,
      refreshProfile,
    }),
    [user, profile, loading, isMockMode, contact, sendOtp, verifyOtp, signOut, saveOnboarding, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Profile from auth or null when browsing in demo mode. */
export function useLearnerProfile(): LearnerProfile | null {
  const { profile } = useAuth();
  return profile;
}
