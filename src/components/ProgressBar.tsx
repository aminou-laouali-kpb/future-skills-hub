import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({ value, label, size = "md", className }: ProgressRingProps) {
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="text-xs font-semibold text-foreground">{value}%</span>
        </div>
      )}
      <Progress value={value} className={cn(heights[size], "[&>div]:bg-primary")} />
    </div>
  );
}
