import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Recommendation } from "@/types/recommendation";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function applyParams(text: string, params?: Record<string, string>) {
  if (!params) return text;
  return Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, v), text);
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  variant?: "primary" | "secondary";
}

export function RecommendationCard({ recommendation, variant = "primary" }: RecommendationCardProps) {
  const { t } = useLanguage();
  const [showWhy, setShowWhy] = useState(false);
  const items = t.recommendations.items;

  const title = applyParams(items[recommendation.titleKey], recommendation.reasonParams);
  const description = applyParams(items[recommendation.descriptionKey], recommendation.reasonParams);
  const reason = applyParams(items[recommendation.reasonKey], recommendation.reasonParams);
  const cta = items[recommendation.ctaKey];

  return (
    <Card
      className={cn(
        "shadow-card overflow-hidden",
        variant === "primary" && "ring-2 ring-primary/30 bg-gradient-to-br from-primary/5 to-card"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              variant === "primary" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              {variant === "primary" ? t.recommendations.forYou : t.recommendations.also}
            </p>
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            <Button size="sm" asChild className={variant === "primary" ? "" : "h-8"}>
              <Link to={recommendation.href}>
                {cta} <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setShowWhy(!showWhy)}
              className="mt-2 text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              <HelpCircle className="h-3 w-3" />
              {t.recommendations.why}
            </button>
            {showWhy && (
              <p className="mt-2 text-xs text-muted-foreground rounded-lg bg-muted/50 p-2 animate-fade-in">{reason}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
