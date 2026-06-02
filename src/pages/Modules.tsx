import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { useProgressStore } from "@/hooks/useProgress";

type Filter = "all" | "in_progress" | "locked" | "completed";

export default function Modules() {
  const { t } = useLanguage();
  const { modules } = useProgressStore();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? modules : modules.filter((m) => m.status === filter);
  const filters: { label: string; value: Filter }[] = [
    { label: t.modules.all, value: "all" },
    { label: t.modules.inProgress, value: "in_progress" },
    { label: t.modules.todo, value: "locked" },
    { label: t.modules.completed, value: "completed" },
  ];

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{t.modules.catalog}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.modules.catalogSub}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
              filter === f.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((m) => (
          <div key={m.id} className="rounded-xl bg-card shadow-card hover:shadow-elevated transition-all p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{m.icon}</span>
                <div>
                  <span className="text-xs font-bold text-primary">{m.shortTitle}</span>
                  <h3 className="font-semibold">{m.title}</h3>
                </div>
              </div>
              <StatusBadge status={m.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">{m.description}</p>
            <div className="space-y-1.5 mb-4">
              {m.objectives.map((o, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                {m.lessonsCount} {t.modules.lessons} · {m.duration}
              </div>
              {m.status === "locked" ? (
                <Button variant="secondary" size="sm" disabled>
                  <Lock className="h-3 w-3 mr-1" /> {t.modules.locked}
                </Button>
              ) : (
                <Button size="sm" asChild>
                  <Link to={`/modules/${m.id}`}>
                    {m.status === "in_progress" ? t.dashboard.continue : t.modules.open} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
            {m.status === "in_progress" && (
              <div className="mt-3">
                <ProgressBar value={m.progress} size="sm" label={t.modules.progress} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
