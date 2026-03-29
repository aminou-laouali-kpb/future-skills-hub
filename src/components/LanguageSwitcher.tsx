import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={cn("flex items-center rounded-full bg-secondary p-0.5 text-xs", className)}>
      <button
        onClick={() => setLang("fr")}
        className={cn(
          "px-2.5 py-1 rounded-full font-medium transition-colors",
          lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        FR
      </button>
      <button
        onClick={() => setLang("en")}
        className={cn(
          "px-2.5 py-1 rounded-full font-medium transition-colors",
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
