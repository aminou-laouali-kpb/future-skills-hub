import { useLiteMode } from "@/contexts/LiteModeContext";
import { cn } from "@/lib/utils";

export function FontSizeControl() {
  const { fontSize, setFontSize } = useLiteMode();
  const sizes: { value: "base" | "lg" | "xl"; label: string; cls: string }[] = [
    { value: "base", label: "A", cls: "text-xs" },
    { value: "lg", label: "A", cls: "text-sm" },
    { value: "xl", label: "A", cls: "text-base" },
  ];
  return (
    <div className="inline-flex items-center rounded-full bg-secondary p-0.5" aria-label="Taille du texte">
      {sizes.map((s) => (
        <button
          key={s.value}
          onClick={() => setFontSize(s.value)}
          className={cn(
            "px-2 py-1 rounded-full font-bold transition-colors leading-none",
            s.cls,
            fontSize === s.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={fontSize === s.value}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
