import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-2 text-xl font-semibold">{t.notFound.title}</p>
        <p className="mb-6 text-muted-foreground">{t.notFound.message}</p>
        <Button asChild>
          <Link to="/">{t.notFound.back}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
