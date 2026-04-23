"use client";

import { useState, useEffect } from "react";
import { Users, Ticket, Wallet, DollarSign, RefreshCw, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatsData } from "@/lib/actions/stats";

export function StatsClient({ initialData }: { initialData: StatsData }) {
  const [stats, setStats] = useState<StatsData>(initialData);
  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoadingRate(true);
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const resData = await response.json();
        setRate(resData.rates.IDR);
      } catch (err) {
        console.error("Gagal mengambil kurs", err);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRate();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Gagal mengambil data terbaru");
      const newData = await response.json();
      setStats(newData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat("id-ID").format(revenue);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-(family-name:--font-playfair)">
            Statistik & Analitik
          </h1>
          <p className="text-sm text-foreground-secondary">
            Pantau performa bisnis Titan Travel secara real-time.
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-card-bg border border-card-border rounded-xl shadow-sm hover:bg-background-secondary transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-primary-500 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="text-xs font-semibold text-foreground">
            {isRefreshing ? "Menyinkronkan..." : "Sinkronisasi Data"}
          </span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Stats (Left 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Revenue Card */}
            <div className="relative overflow-hidden rounded-2xl bg-primary-500 text-white p-6 flex flex-col justify-between shadow-lg">
              <div className="absolute -top-8 -right-8 text-white/10 rotate-12 pointer-events-none">
                <Wallet size={120} strokeWidth={1.5} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/90">Total Pendapatan (YTD)</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-white/80">Rp</span>
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {formatRevenue(stats.totalRevenue)}
                  </h3>
                </div>
                {rate && (
                  <p className="mt-1 text-xs text-white/80 font-medium">
                    ≈ $ {(stats.totalRevenue / rate).toLocaleString('en-US', {maximumFractionDigits: 0})} USD
                  </p>
                )}
              </div>
            </div>

            {/* Currency Card */}
            <div className="rounded-2xl bg-card-bg border border-card-border p-6 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Kurs USD</span>
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              </div>
              <div>
                {loadingRate ? (
                  <div className="h-8 w-24 bg-background-secondary rounded-lg animate-pulse" />
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                      {rate?.toLocaleString("id-ID") || "---"}
                    </h3>
                    <span className="text-sm font-bold text-foreground-secondary">IDR</span>
                  </div>
                )}
                <p className="text-xs font-medium text-foreground-secondary mt-1">Nilai tukar 1 USD saat ini.</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm min-h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Tren Pertumbuhan</h3>
                <p className="text-xs font-medium text-foreground-secondary">Aktivitas 6 Bulan Terakhir</p>
              </div>
              <div className="p-1.5 bg-background-secondary rounded-lg border border-card-border">
                <ArrowUpRight className="w-4 h-4 text-foreground-secondary" />
              </div>
            </div>
            <div className="w-full flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPemesanan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-500)" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="var(--accent-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--foreground-secondary)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--foreground-secondary)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" strokeOpacity={0.5} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--card-border)",
                      backgroundColor: "var(--card-bg)",
                      color: "var(--foreground)",
                      boxShadow: "var(--card-shadow)",
                      fontSize: "12px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pendapatan"
                    name="Pendapatan (Juta)"
                    stroke="var(--primary-500)" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPendapatan)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pemesanan"
                    name="Pemesanan"
                    stroke="var(--accent-500)" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPemesanan)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-card-border">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-[10px] font-bold text-foreground-secondary uppercase">Pendapatan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent-500" />
                <span className="text-[10px] font-bold text-foreground-secondary uppercase">Pemesanan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stats (Right 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Total Customers */}
          <div className="rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm relative overflow-hidden group">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  <Users className="w-5 h-5 text-primary-500 group-hover:text-white" />
                </div>
                <p className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Total Pelanggan</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-4xl font-bold tracking-tight text-foreground">
                  {stats.totalUsers.toLocaleString()}
                </h3>
                <span className="text-sm font-medium text-foreground-secondary">User</span>
              </div>
          </div>

          {/* Monthly Bookings */}
          <div className="rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-all duration-300">
                  <Ticket className="w-5 h-5 text-accent-500 group-hover:text-white" />
                </div>
                <p className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Booking Bulan Ini</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-4xl font-bold tracking-tight text-foreground">
                  {stats.monthlyBookings.toLocaleString()}
                </h3>
                <span className="text-sm font-medium text-foreground-secondary">Tiket</span>
              </div>
          </div>

          {/* Published Packages */}
          <div className="rounded-2xl bg-background-secondary border border-card-border p-6 flex items-center justify-between">
            <p className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Paket Aktif</p>
            <h4 className="text-xl font-bold text-primary-500">
              {stats.publishedPackages}
            </h4>
          </div>

          {/* Tips/Info Card */}
          <div className="mt-auto p-6 rounded-2xl bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg">
            <h4 className="font-bold text-sm mb-2">💡 Tips Analitik</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Gunakan sinkronisasi data secara berkala untuk mendapatkan angka terbaru dari sistem pemesanan pusat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
