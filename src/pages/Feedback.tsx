import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function Feedback() {
  const { t } = useLanguage();
  const { deliverableId } = useParams();

  // Mock feedback data
  const feedbackData = {
    score: 78,
    strengths: "Tu as bien identifié les 3 signes principaux d'un email de phishing. L'analyse est claire et structurée.",
    improvements: "Ajoute des exemples concrets tirés de ton expérience. La partie sur les liens suspects peut être approfondie.",
    nextSteps: "Refais l'exercice avec les 2 nouveaux emails fournis et compare tes réponses avec le corrigé.",
    mentorName: "Moussa K.",
    date: "2025-03-17",
  };

  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-fade-in">
      <Link to="/deliverables" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> {t.feedback.backToDeliverables}
      </Link>

      <div>
        <h1 className="text-xl font-bold">{t.feedback.title}</h1>
        <p className="text-sm text-muted-foreground">Par {feedbackData.mentorName} — {feedbackData.date}</p>
      </div>

      {feedbackData.score && (
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.feedback.score}</p>
            <p className="text-4xl font-bold text-primary">{feedbackData.score}%</p>
          </CardContent>
        </Card>
      )}

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
        <Button size="lg">
          {t.feedback.resubmit} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
