import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, User, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LiteModeToggle } from "@/components/LiteModeToggle";
import { FontSizeControl } from "@/components/FontSizeControl";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.dashboard, href: "/dashboard" },
    { label: t.nav.modules, href: "/modules" },
    { label: t.nav.deliverables, href: "/deliverables" },
    { label: t.nav.mentoring, href: "/mentoring" },
    { label: t.nav.resources, href: "/resources" },
    { label: "Plan 10j", href: "/plan-jour" },
  ];

  // Don't show navbar on landing, login, onboarding
  if (["/" , "/login", "/onboarding"].includes(location.pathname)) return null;

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm">Future Skills</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <FontSizeControl />
            <LiteModeToggle compact />
          </div>
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t bg-card animate-fade-in">
          <div className="container py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  location.pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t flex items-center justify-between gap-2">
              <FontSizeControl />
              <LiteModeToggle compact />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
