import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "locked" | "in_progress" | "completed" | "submitted" | "feedback" | "draft" | "overdue";
  className?: string;
}

const statusConfig = {
  locked: { label: "Verrouillé", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "En cours", className: "bg-info/15 text-info border-info/20" },
  completed: { label: "Terminé", className: "bg-success/15 text-success border-success/20" },
  submitted: { label: "Soumis", className: "bg-info/15 text-info border-info/20" },
  feedback: { label: "Feedback reçu", className: "bg-accent/20 text-accent-foreground border-accent/30" },
  draft: { label: "Brouillon", className: "bg-muted text-muted-foreground" },
  overdue: { label: "En retard", className: "bg-destructive/15 text-destructive border-destructive/20" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
