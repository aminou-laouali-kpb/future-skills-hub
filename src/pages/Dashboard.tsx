import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { CohortProgress } from "@/components/CohortProgress";
import { ArrowRight, BookOpen, Calendar, MessageSquare, Target, Lock, Flame, Award } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLiteMode } from "@/contexts/LiteModeContext";
import { useLearnerDisplay } from "@/hooks/useLearnerDisplay";
import { useProgressStore } from "@/hooks/useProgress";

export default function Dashboard() {
  const { t } = useLanguage();
  const learner = useLearnerDisplay();
  const { modules } = useProgressStore();
  const { streakDays } = useLiteMode();
  const progressPercent = Math.round((learner.day / learner.totalDays) * 100);
  const continueModule = modules.find((m) => m.status === "in_progress") ?? modules.find((m) => m.status !== "locked");
  const continueHref = continueModule ? `/modules/${continueModule.id}` : "/modules";

  return (
    <div className="container py-6 pb-24 md:pb-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            {t.dashboard.hello} {learner.firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.dashboard.dayProgress} {learner.day}/{learner.totalDays} {t.dashboard.keepGoing}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 text-accent-foreground px-3 py-1 text-xs font-semibold">
            <Flame className="h-3.5 w-3.5 text-accent" />
            {streakDays} {t.dashboard.streakDays}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
            <Award className="h-3.5 w-3.5" />
            {t.dashboard.certifiedBadgeShort}
          </span>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <ProgressBar value={progressPercent} label={`${t.dashboard.globalProgress} — ${learner.cohortName}`} size="lg" />
          <div className="mt-3">
            <Link to="/plan-jour" className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
              <Calendar className="h-3 w-3" />
              {t.dashboard.viewDayPlan}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <CohortProgress />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Target className="h-4 w-4 text-primary" />
              {t.dashboard.todayGoal}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t.dashboard.todayGoalDesc}</p>
            <Button size="sm" asChild>
              <Link to={continueHref}>
                {t.dashboard.continue} <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-accent" />
              {t.dashboard.lastFeedback}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{t.dashboard.feedbackExercise}</p>
            <p className="text-xs text-success font-medium mb-3">{t.dashboard.feedbackScore}</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/deliverables/d1/feedback">{t.dashboard.viewFeedback}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-info" />
              {t.dashboard.nextMentoring}
            </div>
            <p className="text-sm font-medium">{t.dashboard.mentoringTopic}</p>
            <p className="text-xs text-muted-foreground mb-3">{t.dashboard.mentoringTime}</p>
            <Button variant="outline" size="sm">
              {t.dashboard.viewDetails}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {t.dashboard.yourModules}
        </h2>
        <div className="space-y-3">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={m.status !== "locked" ? `/modules/${m.id}` : "#"}
              className={`block rounded-xl bg-card shadow-card p-4 transition-all ${m.status !== "locked" ? "hover:shadow-elevated cursor-pointer" : "opacity-60"}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl flex-shrink-0">{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary">{m.shortTitle}</span>
                    <h3 className="text-sm font-semibold truncate">{m.title}</h3>
                    <StatusBadge status={m.status} className="ml-auto flex-shrink-0" />
                  </div>
                  {m.status === "in_progress" && <ProgressBar value={m.progress} size="sm" />}
                  {m.status === "locked" && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" /> {t.dashboard.unlockPrev}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur border-t md:hidden">
        <Button className="w-full h-12" asChild>
          <Link to={continueHref}>
            {t.dashboard.continue} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
