import { Zap, ZapOff } from "lucide-react";
import { useLiteMode } from "@/contexts/LiteModeContext";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/i18n/LanguageContext";

export function LiteModeToggle({ compact = false }: { compact?: boolean }) {
  const { isLite, toggleLite } = useLiteMode();
  const { lang } = useLanguage();
  const label = lang === "fr" ? "Mode Lite" : "Lite Mode";
  const hint = lang === "fr" ? "Économise les données" : "Saves data";

  if (compact) {
    return (
      <button
        onClick={toggleLite}
        title={label}
        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium hover:bg-secondary/80 transition-colors"
      >
        {isLite ? <Zap className="h-3.5 w-3.5 text-accent" /> : <ZapOff className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        {isLite ? <Zap className="h-4 w-4 text-accent" /> : <ZapOff className="h-4 w-4 text-muted-foreground" />}
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </div>
      </div>
      <Switch checked={isLite} onCheckedChange={toggleLite} />
    </div>
  );
}
