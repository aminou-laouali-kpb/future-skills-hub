import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { currentUser, modules } from "@/data/mockData";
import { ArrowRight, BookOpen, Calendar, MessageSquare, Target, Lock } from "lucide-react";

export default function Dashboard() {
  const progressPercent = Math.round((currentUser.day / currentUser.totalDays) * 100);

  return (
    <div className="container py-6 pb-24 md:pb-6 space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">
          Salut {currentUser.firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tu es à Jour {currentUser.day}/{currentUser.totalDays} — garde le rythme 💪
        </p>
      </div>

      {/* Progress overview */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <ProgressBar value={progressPercent} label={`Progression globale — ${currentUser.cohortName}`} size="lg" />
        </CardContent>
      </Card>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Ton objectif du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Termine la leçon "Contenus générés par l'IA" et fais le quiz du module 1.
            </p>
            <Button size="sm" asChild>
              <Link to="/modules/m1">
                Continuer <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" />
              Dernier feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-1">
              Exercice "Détecter le phishing"
            </p>
            <p className="text-xs text-success font-medium mb-3">Score : 85% ✅</p>
            <Button variant="outline" size="sm">Voir le feedback</Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-info" />
              Prochaine session mentorat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">Gestion du temps & productivité</p>
            <p className="text-xs text-muted-foreground mb-3">Demain, 10h00 — Groupe</p>
            <Button variant="outline" size="sm">Voir les détails</Button>
          </CardContent>
        </Card>
      </div>

      {/* Modules list */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Tes modules
        </h2>
        <div className="space-y-3">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={m.status !== "locked" ? `/modules/${m.id}` : "#"}
              className={`block rounded-xl bg-card shadow-card p-4 transition-all ${
                m.status !== "locked" ? "hover:shadow-elevated cursor-pointer" : "opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl flex-shrink-0">{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary">{m.shortTitle}</span>
                    <h3 className="text-sm font-semibold truncate">{m.title}</h3>
                    <StatusBadge status={m.status} className="ml-auto flex-shrink-0" />
                  </div>
                  {m.status === "in_progress" && (
                    <ProgressBar value={m.progress} size="sm" />
                  )}
                  {m.status === "locked" && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" /> Termine le module précédent pour débloquer
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur border-t md:hidden">
        <Button className="w-full h-12" asChild>
          <Link to="/modules/m1">
            Continuer <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
