import { WifiOff } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const { t } = useLanguage();
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      <WifiOff className="h-4 w-4 flex-shrink-0" aria-hidden />
      <span>{t.offline.banner}</span>
    </div>
  );
}
