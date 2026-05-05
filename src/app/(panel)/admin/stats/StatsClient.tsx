"use client";

import { PageHeader } from "@/components/panel/PageHeader";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Wallet,
  ArrowUpRight,
  Package,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

interface StatsClientProps {
  data: any;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function StatsClient({ data }: StatsClientProps) {
  const { summary, monthlyData, topPackages, statusStats } = data;
  const { dObj, locale, rates } = useLocale();
  const t = dObj(translations).adminPanel.adminStats;

  const statusPieData = [
    { name: t?.charts?.confirmed || "Confirmed", value: statusStats.CONFIRMED, color: "#10b981" },
    { name: t?.charts?.pending || "Pending", value: statusStats.PENDING, color: "#f59e0b" },
    { name: t?.charts?.completed || "Completed", value: statusStats.COMPLETED, color: "#3b82f6" },
    { name: t?.charts?.cancelled || "Cancelled", value: statusStats.CANCELLED, color: "#ef4444" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={t?.title || "Dashboard Statistik"}
        description={t?.description || "Pantau performa bisnis Titan Travel secara real-time"}
      />

      {/* 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t?.cards?.revenue || "Total Pendapatan"}
          value={formatCurrency(summary.totalRevenue, locale, rates)}
          icon={<Wallet className="w-5 h-5" />}
          trend={t?.cards?.trendRevenue || "+12% bulan ini"}
          color="primary"
        />
        <StatCard
          label={t?.cards?.bookings || "Total Booking"}
          value={summary.totalBookings}
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={t?.cards?.trendBookings || "Semua status"}
          color="success"
        />
        <StatCard
          label={t?.cards?.pax || "Total Peserta"}
          value={`${summary.totalPax} Pax`}
          icon={<Users className="w-5 h-5" />}
          trend={t?.cards?.trendPax || "Total dari semua tour"}
          color="accent"
        />
        <StatCard
          label={t?.cards?.pending || "Piutang (Pending)"}
          value={formatCurrency(summary.totalPendingRevenue, locale, rates)}
          icon={<ArrowUpRight className="w-5 h-5" />}
          trend={t?.cards?.trendPending || "Belum lunas"}
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE CHART (2/3 width) */}
        <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-foreground">{t?.cards?.revenueTrend || "Tren Pendapatan"}</h3>
              <p className="text-xs text-foreground-secondary">{t?.cards?.revenueSubtitle || "Akumulasi pembayaran diterima tahun ini"}</p>
            </div>
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--foreground-secondary)" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--foreground-secondary)" }}
                  tickFormatter={(val) => `Rp${val/1000000}jt`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card-bg)", 
                    borderRadius: "12px", 
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--card-shadow-lg)",
                    color: "var(--foreground)" 
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  formatter={(val: any) => [formatCurrency(val, locale, rates), t?.charts?.revenue || "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary-500)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATUS PIE CHART (1/3 width) */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-2">{t?.cards?.orderStatus || "Status Pesanan"}</h3>
          <p className="text-xs text-foreground-secondary mb-8">{t?.cards?.orderSubtitle || "Distribusi status booking saat ini"}</p>
          
          <div className="h-62.5 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card-bg)", 
                    borderRadius: "12px", 
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--card-shadow-lg)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground">{summary.totalBookings}</span>
              <span className="text-[10px] font-bold text-foreground-secondary uppercase">Total</span>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <StatusRow label={t?.charts?.confirmed || "Confirmed"} count={statusStats.CONFIRMED} color="bg-emerald-500" icon={<CheckCircle className="w-3 h-3"/>} />
            <StatusRow label={t?.charts?.pending || "Pending"} count={statusStats.PENDING} color="bg-amber-500" icon={<Clock className="w-3 h-3"/>} />
            <StatusRow label={t?.charts?.completed || "Completed"} count={statusStats.COMPLETED} color="bg-emerald-500" icon={<CheckCircle className="w-3 h-3"/>} />
            <StatusRow label={t?.charts?.cancelled || "Cancelled"} count={statusStats.CANCELLED} color="bg-rose-500" icon={<XCircle className="w-3 h-3"/>} />
          </div>
        </div>
      </div>

      {/* TOP PACKAGES CHART */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-accent-500/10 text-accent-500 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{t?.cards?.topPackages || "5 Paket Terpopuler"}</h3>
            <p className="text-xs text-foreground-secondary">{t?.cards?.topPackagesSubtitle || "Berdasarkan total peserta (pax) yang sudah memesan"}</p>
          </div>
        </div>
        
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPackages} layout="vertical" margin={{ left: 40, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 600, fill: "var(--foreground-secondary)" }}
                width={150}
              />
              <Tooltip 
                cursor={{ fill: "var(--foreground-secondary)", opacity: 0.05 }}
                contentStyle={{ 
                  backgroundColor: "var(--card-bg)", 
                  borderRadius: "12px", 
                  border: "1px solid var(--card-border)",
                  boxShadow: "var(--card-shadow-lg)"
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                {topPackages.map((item: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color }: any) {
  // Mapping color to theme variables
  const colorConfigs: any = {
    primary: {
      bg: "bg-primary-500/10",
      text: "text-primary-500",
      trend: "bg-primary-500/5 text-primary-600"
    },
    accent: {
      bg: "bg-accent-500/10",
      text: "text-accent-500",
      trend: "bg-accent-500/5 text-accent-600"
    },
    success: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      trend: "bg-emerald-500/5 text-emerald-600"
    },
    danger: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      trend: "bg-destructive/5 text-destructive"
    }
  };

  const config = colorConfigs[color] || colorConfigs.primary;

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity ${config.text}`}>
        {icon}
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl ${config.bg} ${config.text} shadow-sm`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.trend}`}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold text-foreground-secondary uppercase tracking-wider mb-1">{label}</p>
        <h4 className="text-2xl font-black text-foreground">{value}</h4>
      </div>
    </div>
  );
}

function StatusRow({ label, count, color, icon }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-foreground/5 transition-colors">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${color} text-white shadow-sm`}>{icon}</div>
        <span className="text-xs font-bold text-foreground-secondary">{label}</span>
      </div>
      <span className="text-xs font-black text-foreground">{count}</span>
    </div>
  );
}
