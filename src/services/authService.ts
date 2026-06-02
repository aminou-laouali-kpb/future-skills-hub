import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured, MOCK_DEMO_OTP } from "@/lib/supabase";
import { clearMockSession, saveMockSession } from "@/types/profile";

function isEmail(contact: string): boolean {
  return contact.includes("@");
}

function normalizePhone(contact: string): string {
  const trimmed = contact.trim();
  if (trimmed.startsWith("+")) return trimmed;
  return `+${trimmed.replace(/\D/g, "")}`;
}

export async function sendLoginOtp(contact: string): Promise<void> {
  const trimmed = contact.trim();
  if (!trimmed) throw new Error("CONTACT_REQUIRED");

  if (!isSupabaseConfigured) {
    return;
  }

  const supabase = getSupabase()!;
  if (isEmail(trimmed)) {
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  } else {
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizePhone(trimmed),
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  }
}

export async function verifyLoginOtp(
  contact: string,
  token: string
): Promise<{ user: User; session: Session | null }> {
  const trimmed = contact.trim();
  if (!trimmed || token.length < 6) throw new Error("INVALID_OTP");

  if (!isSupabaseConfigured) {
    if (token !== MOCK_DEMO_OTP) throw new Error("INVALID_OTP");
    const userId = `mock-${btoa(trimmed).replace(/[^a-z0-9]/gi, "").slice(0, 16)}`;
    saveMockSession(userId, trimmed);
    const mockUser = { id: userId, email: isEmail(trimmed) ? trimmed : undefined } as User;
    return { user: mockUser, session: null };
  }

  const supabase = getSupabase()!;
  const params = isEmail(trimmed)
    ? { email: trimmed, token, type: "email" as const }
    : { phone: normalizePhone(trimmed), token, type: "sms" as const };

  const { data, error } = await supabase.auth.verifyOtp(params);
  if (error) throw error;
  if (!data.user) throw new Error("NO_USER");

  return { user: data.user, session: data.session };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured) {
    clearMockSession();
    return;
  }
  const supabase = getSupabase()!;
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabase()!;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function subscribeAuth(
  onChange: (session: Session | null) => void
): (() => void) | undefined {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    onChange(session);
  });
  return () => data.subscription.unsubscribe();
}
