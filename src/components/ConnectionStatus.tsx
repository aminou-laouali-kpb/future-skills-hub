import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { t } = useLanguage();
  const [online, setOnline] = useState(navigator.onLine);
  const [effectiveType, setEffectiveType] = useState("");

  useEffect(() => {
    const update = () => {
      const c = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      setEffectiveType(c?.effectiveType || "");
    };
    update();
    const onOnline = () => {
      setOnline(true);
      toast.success(t.connection.backOnline);
    };
    const onOffline = () => {
      setOnline(false);
      toast.error(t.connection.offline);
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const conn = (navigator as Navigator & { connection?: { addEventListener?: (e: string, fn: () => void) => void } }).connection;
    conn?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      conn?.removeEventListener?.("change", update);
    };
  }, [t.connection.backOnline, t.connection.offline]);

  if (online && !effectiveType) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed left-4 z-40 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-card lite:shadow-none bottom-20 md:bottom-4",
        online ? "bg-card text-muted-foreground border" : "bg-destructive text-destructive-foreground"
      )}
    >
      {online ? <Wifi className="h-3.5 w-3.5" aria-hidden /> : <WifiOff className="h-3.5 w-3.5" aria-hidden />}
      <span>{online ? effectiveType.toUpperCase() || "ON" : t.connection.offlineLabel}</span>
    </div>
  );
}
