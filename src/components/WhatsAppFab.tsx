import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export function WhatsAppFab() {
  const { lang } = useLanguage();
  const location = useLocation();
  // Hide on landing/login/onboarding
  if (["/", "/login", "/onboarding"].includes(location.pathname)) return null;

  const message = encodeURIComponent(
    lang === "fr"
      ? "Bonjour, j'ai besoin d'aide sur Future Skills."
      : "Hello, I need help with Future Skills."
  );
  const phone = "22790000000"; // placeholder

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={lang === "fr" ? "Aide formateur via WhatsApp" : "Get help on WhatsApp"}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-success text-success-foreground rounded-full pl-3 pr-4 py-3 shadow-elevated hover:scale-105 transition-transform lite:shadow-none lite:hover:scale-100"
      style={{ backgroundColor: "#25D366", color: "#fff" }}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">
        {lang === "fr" ? "Aide" : "Help"}
      </span>
    </a>
  );
}
