import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "positive" | "negative" | "warning";
}

const variantStyles = {
  default: "bg-card",
  positive: "bg-card border-sentiment-positive/20",
  negative: "bg-card border-sentiment-negative/20",
  warning: "bg-card border-sentiment-warning/20",
};

const iconVariants = {
  default: "bg-primary/10 text-primary",
  positive: "bg-sentiment-positive/10 text-sentiment-positive",
  negative: "bg-sentiment-negative/10 text-sentiment-negative",
  warning: "bg-sentiment-warning/10 text-sentiment-warning",
};

const KPICard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: KPICardProps) => {
  return (
    <div className={cn("rounded-xl border p-5 card-shadow animate-fade-in", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs font-medium mt-2", trend.positive ? "text-sentiment-positive" : "text-sentiment-negative")}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
