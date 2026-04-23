import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary-500",
  iconBg = "bg-primary-500/10",
  trend,
  trendColor = "text-green-500",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg shadow-sm p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm font-medium text-foreground-secondary">{title}</p>
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      {trend && (
        <p className={`text-xs mt-1.5 font-medium ${trendColor}`}>{trend}</p>
      )}
    </div>
  );
}
