export type DeliverableStatus = "draft" | "submitted" | "feedback" | "overdue";

export interface DeliverableFeedback {
  score: number;
  strengths: string;
  improvements: string;
  nextSteps: string;
  mentorName: string;
  date: string;
}

export interface Deliverable {
  id: string;
  moduleId: string;
  type: string;
  fileName?: string;
  linkUrl?: string;
  context: string;
  status: DeliverableStatus;
  submittedAt?: string;
  feedback?: DeliverableFeedback;
}

const STORAGE_PREFIX = "fs-deliverables-";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function seedDefaults(): Deliverable[] {
  return [
    {
      id: "d1",
      moduleId: "m1",
      type: "other",
      fileName: "exercice-phishing.pdf",
      context: "Analyse de 3 emails suspects.",
      status: "feedback",
      submittedAt: "2025-03-15",
      feedback: {
        score: 85,
        strengths: "Tu as bien identifié les 3 signes principaux d'un email de phishing.",
        improvements: "Ajoute des exemples concrets tirés de ton expérience.",
        nextSteps: "Refais l'exercice avec les 2 nouveaux emails fournis.",
        mentorName: "Moussa K.",
        date: "2025-03-17",
      },
    },
  ];
}

export function loadDeliverables(userId: string): Deliverable[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) return JSON.parse(raw) as Deliverable[];
  } catch {
    /* empty */
  }
  const seeded = seedDefaults();
  saveDeliverables(userId, seeded);
  return seeded;
}

export function saveDeliverables(userId: string, items: Deliverable[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(items));
}

export function createDeliverable(
  userId: string,
  input: Omit<Deliverable, "id" | "status" | "submittedAt" | "feedback"> & { asDraft: boolean }
): Deliverable {
  const list = loadDeliverables(userId);
  const item: Deliverable = {
    id: `d-${Date.now()}`,
    moduleId: input.moduleId,
    type: input.type,
    fileName: input.fileName,
    linkUrl: input.linkUrl,
    context: input.context,
    status: input.asDraft ? "draft" : "submitted",
    submittedAt: input.asDraft ? undefined : new Date().toISOString().slice(0, 10),
  };
  list.unshift(item);
  saveDeliverables(userId, list);
  return item;
}

export function getDeliverable(userId: string, id: string): Deliverable | undefined {
  return loadDeliverables(userId).find((d) => d.id === id);
}
