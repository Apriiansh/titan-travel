"use client";

import { useState, useTransition } from "react";
import { 
  TrendingUp, 
  Banknote, 
  CalendarCheck, 
  Package as PackageIcon,
  Medal,
  Users,
  Wallet
} from "lucide-react";
import { RevenueChart } from "./components/RevenueChart";
import { getManagerDashboardStats } from "@/lib/actions/dashboard";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import { formatCurrency } from "@/lib/utils";

interface TopPackage {
  id: string;
  title: string;
  totalRevenue: number;
  bookingCount: number;
}

interface ManagerStats {
  totalRevenue: number;
  completedBookings: number;
  topPackages: TopPackage[];
  chartData: { name: string; revenue: number }[];
}

export function ManagerDashboardClient({ 
  initialStats, 
  userName 
}: { 
  initialStats: ManagerStats;
  userName: string;
}) {
  const [stats, setStats] = useState(initialStats);
  const [period, setPeriod] = useState("6months");
  const [isPending, startTransition] = useTransition();
  const { dObj, locale, rates } = useLocale();
  const t = dObj(translations).managerPanel;

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    startTransition(async () => {
      const newStats = await getManagerDashboardStats(newPeriod);
      setStats(newStats);
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-(family-name:--font-playfair)">
            {t?.title || "Dashboard Manager"}
          </h1>
          <p className="text-sm text-foreground-secondary font-medium">
            {t?.greeting || "Hello"}, <span className="text-primary-600 font-bold">{userName}</span>. {t?.description || "Monitor business growth and performance."}
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative group overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Banknote className="w-32 h-32 text-primary-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600">
              <Banknote className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground-secondary uppercase tracking-wider">{t?.stats?.totalRevenue || "Total Revenue"}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">
              {formatCurrency(stats.totalRevenue, locale, rates)}
            </span>
          </div>
          <p className="text-[10px] text-foreground-secondary mt-2 font-medium italic">
            * {t?.stats?.confirmedOrdersNote || "Based on confirmed/completed orders"}
          </p>
        </div>

        <div className="relative group overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CalendarCheck className="w-32 h-32 text-emerald-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground-secondary uppercase tracking-wider">{t?.stats?.completedBookings || "Completed Bookings"}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">
              {stats.completedBookings}
            </span>
            <span className="text-xs font-bold text-emerald-600 uppercase">Bookings</span>
          </div>
          <p className="text-[10px] text-foreground-secondary mt-2 font-medium italic">
            * {t?.stats?.completedTripsNote || "Total completed trips"}
          </p>
        </div>
      </div>

      {/* Main Content: Chart & Top Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart - 2/3 Width */}
        <div className="lg:col-span-2">
          <RevenueChart 
            data={stats.chartData} 
            period={period} 
            onPeriodChange={handlePeriodChange} 
          />
        </div>

        {/* Top Packages - 1/3 Width */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 text-amber-500 mb-6">
            <Medal className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">{t?.stats?.topPackages || "Top Packages"}</h3>
          </div>

          <div className="flex-1 space-y-6">
            {stats.topPackages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-foreground-secondary text-center">
                <PackageIcon className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-xs font-medium italic">{t?.stats?.noPackageData || "No package performance data yet"}</p>
              </div>
            ) : (
              stats.topPackages.map((pkg, idx) => (
                <div key={pkg.id} className="relative group flex items-start gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all border border-transparent hover:border-card-border/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-black shrink-0 border border-amber-500/20">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary-600 transition-colors">
                      {pkg.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <Wallet className="w-3 h-3" />
                        {formatCurrency(pkg.totalRevenue, locale, rates)}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-foreground-secondary">
                        <Users className="w-3 h-3" />
                        {pkg.bookingCount} {t?.stats?.bookingsLabel || "Bookings"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-card-border">
            <p className="text-[9px] text-foreground-secondary italic leading-tight uppercase tracking-tight font-bold">
              * {t?.stats?.sortedByRevenue || "Sorted by highest revenue accumulation"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
