import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";

export function ConnectionStatus() {
  const { lang } = useLanguage();
  const [online, setOnline] = useState(navigator.onLine);
  const [effectiveType, setEffectiveType] = useState<string>("");

  useEffect(() => {
    const update = () => {
      // @ts-ignore
      const c = navigator.connection;
      setEffectiveType(c?.effectiveType || "");
    };
    update();
    const onOnline = () => {
      setOnline(true);
      toast.success(lang === "fr" ? "Connexion rétablie" : "Back online");
    };
    const onOffline = () => {
      setOnline(false);
      toast.error(lang === "fr" ? "Tu es hors ligne" : "You are offline");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    // @ts-ignore
    navigator.connection?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      // @ts-ignore
      navigator.connection?.removeEventListener?.("change", update);
    };
  }, [lang]);

  if (online && !effectiveType) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-card lite:shadow-none ${
        online ? "bg-card text-muted-foreground border" : "bg-destructive text-destructive-foreground"
      }`}
    >
      {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      <span>{online ? effectiveType.toUpperCase() || "ON" : lang === "fr" ? "Hors ligne" : "Offline"}</span>
    </div>
  );
}
