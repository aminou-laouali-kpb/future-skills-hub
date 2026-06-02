import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const HIDDEN_PREFIXES = ["/", "/login", "/onboarding"];

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);

  if (HIDDEN_PREFIXES.some((p) => location.pathname === p)) return null;

  const mainTabs = [
    { href: "/dashboard", label: t.mobileNav.dashboard, icon: LayoutDashboard, match: (p: string) => p === "/dashboard" },
    { href: "/modules", label: t.mobileNav.modules, icon: BookOpen, match: (p: string) => p.startsWith("/modules") },
    { href: "/deliverables", label: t.mobileNav.deliverables, icon: FileText, match: (p: string) => p.startsWith("/deliverables") },
  ];

  const moreLinks = [
    { href: "/plan-jour", label: t.nav.dayPlan },
    { href: "/mentoring", label: t.nav.mentoring },
    { href: "/resources", label: t.nav.resources },
    { href: "/support", label: t.nav.support },
  ];

  const moreActive = moreLinks.some((l) => location.pathname.startsWith(l.href));

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur safe-area-pb"
      aria-label={t.mobileNav.label}
    >
      <div className="grid grid-cols-4 h-16">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(location.pathname);
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                active ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="truncate max-w-[72px]">{tab.label}</span>
            </Link>
          );
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                moreActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-expanded={moreOpen}
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden />
              <span>{t.mobileNav.more}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{t.mobileNav.more}</SheetTitle>
            </SheetHeader>
            <ul className="grid gap-1 py-4">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-3 py-3 text-sm font-medium rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
