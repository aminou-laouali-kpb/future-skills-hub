import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  const langs: { code: "fr" | "en" | "ha"; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ha", label: "HA" },
  ];
  const upcoming = [
    { label: "ZAR", name: "Zarma" },
  ];

  return (
    <div className={cn("flex items-center rounded-full bg-secondary p-0.5 text-xs", className)}>
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={cn(
            "px-2.5 py-1 rounded-full font-medium transition-colors",
            lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
      {upcoming.map((l) => (
        <button
          key={l.label}
          onClick={() => toast(`${l.name} : bientôt disponible`)}
          className="px-2.5 py-1 rounded-full font-medium text-muted-foreground/60 italic"
          title={`${l.name} (bientôt)`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
