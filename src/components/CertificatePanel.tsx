import { Link } from "react-router-dom";
import { Award, CheckCircle2, Circle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCertificate } from "@/hooks/useCertificate";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CertificatePanel() {
  const { t } = useLanguage();
  const { eligibility, issued, claim } = useCertificate();

  const criterionLabel = (id: string) => {
    if (id === "modules") return t.certificate.criterionModules;
    if (id === "deliverables") return t.certificate.criterionDeliverables;
    return t.certificate.criterionMentoring;
  };

  const handleClaim = () => {
    const result = claim();
    if (result) {
      toast.success(t.certificate.issuedToast);
    } else {
      toast.error(t.certificate.notReadyToast);
    }
  };

  return (
    <Card className="shadow-card border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Award className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{t.certificate.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{t.certificate.subtitle}</p>
          </div>
        </div>

        <ul className="space-y-2" aria-label={t.certificate.criteriaLabel}>
          {eligibility.criteria.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-sm">
              {c.met ? (
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden />
              )}
              <span className={cn(!c.met && "text-muted-foreground")}>
                {criterionLabel(c.id)} ({c.current}/{c.required})
              </span>
            </li>
          ))}
        </ul>

        {issued ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <p className="text-xs text-success font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t.certificate.issuedOn}{" "}
              {new Date(issued.issuedAt).toLocaleDateString()}
            </p>
            <Button size="sm" className="sm:ml-auto" asChild>
              <Link to="/certificate">
                <Download className="h-3.5 w-3.5 mr-1" />
                {t.certificate.download}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" disabled={!eligibility.eligible} onClick={handleClaim}>
              {t.certificate.claim}
            </Button>
            {eligibility.eligible && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/certificate">{t.certificate.preview}</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
