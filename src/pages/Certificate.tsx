import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCertificate } from "@/hooks/useCertificate";
import { useLearnerDisplay } from "@/hooks/useLearnerDisplay";
import { ArrowLeft, Printer } from "lucide-react";

export default function Certificate() {
  const { t } = useLanguage();
  const { issued, eligibility } = useCertificate();
  const learner = useLearnerDisplay();
  const printRef = useRef<HTMLDivElement>(null);

  const learnerName = `${learner.firstName} ${learner.lastName}`.trim();
  const preview =
    !issued && eligibility.eligible
      ? {
          issuedAt: new Date().toISOString(),
          learnerName,
          cohortCode: learner.cohort,
        }
      : null;

  const display = issued ?? preview;

  const handlePrint = () => {
    window.print();
  };

  if (!display) {
    return (
      <div className="container py-12 max-w-md mx-auto text-center space-y-4">
        <p className="text-muted-foreground">{t.certificate.notReadyPage}</p>
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t.certificate.backDashboard}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6 animate-fade-in print:py-0">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t.certificate.backDashboard}
          </Link>
        </Button>
        <Button size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1" />
          {t.certificate.print}
        </Button>
      </div>

      {!issued && preview && (
        <p className="text-sm text-center text-muted-foreground print:hidden">{t.certificate.previewNote}</p>
      )}

      <div
        ref={printRef}
        className="mx-auto max-w-2xl rounded-2xl border-4 border-primary/30 bg-card p-8 md:p-12 text-center shadow-elevated print:shadow-none print:border-primary"
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.certificate.programName}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.certificate.documentTitle}</h1>
        <p className="text-sm text-muted-foreground mb-2">{t.certificate.awardedTo}</p>
        <p className="text-xl md:text-2xl font-semibold mb-6">{display.learnerName}</p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">{t.certificate.body}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">{t.certificate.cohort}</p>
            <p className="font-medium">{display.cohortCode}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t.certificate.date}</p>
            <p className="font-medium">{new Date(display.issuedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="mt-10 text-[10px] text-muted-foreground">{t.certificate.footer}</p>
      </div>
    </div>
  );
}
