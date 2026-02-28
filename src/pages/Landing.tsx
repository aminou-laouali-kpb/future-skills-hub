import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { modules } from "@/data/mockData";

const features = [
  { icon: BookOpen, title: "5 modules structurés", desc: "De la culture numérique à l'entrepreneuriat, un parcours complet en 10 jours." },
  { icon: Users, title: "Mentorat personnalisé", desc: "Sessions individuelles et en groupe avec des experts du numérique." },
  { icon: Lightbulb, title: "Exercices pratiques", desc: "Des livrables concrets pour ton CV : pitch, business plan, projets IA." },
  { icon: Award, title: "Certificat reconnu", desc: "Valide ton parcours et partage-le sur LinkedIn." },
];

const steps = [
  { day: "Jours 1-2", module: "Culture numérique", desc: "Internet, cybersécurité, fake news" },
  { day: "Jours 3-4", module: "Outils & productivité", desc: "Drive, Notion, présentations" },
  { day: "Jours 5-6", module: "Introduction IA", desc: "Prompts, LLM, agents IA" },
  { day: "Jours 7-8", module: "Employabilité", desc: "CV, pitch, simulations" },
  { day: "Jours 9-10", module: "Entrepreneuriat", desc: "Business plan, stratégie, pitch final" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span>Future Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Accéder à ma cohorte</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImage} alt="Étudiants africains apprenant ensemble" className="w-full h-full object-cover" />
        </div>
        <div className="relative container py-20 md:py-32 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight animate-slide-up">
            Passe au niveau supérieur en<br />
            <span className="text-accent">numérique, IA et productivité</span><br />
            en 10 jours.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in">
            Des exercices concrets, du mentorat, et des livrables utiles pour ton CV.
            Même si tu débutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
            <Button variant="hero" size="lg" className="text-base px-8 h-12" asChild>
              <Link to="/dashboard">
                Accéder à ma cohorte <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 h-12" asChild>
              <a href="#programme">Découvrir le programme</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Pourquoi <span className="text-primary">Future Skills</span> ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme 10 jours */}
      <section id="programme" className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            10 jours pour transformer tes compétences
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Chaque jour : une mission simple, un quiz rapide, un feedback pour progresser.
          </p>
          <div className="max-w-2xl mx-auto space-y-4">
            {steps.map((s, i) => (
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

      {/* Modules */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Les 5 modules</h2>
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

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Prêt(e) à commencer ?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Rejoins ta cohorte et démarre ton parcours en 10 jours.
          </p>
          <Button variant="hero" size="lg" className="text-base px-8 h-12" asChild>
            <Link to="/dashboard">Commencer maintenant <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Future Skills © 2025</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <a href="mailto:contact@futureskills.ne" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
