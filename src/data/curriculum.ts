import type { Lesson, QuizQuestion } from "@/data/mockData";
import { lessonsM1, quizM1 } from "@/data/mockData";

function stubLessons(moduleId: string, titles: string[], withVideo = false): Lesson[] {
  return titles.map((title, i) => ({
    id: `${moduleId}-l${i + 1}`,
    moduleId,
    title,
    content: `${title} — contenu de la leçon. Des exemples adaptés au contexte nigérien et des exercices pratiques complètent cette section.`,
    order: i + 1,
    completed: false,
    duration: `${6 + (i % 4)} min`,
    ...(withVideo && i < 2 ? { videoId: "PLACEHOLDER" as const, videoDurationSec: 480, videoSizeMB: 15 } : {}),
  }));
}

function stubQuiz(moduleId: string, topic: string): QuizQuestion[] {
  return [
    {
      id: `${moduleId}-q1`,
      question: `Concernant ${topic}, quelle affirmation est la plus juste ?`,
      options: ["Toujours faire confiance aux messages reçus", "Vérifier la source avant d'agir", "Ignorer les bonnes pratiques", "Partager sans réfléchir"],
      correctIndex: 1,
      explanation: "La vérification de la source est une compétence clé du module.",
      type: "qcm",
    },
    {
      id: `${moduleId}-q2`,
      question: `Ce module t'aide à progresser sur ${topic}.`,
      options: ["Vrai", "Faux"],
      correctIndex: 0,
      explanation: "Chaque module Future Skills vise des compétences concrètes et applicables.",
      type: "true_false",
    },
    {
      id: `${moduleId}-q3`,
      question: `Quelle est la meilleure approche pour ${topic} ?`,
      options: ["Travailler seul sans retour", "Pratiquer avec des exemples réels", "Copier sans comprendre", "Sauter les exercices"],
      correctIndex: 1,
      explanation: "La pratique sur des cas réels renforce l'apprentissage.",
      type: "qcm",
    },
    {
      id: `${moduleId}-q4`,
      question: `Un livrable lié à ${topic} peut enrichir ton CV.`,
      options: ["Vrai", "Faux"],
      correctIndex: 0,
      explanation: "Les livrables Future Skills sont conçus pour ton employabilité.",
      type: "true_false",
    },
    {
      id: `${moduleId}-q5`,
      question: `Pour valider ce module, tu dois viser au moins 60 % au quiz.`,
      options: ["Vrai", "Faux"],
      correctIndex: 0,
      explanation: "Le seuil de validation du quiz est de 60 %, en plus de 80 % des leçons.",
      type: "true_false",
    },
  ];
}

export const lessonsByModule: Record<string, Lesson[]> = {
  m1: lessonsM1,
  m2: stubLessons("m2", [
    "Google Drive : organiser ses fichiers",
    "Word & PowerPoint : bases efficaces",
    "Notion pour un espace projet",
    "Gestion de tâches au quotidien",
    "Collaborer à distance",
    "Mini-projet : espace équipe",
  ], true),
  m3: stubLessons("m3", [
    "Types d'IA et cas d'usage",
    "Comprendre les LLM",
    "Écrire un bon prompt",
    "Limites et biais de l'IA",
    "Créer un agent IA simple",
  ], true),
  m4: stubLessons("m4", [
    "Email professionnel",
    "CV adapté au marché",
    "Lettre de motivation",
    "Pitch 60 secondes",
    "Simulation d'entretien",
    "Réseau professionnel en ligne",
  ]),
  m5: stubLessons("m5", [
    "Idéation et validation marché",
    "Mini business plan",
    "Stratégie digitale",
    "Financement : les bases",
    "Pitch investisseur",
    "Préparer le pitch final",
    "Bilan du parcours",
  ]),
};

export const quizByModule: Record<string, QuizQuestion[]> = {
  m1: quizM1,
  m2: stubQuiz("m2", "les outils collaboratifs"),
  m3: stubQuiz("m3", "l'intelligence artificielle"),
  m4: stubQuiz("m4", "l'employabilité"),
  m5: stubQuiz("m5", "l'entrepreneuriat"),
};

export function getLessonsForModule(moduleId: string): Lesson[] {
  return lessonsByModule[moduleId] ?? [];
}

export function getQuizForModule(moduleId: string): QuizQuestion[] {
  return quizByModule[moduleId] ?? [];
}

export const MODULE_IDS = ["m1", "m2", "m3", "m4", "m5"] as const;
export type ModuleId = (typeof MODULE_IDS)[number];
