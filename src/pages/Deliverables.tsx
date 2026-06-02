import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { useLanguage } from "@/i18n/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProgressStore } from "@/hooks/useProgress";
import { useDeliverables } from "@/hooks/useDeliverables";

export default function Deliverables() {
  const { t } = useLanguage();
  const { modules } = useProgressStore();
  const { deliverables, addDeliverable } = useDeliverables();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [fileName, setFileName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [context, setContext] = useState("");
  const [checks, setChecks] = useState([false, false, false]);

  const resetForm = () => {
    setSelectedModule("");
    setSelectedType("");
    setFileName("");
    setLinkUrl("");
    setContext("");
    setChecks([false, false, false]);
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!selectedModule || !selectedType) return;
    await addDeliverable({
      moduleId: selectedModule,
      type: selectedType,
      fileName: fileName || undefined,
      linkUrl: linkUrl || undefined,
      context,
      asDraft,
    });
    toast({ title: asDraft ? t.deliverables.saveDraft : t.deliverables.submit });
    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{t.deliverables.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.deliverables.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> {t.deliverables.newDeliverable}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.deliverables.uploadTitle}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>{t.deliverables.module}</Label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={t.deliverables.selectModule} />
                  </SelectTrigger>
                  <SelectContent>
                    {modules
                      .filter((m) => m.status !== "locked")
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.icon} {m.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.deliverables.type}</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={t.deliverables.selectType} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.deliverables.types).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.deliverables.file}</Label>
                <Input
                  className="mt-1.5"
                  placeholder="mon-fichier.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">{t.deliverables.fileHelp}</p>
              </div>
              <div>
                <Label>{t.deliverables.link}</Label>
                <Input placeholder={t.deliverables.linkPlaceholder} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>{t.deliverables.context}</Label>
                <Textarea placeholder={t.deliverables.contextPlaceholder} value={context} onChange={(e) => setContext(e.target.value)} className="mt-1.5" rows={3} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">{t.deliverables.checklist}</p>
                {t.deliverables.checkItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={checks[i]}
                      onCheckedChange={(c) => {
                        const n = [...checks];
                        n[i] = !!c;
                        setChecks(n);
                      }}
                    />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => handleSubmit(true)}>
                  {t.deliverables.saveDraft}
                </Button>
                <Button className="flex-1" onClick={() => handleSubmit(false)}>
                  {t.deliverables.submit}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {deliverables.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center text-muted-foreground">{t.deliverables.noDeliverables}</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {deliverables.map((d) => {
            const mod = modules.find((m) => m.id === d.moduleId);
            return (
              <Card key={d.id} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{d.fileName || d.linkUrl}</p>
                        <p className="text-xs text-muted-foreground">
                          {mod?.icon} {mod?.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{d.context}</p>
                        {d.submittedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t.deliverables.submitted} {d.submittedAt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={d.status} />
                      {d.status === "feedback" && d.feedback && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/deliverables/${d.id}/feedback`}>{t.dashboard.viewFeedback}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
