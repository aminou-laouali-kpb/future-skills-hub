import { useCallback, useSyncExternalStore } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createDeliverable,
  getDeliverable,
  loadDeliverables,
  type Deliverable,
} from "@/services/deliverableService";

const GUEST_ID = "guest";

function useDeliverableUserId(): string {
  const { user } = useAuth();
  return user?.id ?? GUEST_ID;
}

function subscribe(onChange: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key?.startsWith("fs-deliverables-")) onChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("fs-deliverables-updated", onChange);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("fs-deliverables-updated", onChange);
  };
}

export function useDeliverables() {
  const userId = useDeliverableUserId();

  const deliverables = useSyncExternalStore(
    subscribe,
    () => loadDeliverables(userId),
    () => loadDeliverables(userId)
  );

  const bump = useCallback(() => {
    window.dispatchEvent(new Event("fs-deliverables-updated"));
  }, []);

  const addDeliverable = useCallback(
    (input: Parameters<typeof createDeliverable>[1]) => {
      const item = createDeliverable(userId, input);
      bump();
      return item;
    },
    [userId, bump]
  );

  const getById = useCallback((id: string) => getDeliverable(userId, id), [userId]);

  return { deliverables, addDeliverable, getById };
}

export type { Deliverable };
