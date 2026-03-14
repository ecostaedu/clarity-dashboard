import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ label, value, trend, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow duration-150 group",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={cn("text-xs font-medium", trend.positive ? "text-success" : "text-destructive")}>
            {trend.value}
          </span>
          <span className="text-xs text-muted-foreground">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}
