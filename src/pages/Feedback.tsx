import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDeliverables } from "@/hooks/useDeliverables";
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function Feedback() {
  const { t } = useLanguage();
  const { deliverableId } = useParams();
  const { getById } = useDeliverables();
  const deliverable = deliverableId ? getById(deliverableId) : undefined;
  const feedbackData = deliverable?.feedback;

  if (!feedbackData) {
    return (
      <div className="container max-w-2xl py-12 text-center">
        <p className="text-muted-foreground mb-4">{t.common.noResults}</p>
        <Button variant="outline" asChild>
          <Link to="/deliverables">{t.feedback.backToDeliverables}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-fade-in">
      <Link to="/deliverables" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> {t.feedback.backToDeliverables}
      </Link>

      <div>
        <h1 className="text-xl font-bold">{t.feedback.title}</h1>
        <p className="text-sm text-muted-foreground">
          {feedbackData.mentorName} — {feedbackData.date}
        </p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t.feedback.score}</p>
          <p className="text-4xl font-bold text-primary">{feedbackData.score}%</p>
        </CardContent>
      </Card>

      <Card className="shadow-card border-l-4 border-l-success">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="font-semibold">{t.feedback.strengths}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{feedbackData.strengths}</p>
        </CardContent>
      </Card>

      <Card className="shadow-card border-l-4 border-l-warning">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-warning" />
            <h2 className="font-semibold">{t.feedback.improvements}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{feedbackData.improvements}</p>
        </CardContent>
      </Card>

      <Card className="shadow-card border-l-4 border-l-primary">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">{t.feedback.nextSteps}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{feedbackData.nextSteps}</p>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button size="lg" asChild>
          <Link to="/deliverables">
            {t.feedback.resubmit} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
