import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { Calendar, Clock, Users, User, Video, FileText, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MentoringSession {
  id: string;
  theme: string;
  date: string;
  time: string;
  type: "group" | "individual";
  link?: string;
  objectives: string[];
  documents: string[];
  spotsLeft: number;
  registered: boolean;
  past: boolean;
}

const mockSessions: MentoringSession[] = [
  { id: "s1", theme: "Gestion du temps & productivité", date: "2025-03-20", time: "10:00", type: "group", link: "https://meet.google.com/abc", objectives: ["Techniques Pomodoro", "Planification hebdomadaire", "Outils de gestion de tâches"], documents: ["Guide-productivité.pdf"], spotsLeft: 5, registered: false, past: false },
  { id: "s2", theme: "Préparer son pitch 60 secondes", date: "2025-03-22", time: "14:00", type: "individual", objectives: ["Structurer un pitch efficace", "Techniques de présentation", "Exercices pratiques"], documents: [], spotsLeft: 1, registered: true, past: false },
  { id: "s3", theme: "Introduction aux outils IA", date: "2025-03-18", time: "09:00", type: "group", objectives: ["Découvrir ChatGPT", "Écrire un bon prompt"], documents: ["Slides-IA.pdf", "Exercices.pdf"], spotsLeft: 0, registered: true, past: true },
];

export default function Mentoring() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null);
  const [sessions, setSessions] = useState(mockSessions);

  const filtered = sessions.filter((s) => (tab === "upcoming" ? !s.past : s.past));

  const handleRegister = (id: string) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, registered: true, spotsLeft: s.spotsLeft - 1 } : s));
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{t.mentoring.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.mentoring.subtitle}</p>
      </div>

      <div className="flex gap-2">
        {(["upcoming", "past"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
              tab === v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {v === "upcoming" ? t.mentoring.upcoming : t.mentoring.past}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card"><CardContent className="py-12 text-center text-muted-foreground">{t.mentoring.noSessions}</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => setSelectedSession(s)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{s.theme}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
                      <span className="flex items-center gap-1">
                        {s.type === "group" ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {s.type === "group" ? t.mentoring.group : t.mentoring.individual}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!s.past && (
                      <>
                        <span className="text-xs text-muted-foreground">{s.spotsLeft} {t.mentoring.spots}</span>
                        {s.registered ? (
                          <span className="text-xs font-medium text-success">{t.mentoring.registered}</span>
                        ) : (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRegister(s.id); }}>
                            {t.mentoring.register}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.mentoring.details}</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4 mt-2">
              <h3 className="font-semibold">{selectedSession.theme}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">{t.mentoring.date}:</span> {selectedSession.date}</div>
                <div><span className="text-muted-foreground">{t.mentoring.time}:</span> {selectedSession.time}</div>
                <div><span className="text-muted-foreground">{t.mentoring.type}:</span> {selectedSession.type === "group" ? t.mentoring.group : t.mentoring.individual}</div>
              </div>
              {selectedSession.objectives.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{t.mentoring.objectives}</p>
                  <ul className="space-y-1">
                    {selectedSession.objectives.map((o, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">• {o}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedSession.link && (
                <Button className="w-full" asChild>
                  <a href={selectedSession.link} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4 mr-1" /> {t.mentoring.joinSession}
                  </a>
                </Button>
              )}
              {selectedSession.documents.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{t.mentoring.documents}</p>
                  {selectedSession.documents.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline">
                      <FileText className="h-4 w-4" /> {d}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
