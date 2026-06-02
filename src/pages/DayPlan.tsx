import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import { modules } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLearnerDisplay } from "@/hooks/useLearnerDisplay";
import { useRecommendations } from "@/hooks/useRecommendations";
import { isDayPriority } from "@/services/recommendationEngine";
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
  const { primary } = useRecommendations();
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

      {primary && (
        <Card className="shadow-card border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary mb-1">{t.recommendations.forYou}</p>
              <p className="text-sm font-medium mb-2">{t.recommendations.items[primary.titleKey]}</p>
              <Link to={primary.href} className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">
                {t.recommendations.items[primary.ctaKey]} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {PLAN_META.map((meta, index) => {
          const dayContent = t.dayPlan.days[index];
          const isPast = meta.day < today;
          const isToday = meta.day === today;
          const mod = modules.find((m) => m.id === meta.moduleId);
          const dayLabel = t.dayPlan.dayLabel.replace("{day}", String(meta.day));
          const priority = isToday && isDayPriority(meta.moduleId, primary);
          const openHref = priority && primary ? primary.href : `/modules/${meta.moduleId}`;

          return (
            <Card
              key={meta.day}
              className={cn(
                "transition-all",
                isToday && "ring-2 ring-primary shadow-elevated",
                priority && "ring-2 ring-accent",
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
                  {isPast ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm">{dayLabel}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-primary">{mod?.shortTitle}</span>
                    <h3 className="text-sm font-semibold truncate">{dayContent?.title ?? mod?.title}</h3>
                    {priority && (
                      <span className="text-[10px] font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                        {t.recommendations.forYou}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dayContent?.task} · ~{meta.durationMin} {t.dayPlan.minutesShort}
                  </p>
                </div>
                {!isPast && (
                  <Link to={openHref} className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline flex-shrink-0">
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
