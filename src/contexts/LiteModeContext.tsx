import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface LiteModeContextType {
  isLite: boolean;
  toggleLite: () => void;
  setLite: (v: boolean) => void;
  fontSize: "base" | "lg" | "xl";
  setFontSize: (s: "base" | "lg" | "xl") => void;
  streakDays: number;
}

const LiteModeContext = createContext<LiteModeContextType | undefined>(undefined);

function detectSlowConnection(): boolean {
  // @ts-ignore
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return false;
  if (c.saveData) return true;
  if (c.effectiveType === "2g" || c.effectiveType === "slow-2g") return true;
  return false;
}

function computeStreak(): number {
  const today = new Date().toDateString();
  const last = localStorage.getItem("fs-last-visit");
  const stored = parseInt(localStorage.getItem("fs-streak") || "0", 10);
  let streak = stored || 1;
  if (last) {
    const lastDate = new Date(last);
    const diff = Math.round((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) streak = stored || 1;
    else if (diff === 1) streak = stored + 1;
    else streak = 1;
  }
  localStorage.setItem("fs-last-visit", today);
  localStorage.setItem("fs-streak", String(streak));
  return streak;
}

export function LiteModeProvider({ children }: { children: ReactNode }) {
  const [isLite, setIsLite] = useState<boolean>(() => {
    const stored = localStorage.getItem("fs-lite");
    if (stored !== null) return stored === "true";
    return detectSlowConnection();
  });

  const [fontSize, setFontSizeState] = useState<"base" | "lg" | "xl">(() => {
    return (localStorage.getItem("fs-font") as any) || "base";
  });

  const [streakDays] = useState<number>(() => computeStreak());

  useEffect(() => {
    document.documentElement.classList.toggle("lite", isLite);
    localStorage.setItem("fs-lite", String(isLite));
  }, [isLite]);

  useEffect(() => {
    document.documentElement.classList.remove("font-base", "font-lg", "font-xl");
    document.documentElement.classList.add(`font-${fontSize}`);
    localStorage.setItem("fs-font", fontSize);
  }, [fontSize]);

  const toggleLite = useCallback(() => setIsLite((v) => !v), []);
  const setLite = useCallback((v: boolean) => setIsLite(v), []);
  const setFontSize = useCallback((s: "base" | "lg" | "xl") => setFontSizeState(s), []);

  return (
    <LiteModeContext.Provider value={{ isLite, toggleLite, setLite, fontSize, setFontSize, streakDays }}>
      {children}
    </LiteModeContext.Provider>
  );
}

export function useLiteMode() {
  const ctx = useContext(LiteModeContext);
  if (!ctx) throw new Error("useLiteMode must be used within LiteModeProvider");
  return ctx;
}
