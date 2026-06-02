export type MentoringSessionType = "group" | "individual";

export interface MentoringSession {
  id: string;
  theme: string;
  date: string;
  time: string;
  type: MentoringSessionType;
  link?: string;
  objectives: string[];
  documents: string[];
  spotsTotal: number;
  past: boolean;
}

export const mentoringSessions: MentoringSession[] = [
  {
    id: "s1",
    theme: "Gestion du temps & productivité",
    date: "2025-03-20",
    time: "10:00",
    type: "group",
    link: "https://meet.google.com/abc",
    objectives: ["Techniques Pomodoro", "Planification hebdomadaire", "Outils de gestion de tâches"],
    documents: ["Guide-productivité.pdf"],
    spotsTotal: 12,
    past: false,
  },
  {
    id: "s2",
    theme: "Préparer son pitch 60 secondes",
    date: "2025-03-22",
    time: "14:00",
    type: "individual",
    objectives: ["Structurer un pitch efficace", "Techniques de présentation", "Exercices pratiques"],
    documents: [],
    spotsTotal: 4,
    past: false,
  },
  {
    id: "s3",
    theme: "Introduction aux outils IA",
    date: "2025-03-18",
    time: "09:00",
    type: "group",
    objectives: ["Découvrir ChatGPT", "Écrire un bon prompt"],
    documents: ["Slides-IA.pdf", "Exercices.pdf"],
    spotsTotal: 15,
    past: true,
  },
];
