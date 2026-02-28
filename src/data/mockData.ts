// Mock data for the LMS
export interface Module {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  objectives: string[];
  duration: string;
  order: number;
  lessonsCount: number;
  status: "locked" | "in_progress" | "completed";
  progress: number;
  icon: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
  completed: boolean;
  duration: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: "qcm" | "true_false";
}

export const modules: Module[] = [
  {
    id: "m1",
    title: "Culture numérique",
    shortTitle: "M1",
    description: "Internet, risques numériques, cybersécurité, vérification des sources et contenu IA.",
    objectives: ["Naviguer en sécurité sur internet", "Détecter le phishing et les fake news", "Créer des mots de passe solides", "Comprendre le contenu généré par IA"],
    duration: "2 jours",
    order: 1,
    lessonsCount: 6,
    status: "in_progress",
    progress: 60,
    icon: "🌐",
  },
  {
    id: "m2",
    title: "Outils collaboratifs & productivité",
    shortTitle: "M2",
    description: "PowerPoint, Word, Google Drive, Notion, gestion de tâches et espaces projets.",
    objectives: ["Maîtriser les outils bureautiques", "Organiser un espace projet collaboratif", "Gérer ses tâches efficacement", "Créer une présentation impactante"],
    duration: "2 jours",
    order: 2,
    lessonsCount: 6,
    status: "locked",
    progress: 0,
    icon: "🛠️",
  },
  {
    id: "m3",
    title: "Introduction à l'IA",
    shortTitle: "M3",
    description: "Types d'IA, LLM, limites, amélioration de prompts, création d'un agent IA.",
    objectives: ["Comprendre les différents types d'IA", "Écrire des prompts efficaces", "Connaître les limites des LLM", "Créer un agent IA simple"],
    duration: "2 jours",
    order: 3,
    lessonsCount: 5,
    status: "locked",
    progress: 0,
    icon: "🤖",
  },
  {
    id: "m4",
    title: "Employabilité & intégration pro",
    shortTitle: "M4",
    description: "Emails professionnels, CV, lettre de motivation, pitch 60s, simulations d'entretien.",
    objectives: ["Rédiger un email professionnel", "Créer un CV adapté", "Préparer un pitch de 60 secondes", "Réussir une simulation d'entretien"],
    duration: "2 jours",
    order: 4,
    lessonsCount: 6,
    status: "locked",
    progress: 0,
    icon: "💼",
  },
  {
    id: "m5",
    title: "Entrepreneuriat",
    shortTitle: "M5",
    description: "Idéation, marché, business plan, stratégie digitale, financement, pitch final.",
    objectives: ["Structurer une idée d'entreprise", "Rédiger un mini business plan", "Définir une stratégie digitale", "Préparer un pitch investisseur"],
    duration: "2 jours",
    order: 5,
    lessonsCount: 7,
    status: "locked",
    progress: 0,
    icon: "🚀",
  },
];

export const lessonsM1: Lesson[] = [
  { id: "l1", moduleId: "m1", title: "Internet : comment ça marche ?", content: "Internet est un réseau mondial qui connecte des milliards d'appareils. Comprendre ses bases est essentiel pour naviguer en toute sécurité...", order: 1, completed: true, duration: "8 min" },
  { id: "l2", moduleId: "m1", title: "Les risques en ligne : phishing & arnaques", content: "Le phishing est une technique utilisée par les cybercriminels pour voler vos informations personnelles...", order: 2, completed: true, duration: "10 min" },
  { id: "l3", moduleId: "m1", title: "Fake news : vérifier ses sources", content: "Les fausses informations se propagent rapidement en ligne. Apprenez à vérifier avant de partager...", order: 3, completed: true, duration: "7 min" },
  { id: "l4", moduleId: "m1", title: "Contenus générés par l'IA", content: "L'IA peut créer des textes, images et vidéos très réalistes. Comment les reconnaître ?", order: 4, completed: false, duration: "8 min" },
  { id: "l5", moduleId: "m1", title: "Cybersécurité au quotidien", content: "Protégez vos comptes et vos données avec des pratiques simples mais efficaces...", order: 5, completed: false, duration: "10 min" },
  { id: "l6", moduleId: "m1", title: "Mots de passe & authentification", content: "Un bon mot de passe est votre première ligne de défense. Découvrez comment en créer un solide...", order: 6, completed: false, duration: "6 min" },
];

export const quizM1: QuizQuestion[] = [
  { id: "q1", question: "Quel est le signe le plus courant d'un email de phishing ?", options: ["Un logo officiel", "Une adresse email suspecte", "Un message court", "Une pièce jointe PDF"], correctIndex: 1, explanation: "Les emails de phishing utilisent souvent des adresses qui imitent des entreprises connues mais avec des fautes ou des domaines différents.", type: "qcm" },
  { id: "q2", question: "Un mot de passe de 6 caractères est suffisant pour protéger un compte important.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Un mot de passe de 6 caractères peut être craqué en quelques minutes. Utilisez au moins 12 caractères avec des majuscules, chiffres et symboles.", type: "true_false" },
  { id: "q3", question: "Comment vérifier si une information est fiable ?", options: ["La partager pour voir les réactions", "Vérifier la source et croiser avec d'autres médias", "Faire confiance si beaucoup de gens la partagent", "Ignorer l'information"], correctIndex: 1, explanation: "Toujours vérifier la source originale et croiser l'information avec au moins 2-3 sources fiables avant de la considérer comme vraie.", type: "qcm" },
  { id: "q4", question: "L'IA peut générer des images de personnes qui n'existent pas.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Les GAN (Generative Adversarial Networks) et d'autres modèles IA peuvent créer des visages photoréalistes de personnes fictives.", type: "true_false" },
  { id: "q5", question: "Quelle est la meilleure pratique pour les mots de passe ?", options: ["Utiliser le même partout", "Les noter sur un papier", "Utiliser un gestionnaire de mots de passe", "Utiliser sa date de naissance"], correctIndex: 2, explanation: "Un gestionnaire de mots de passe génère et stocke des mots de passe uniques et complexes pour chaque compte.", type: "qcm" },
];

export const currentUser = {
  firstName: "Amina",
  lastName: "Moussa",
  cohort: "FS-2025-01",
  cohortName: "Future Skills Cohorte 1",
  day: 3,
  totalDays: 10,
  goal: "emploi" as const,
  level: "debutant" as const,
  city: "Niamey",
};
