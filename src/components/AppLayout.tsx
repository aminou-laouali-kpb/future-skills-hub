import { Outlet, useLocation } from "react-router-dom";
import { SkipLink } from "@/components/SkipLink";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { cn } from "@/lib/utils";

const FULL_WIDTH_ROUTES = ["/", "/login", "/onboarding"];

export function AppLayout() {
  const { pathname } = useLocation();
  const withBottomPad = !FULL_WIDTH_ROUTES.includes(pathname);

  return (
    <>
      <SkipLink />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn("outline-none", withBottomPad && "pb-20 md:pb-0")}
      >
        <Outlet />
      </main>
      <MobileBottomNav />
    </>
  );
}
