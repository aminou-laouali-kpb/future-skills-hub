import { useParams, Link } from "react-router-dom";
import { getQuizForModule } from "@/data/curriculum";
import type { ModuleId } from "@/data/curriculum";
import { useModule, useProgressStore } from "@/hooks/useProgress";
import { QUIZ_PASS_PERCENT } from "@/services/progressService";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, XCircle, RotateCcw, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Quiz() {
  const { moduleId } = useParams();
  const { t } = useLanguage();
  const mod = useModule(moduleId);
  const { recordQuiz } = useProgressStore();
  const questions = moduleId ? getQuizForModule(moduleId) : [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  if (!questions.length) {
    return (
      <div className="container py-12 text-center">
        <Button variant="outline" asChild>
          <Link to="/modules">{t.moduleDetail.backToModules}</Link>
        </Button>
      </div>
    );
  }

  const question = questions[currentQ];
  const progress = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (!answered) setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === question.correctIndex;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      const pct = Math.round((score / questions.length) * 100);
      if (moduleId) recordQuiz(moduleId as ModuleId, pct);
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  const finalPercent = Math.round((score / questions.length) * 100);
  const passed = finalPercent >= QUIZ_PASS_PERCENT;

  if (finished) {
    return (
      <div className="container max-w-lg py-12 text-center animate-fade-in">
        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", passed ? "bg-success/15" : "bg-destructive/15")}>
          {passed ? <CheckCircle2 className="h-10 w-10 text-success" /> : <XCircle className="h-10 w-10 text-destructive" />}
        </div>
        <h1 className="text-2xl font-bold mb-2">{passed ? t.quiz.passed : t.quiz.failed}</h1>
        <p className="text-3xl font-bold text-primary mb-2">{finalPercent}%</p>
        <p className="text-sm text-muted-foreground mb-6">
          {score}/{questions.length} {t.quiz.goodAnswers}
          {!passed && ` ${t.quiz.reviewHint}`}
        </p>
        <div className="space-y-2 mb-8 text-left">
          {questions.map((q, i) => (
            <div key={q.id} className={cn("p-3 rounded-lg text-sm", answers[i] ? "bg-success/10" : "bg-destructive/10")}>
              <div className="flex items-start gap-2">
                {answers[i] ? <CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5" />}
                <div>
                  <p className="font-medium text-xs">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          {!passed && (
            <Button variant="outline" onClick={handleRetry}>
              <RotateCcw className="h-4 w-4 mr-1" /> {t.quiz.retryQuiz}
            </Button>
          )}
          <Button asChild>
            <Link to={passed ? "/modules" : `/modules/${moduleId}`}>
              <BookOpen className="h-4 w-4 mr-1" /> {passed ? t.quiz.continueBtn : t.quiz.reviewLesson}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            {mod?.icon} {mod?.title} — Quiz
          </span>
          <span>
            {t.quiz.question} {currentQ + 1}/{questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 [&>div]:bg-primary" />
      </div>

      <p className="text-xs text-muted-foreground mb-2">{t.quiz.noStress}</p>
      <h2 className="text-lg font-semibold mb-6">{question.question}</h2>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={cn(
              "w-full text-left p-4 rounded-xl border text-sm font-medium transition-all",
              !answered && selected === i && "border-primary bg-primary/5",
              !answered && selected !== i && "border-border hover:border-primary/40",
              answered && i === question.correctIndex && "border-success bg-success/10 text-success",
              answered && selected === i && i !== question.correctIndex && "border-destructive bg-destructive/10 text-destructive",
              answered && selected !== i && i !== question.correctIndex && "opacity-50"
            )}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border mr-2 text-xs">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {answered && (
        <div className="p-4 rounded-xl bg-muted/50 border mb-6 animate-fade-in">
          <p className="text-sm font-medium mb-1">{selected === question.correctIndex ? t.quiz.correct : t.quiz.incorrect}</p>
          <p className="text-xs text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!answered ? (
          <Button onClick={handleSubmit} disabled={selected === null}>
            {t.quiz.validate}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQ + 1 >= questions.length ? t.quiz.seeResult : t.quiz.nextQ} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
