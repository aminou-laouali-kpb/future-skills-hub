import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { OfflineBanner } from "@/components/OfflineBanner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cacheLesson, getCachedLesson } from "@/lib/offlineLessons";
import { useLessonsWithProgress, useModule, useProgressStore } from "@/hooks/useProgress";

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const { t } = useLanguage();
  const mod = useModule(moduleId);
  const lessons = useLessonsWithProgress(moduleId);
  const { completeLesson } = useProgressStore();
  const online = useOnlineStatus();
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (lessons.length) {
      setActiveLesson(lessons.find((l) => !l.completed) ?? lessons[0]);
    }
  }, [moduleId, lessons.length]);

  useEffect(() => {
    if (online && activeLesson) {
      cacheLesson(activeLesson);
    }
  }, [online, activeLesson?.id]);

  if (!mod || !moduleId) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">{t.moduleDetail.notFound}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/modules">{t.moduleDetail.backToModules}</Link>
        </Button>
      </div>
    );
  }

  if (mod.status === "locked") {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{t.dashboard.unlockPrev}</p>
        <Button variant="outline" asChild>
          <Link to="/modules">{t.moduleDetail.backToModules}</Link>
        </Button>
      </div>
    );
  }

  if (!lessons.length || !activeLesson) {
    return null;
  }

  const cached = !online ? getCachedLesson(activeLesson.id) : null;
  const displayLesson = cached ? { ...activeLesson, ...cached, completed: activeLesson.completed } : activeLesson;
  const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id);

  const handleMarkDone = () => {
    completeLesson(activeLesson.id);
    const next = lessons[currentIndex + 1];
    if (next) setActiveLesson(next);
  };

  const lessonList = (
    <>
      {lessons.map((l) => (
        <button
          key={l.id}
          onClick={() => setActiveLesson(l)}
          className={cn(
            "w-full flex items-center gap-2 p-2.5 rounded-lg text-left text-sm transition-colors",
            activeLesson.id === l.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {l.completed ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" /> : <Circle className="h-4 w-4 flex-shrink-0" />}
          <span className="truncate">{l.title}</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{l.duration}</span>
        </button>
      ))}
      <div className="border-t pt-2 mt-2">
        <Link
          to={`/modules/${moduleId}/quiz`}
          className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <FileText className="h-4 w-4" />
          {t.moduleDetail.moduleQuiz}
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="hidden lg:flex flex-col w-72 border-r bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <Link to="/modules" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> {t.moduleDetail.backModules}
          </Link>
          <h2 className="font-semibold text-sm">
            {mod.icon} {mod.title}
          </h2>
          <ProgressBar value={mod.progress} size="sm" className="mt-2" />
        </div>
        <nav className="flex-1 p-2 space-y-0.5">{lessonList}</nav>
      </aside>

      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Button size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full shadow-elevated h-12 w-12">
          <FileText className="h-5 w-5" />
        </Button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-elevated overflow-y-auto animate-fade-in">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-sm">
                {mod.icon} {mod.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                ✕
              </Button>
            </div>
            <nav className="p-2 space-y-0.5">{lessonList}</nav>
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-10 animate-fade-in">
          <OfflineBanner />
          {cached && (
            <p className="mb-4 text-xs font-medium text-muted-foreground">{t.offline.cachedBadge}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span>{mod.shortTitle}</span>
            <span>›</span>
            <span>
              {t.moduleDetail.lesson} {displayLesson.order}/{lessons.length}
            </span>
            <span className="ml-auto">{displayLesson.duration}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-6">{displayLesson.title}</h1>

          {displayLesson.videoId && (
            <VideoPlayer
              videoId={displayLesson.videoId}
              title={displayLesson.title}
              durationSec={displayLesson.videoDurationSec}
              sizeMB={displayLesson.videoSizeMB}
              transcript={displayLesson.transcript}
            />
          )}

          <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
            <p className="text-muted-foreground">{displayLesson.content}</p>
            <div className="my-8 p-6 rounded-xl bg-muted/50 border">
              <h3 className="font-semibold text-sm mb-2">{t.moduleDetail.remember}</h3>
              <p className="text-sm text-muted-foreground">{t.moduleDetail.rememberText}</p>
            </div>
            <p className="text-muted-foreground">{t.moduleDetail.nextLessonText}</p>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t gap-2 flex-wrap">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => currentIndex > 0 && setActiveLesson(lessons[currentIndex - 1])}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> {t.moduleDetail.previous}
            </Button>

            {!activeLesson.completed && (
              <Button variant="secondary" onClick={handleMarkDone}>
                <CheckCircle2 className="h-4 w-4 mr-1" /> {t.moduleDetail.markDone}
              </Button>
            )}

            {currentIndex < lessons.length - 1 ? (
              <Button onClick={() => setActiveLesson(lessons[currentIndex + 1])}>
                {t.moduleDetail.next} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button asChild>
                <Link to={`/modules/${moduleId}/quiz`}>
                  {t.moduleDetail.takeQuiz} <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
