import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { currentUser, modules } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface DayItem {
  day: number;
  moduleId: string;
  title: string;
  taskFr: string;
  taskEn: string;
  durationMin: number;
}

const plan: DayItem[] = [
  { day: 1, moduleId: "m1", title: "Culture numérique", taskFr: "Leçons 1-3 + quiz intro", taskEn: "Lessons 1-3 + intro quiz", durationMin: 60 },
  { day: 2, moduleId: "m1", title: "Culture numérique", taskFr: "Leçons 4-6 + quiz final", taskEn: "Lessons 4-6 + final quiz", durationMin: 75 },
  { day: 3, moduleId: "m2", title: "Outils & productivité", taskFr: "Drive, Notion, organisation", taskEn: "Drive, Notion, organization", durationMin: 90 },
  { day: 4, moduleId: "m2", title: "Outils & productivité", taskFr: "Mini-projet collaboratif", taskEn: "Mini collaborative project", durationMin: 90 },
  { day: 5, moduleId: "m3", title: "Introduction à l'IA", taskFr: "Comprendre les LLM + prompts", taskEn: "Understanding LLMs + prompts", durationMin: 75 },
  { day: 6, moduleId: "m3", title: "Introduction à l'IA", taskFr: "Créer un agent IA simple", taskEn: "Build a simple AI agent", durationMin: 90 },
  { day: 7, moduleId: "m4", title: "Employabilité", taskFr: "CV + lettre + email pro", taskEn: "CV + cover letter + pro email", durationMin: 90 },
  { day: 8, moduleId: "m4", title: "Employabilité", taskFr: "Pitch 60s + simulation entretien", taskEn: "60s pitch + interview sim", durationMin: 75 },
  { day: 9, moduleId: "m5", title: "Entrepreneuriat", taskFr: "Idéation + mini business plan", taskEn: "Ideation + mini business plan", durationMin: 90 },
  { day: 10, moduleId: "m5", title: "Entrepreneuriat", taskFr: "Pitch final + certificat", taskEn: "Final pitch + certificate", durationMin: 120 },
];

export default function DayPlan() {
  const { lang } = useLanguage();
  const today = currentUser.day;

  return (
    <div className="container py-6 pb-24 md:pb-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {lang === "fr" ? "Plan des 10 jours" : "10-day plan"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "fr"
            ? "Une routine simple, jour par jour, pour réussir ton programme."
            : "A simple daily routine to complete your program."}
        </p>
      </div>

      <div className="space-y-3">
        {plan.map((d) => {
          const isPast = d.day < today;
          const isToday = d.day === today;
          const mod = modules.find((m) => m.id === d.moduleId);
          return (
            <Card
              key={d.day}
              className={cn(
                "transition-all",
                isToday && "ring-2 ring-primary shadow-elevated",
                isPast && "opacity-70"
              )}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold",
                    isToday ? "bg-primary text-primary-foreground" : isPast ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  )}
                >
                  {isPast ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm">J{d.day}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{mod?.shortTitle}</span>
                    <h3 className="text-sm font-semibold truncate">{d.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "fr" ? d.taskFr : d.taskEn} · ~{d.durationMin} min
                  </p>
                </div>
                {!isPast && (
                  <Link
                    to={`/modules/${d.moduleId}`}
                    className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline flex-shrink-0"
                  >
                    {lang === "fr" ? "Ouvrir" : "Open"} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
                {isPast && <Circle className="h-4 w-4 text-success flex-shrink-0" />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
