import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Lightbulb, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { modules } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Landing() {
  const { t } = useLanguage();
  const icons = [BookOpen, Users, Lightbulb, Award];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span>Future Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">{t.landing.login}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">{t.landing.cta}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-20" data-decorative="true">
          <img src={heroImage} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="relative container py-20 md:py-32 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight animate-slide-up">
            {t.landing.heroTitle1}<br />
            <span className="text-accent">{t.landing.heroTitle2}</span><br />
            {t.landing.heroTitle3}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-6 animate-fade-in">
            {t.landing.heroSub}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur px-3 py-1 text-xs font-medium text-primary-foreground mb-8 border border-primary-foreground/20">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            {t === t ? "Programme certifié Future Skills 2025" : ""}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
            <Button variant="hero" size="lg" className="text-base px-8 h-12" asChild>
              <Link to="/dashboard">{t.landing.cta} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 h-12" asChild>
              <a href="#programme">{t.landing.discover}</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t.landing.whyTitle.split("Future Skills").map((part, i, arr) =>
              i < arr.length - 1 ? <span key={i}>{part}<span className="text-primary">Future Skills</span></span> : <span key={i}>{part}</span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.landing.features.map((f, i) => {
              const Icon = icons[i];
              return (
                <div key={i} className="p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="programme" className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{t.landing.programTitle}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">{t.landing.programSub}</p>
          <div className="max-w-2xl mx-auto space-y-4">
            {t.landing.steps.map((s, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-card shadow-card animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{s.day}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{s.module}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t.landing.modulesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {modules.map((m) => (
              <div key={m.id} className="p-5 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all">
                <div className="text-2xl mb-3">{m.icon}</div>
                <h3 className="font-semibold mb-1 text-sm">{m.shortTitle} — {m.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{m.description}</p>
                <div className="flex flex-wrap gap-1">
                  {m.objectives.slice(0, 2).map((o, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="h-3 w-3" /> {o}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">{t.landing.readyTitle}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">{t.landing.readySub}</p>
          <Button variant="hero" size="lg" className="text-base px-8 h-12" asChild>
            <Link to="/dashboard">{t.landing.startNow} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="py-10 border-t bg-muted/30">
        <div className="container">
          <p className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-6 font-semibold">
            Partenaires & sponsors
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-70">
            {["Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4", "Sponsor 5"].map((s) => (
              <div key={s} className="h-10 px-4 flex items-center justify-center rounded bg-card border text-xs font-semibold text-muted-foreground">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t bg-card">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Future Skills © 2025</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/support" className="hover:text-foreground transition-colors">{t.landing.footer.support}</Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">{t.landing.footer.faq}</Link>
            <a href="mailto:contact@futureskills.ne" className="hover:text-foreground transition-colors">{t.landing.footer.contact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
