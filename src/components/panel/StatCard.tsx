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
    <div className="group relative rounded-xl border border-card-border bg-card-bg shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`h-1 ${iconBg.replace("/10", "")} opacity-60`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-secondary/70">{title}</p>
          <div
            className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} transition-transform group-hover:scale-110`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-foreground tracking-tight">{value}</div>
        {trend && (
          <p className={`text-[11px] mt-2 font-semibold ${trendColor}`}>{trend}</p>
        )}
      </div>
    </div>
  );
}
