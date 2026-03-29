import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

interface StatusBadgeProps {
  status: "locked" | "in_progress" | "completed" | "submitted" | "feedback" | "draft" | "overdue";
  className?: string;
}

const statusStyles = {
  locked: "bg-muted text-muted-foreground",
  in_progress: "bg-info/15 text-info border-info/20",
  completed: "bg-success/15 text-success border-success/20",
  submitted: "bg-info/15 text-info border-info/20",
  feedback: "bg-accent/20 text-accent-foreground border-accent/30",
  draft: "bg-muted text-muted-foreground",
  overdue: "bg-destructive/15 text-destructive border-destructive/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useLanguage();
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", statusStyles[status], className)}>
      {t.status[status]}
    </Badge>
  );
}
