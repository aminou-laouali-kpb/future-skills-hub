import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, TrendingUp, AlertTriangle, Award, Download, FileSpreadsheet, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildCohortCsv,
  buildGoogleSheetsUrl,
  downloadTextFile,
  type AdminLearnerRow,
} from "@/services/adminExportService";
import { toast } from "sonner";

const mockLearners: AdminLearnerRow[] = [
  {
    id: "u1",
    name: "Amina Moussa",
    email: "amina@email.com",
    progress: 60,
    quizAvg: 85,
    deliverables: "2/3",
    mentoringSessions: 1,
    certificateEligible: false,
    status: "on_track",
    alerts: [],
  },
  {
    id: "u2",
    name: "Ibrahim Djibo",
    email: "ibrahim@email.com",
    progress: 40,
    quizAvg: 45,
    deliverables: "1/3",
    mentoringSessions: 0,
    certificateEligible: false,
    status: "at_risk",
    alerts: ["lowQuizAvg", "lateDeliverables"],
  },
  {
    id: "u3",
    name: "Fatima Mahamane",
    email: "fatima@email.com",
    progress: 80,
    quizAvg: 92,
    deliverables: "3/3",
    mentoringSessions: 2,
    certificateEligible: false,
    status: "on_track",
    alerts: [],
  },
  {
    id: "u4",
    name: "Moussa Abdou",
    email: "moussa@email.com",
    progress: 20,
    quizAvg: 55,
    deliverables: "0/3",
    mentoringSessions: 0,
    certificateEligible: false,
    status: "at_risk",
    alerts: ["noConnection48h", "lateDeliverables"],
  },
  {
    id: "u5",
    name: "Aïcha Issoufou",
    email: "aicha@email.com",
    progress: 100,
    quizAvg: 78,
    deliverables: "3/3",
    mentoringSessions: 1,
    certificateEligible: true,
    status: "completed",
    alerts: [],
  },
];

export default function Admin() {
  const { t } = useLanguage();
  const atRiskCount = mockLearners.filter((l) => l.status === "at_risk").length;
  const avgProgress = Math.round(mockLearners.reduce((s, l) => s + l.progress, 0) / mockLearners.length);
  const completionRate = Math.round((mockLearners.filter((l) => l.status === "completed").length / mockLearners.length) * 100);
  const csvContent = buildCohortCsv(mockLearners);

  const handleCsvExport = () => {
    downloadTextFile(`future-skills-cohort-${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
    toast.success(t.admin.exportSuccess);
  };

  const handleSheetsExport = () => {
    window.open(buildGoogleSheetsUrl(csvContent), "_blank", "noopener,noreferrer");
    toast.success(t.admin.exportSheetsHint);
  };

  const handleCertificatesExport = () => {
    const eligible = mockLearners.filter((l) => l.certificateEligible);
    const lines = [
      "name,email,cohort,certificate_eligible",
      ...eligible.map((l) => `${l.name},${l.email ?? ""},FS-2025-01,yes`),
    ].join("\n");
    downloadTextFile(`future-skills-certificates-${new Date().toISOString().slice(0, 10)}.csv`, lines);
    toast.success(t.admin.certificatesExported.replace("{count}", String(eligible.length)));
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold">{t.admin.title}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.admin.totalLearners, value: mockLearners.length, icon: Users, color: "text-primary" },
          { label: t.admin.avgProgress, value: `${avgProgress}%`, icon: TrendingUp, color: "text-info" },
          { label: t.admin.atRisk, value: atRiskCount, icon: AlertTriangle, color: "text-destructive" },
          { label: t.admin.completionRate, value: `${completionRate}%`, icon: Award, color: "text-success" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reporting">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="reporting">{t.admin.reporting}</TabsTrigger>
          <TabsTrigger value="alerts">{t.admin.atRisk}</TabsTrigger>
          <TabsTrigger value="exports">{t.admin.exports}</TabsTrigger>
        </TabsList>

        <TabsContent value="reporting" className="mt-4">
          <Card className="shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.admin.learnerName}</TableHead>
                    <TableHead>{t.admin.progress}</TableHead>
                    <TableHead>{t.admin.quizAvg}</TableHead>
                    <TableHead>{t.admin.deliverables}</TableHead>
                    <TableHead>{t.admin.status}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLearners.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell>
                        <div className="w-32">
                          <ProgressBar value={l.progress} size="sm" />
                        </div>
                      </TableCell>
                      <TableCell className={cn(l.quizAvg < 50 && "text-destructive font-medium")}>{l.quizAvg}%</TableCell>
                      <TableCell>{l.deliverables}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={l.status === "at_risk" ? "overdue" : l.status === "completed" ? "completed" : "in_progress"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <div className="space-y-3">
            {mockLearners
              .filter((l) => l.alerts.length > 0)
              .map((l) => (
                <Card key={l.id} className="shadow-card border-l-4 border-l-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{l.name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {l.alerts.map((a, i) => (
                            <span key={i} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                              {a === "noConnection48h"
                                ? t.admin.noConnection48h
                                : a === "lowQuizAvg"
                                  ? t.admin.lowQuizAvg
                                  : t.admin.lateDeliverables}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="h-3 w-3 mr-1" /> {t.admin.sendReminder}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="exports" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={handleCsvExport}
              onKeyDown={(e) => e.key === "Enter" && handleCsvExport()}
              role="button"
              tabIndex={0}
            >
              <CardContent className="p-6 text-center">
                <Download className="h-8 w-8 mx-auto text-primary mb-3" />
                <p className="font-medium">{t.admin.exportCSV}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.admin.exportCSVDesc}</p>
              </CardContent>
            </Card>
            <Card
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={handleSheetsExport}
              onKeyDown={(e) => e.key === "Enter" && handleSheetsExport()}
              role="button"
              tabIndex={0}
            >
              <CardContent className="p-6 text-center">
                <FileSpreadsheet className="h-8 w-8 mx-auto text-success mb-3" />
                <p className="font-medium">{t.admin.exportSheets}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.admin.exportSheetsDesc}</p>
              </CardContent>
            </Card>
            <Card
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={handleCertificatesExport}
              onKeyDown={(e) => e.key === "Enter" && handleCertificatesExport()}
              role="button"
              tabIndex={0}
            >
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto text-accent mb-3" />
                <p className="font-medium">{t.admin.generateCertificates}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.admin.generateCertificatesDesc}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
