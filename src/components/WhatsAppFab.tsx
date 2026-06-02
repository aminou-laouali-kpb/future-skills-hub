import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function WhatsAppFab() {
  const { t } = useLanguage();
  const location = useLocation();

  if (["/", "/login", "/onboarding"].includes(location.pathname)) return null;

  const message = encodeURIComponent(t.whatsapp.prefillMessage);
  const phone = "22790000000";

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.ariaLabel}
      className={cn(
        "fixed right-4 z-40 flex items-center gap-2 rounded-full pl-3 pr-4 py-3 shadow-elevated hover:scale-105 transition-transform lite:shadow-none lite:hover:scale-100 bottom-20 md:bottom-4"
      )}
      style={{ backgroundColor: "#25D366", color: "#fff" }}
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="text-sm font-medium hidden sm:inline">{t.whatsapp.label}</span>
    </a>
  );
}
