import { Users, TrendingUp } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export function CohortProgress() {
  const { lang } = useLanguage();
  // Mock: anonymous aggregated stats
  const stats = [
    { module: "M1", percent: 68 },
    { module: "M2", percent: 32 },
    { module: "M3", percent: 12 },
  ];

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">
            {lang === "fr" ? "Progression de ta cohorte" : "Your cohort's progress"}
          </h3>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-success font-medium">
            <TrendingUp className="h-3 w-3" />
            +12%
          </span>
        </div>
        <div className="space-y-2">
          {stats.map((s) => (
            <div key={s.module}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{s.module}</span>
                <span className="text-muted-foreground">
                  {s.percent}% {lang === "fr" ? "ont terminé" : "completed"}
                </span>
              </div>
              <ProgressBar value={s.percent} size="sm" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {lang === "fr" ? "Tu es dans le top 30% 💪" : "You're in the top 30% 💪"}
        </p>
      </CardContent>
    </Card>
  );
}
