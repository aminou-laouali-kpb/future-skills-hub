import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { modules } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLearnerDisplay } from "@/hooks/useLearnerDisplay";
import { cn } from "@/lib/utils";

const PLAN_META = [
  { day: 1, moduleId: "m1", durationMin: 60 },
  { day: 2, moduleId: "m1", durationMin: 75 },
  { day: 3, moduleId: "m2", durationMin: 90 },
  { day: 4, moduleId: "m2", durationMin: 90 },
  { day: 5, moduleId: "m3", durationMin: 75 },
  { day: 6, moduleId: "m3", durationMin: 90 },
  { day: 7, moduleId: "m4", durationMin: 90 },
  { day: 8, moduleId: "m4", durationMin: 75 },
  { day: 9, moduleId: "m5", durationMin: 90 },
  { day: 10, moduleId: "m5", durationMin: 120 },
] as const;

export default function DayPlan() {
  const { t } = useLanguage();
  const learner = useLearnerDisplay();
  const today = learner.day;

  return (
    <div className="container py-6 pb-24 md:pb-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t.dayPlan.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t.dayPlan.subtitle}</p>
      </div>

      <div className="space-y-3">
        {PLAN_META.map((meta, index) => {
          const dayContent = t.dayPlan.days[index];
          const isPast = meta.day < today;
          const isToday = meta.day === today;
          const mod = modules.find((m) => m.id === meta.moduleId);
          const dayLabel = t.dayPlan.dayLabel.replace("{day}", String(meta.day));

          return (
            <Card
              key={meta.day}
              className={cn("transition-all", isToday && "ring-2 ring-primary shadow-elevated", isPast && "opacity-70")}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold",
                    isToday ? "bg-primary text-primary-foreground" : isPast ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  )}
                >
                  {isPast ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm">{dayLabel}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{mod?.shortTitle}</span>
                    <h3 className="text-sm font-semibold truncate">{dayContent?.title ?? mod?.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dayContent?.task} · ~{meta.durationMin} {t.dayPlan.minutesShort}
                  </p>
                </div>
                {!isPast && (
                  <Link
                    to={`/modules/${meta.moduleId}`}
                    className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline flex-shrink-0"
                  >
                    {t.modules.open} <ArrowRight className="h-3 w-3" />
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
