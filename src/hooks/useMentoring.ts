import { useCallback, useSyncExternalStore } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { listSessionsWithRegistration, registerForSession } from "@/services/mentoringService";

const GUEST_ID = "guest";

function subscribe(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("fs-mentoring-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("fs-mentoring-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

export function useMentoring() {
  const { user } = useAuth();
  const userId = user?.id ?? GUEST_ID;

  const sessions = useSyncExternalStore(
    subscribe,
    () => listSessionsWithRegistration(userId),
    () => listSessionsWithRegistration(userId)
  );

  const register = useCallback(
    (sessionId: string) => {
      registerForSession(userId, sessionId);
    },
    [userId]
  );

  return { sessions, register, registrationCount: sessions.filter((s) => s.registered).length };
}
