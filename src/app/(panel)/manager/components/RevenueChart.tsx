"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TrendingUp, Calendar } from "lucide-react";

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
  period: string;
  onPeriodChange: (value: string) => void;
}

export function RevenueChart({ data, period, onPeriodChange }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Analisis Pendapatan</h3>
          </div>
          <p className="text-xs text-foreground-secondary font-medium">Visualisasi performa keuangan Titan Travel</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-foreground-secondary" />
          <Select value={period} onValueChange={(val) => onPeriodChange(val ?? "6months")}>
            <SelectTrigger className="w-35 h-9 text-xs rounded-xl border-card-border bg-background">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-card-border">
              <SelectItem value="6months" className="text-xs">6 Bulan Terakhir</SelectItem>
              <SelectItem value="year" className="text-xs">Tahun Ini</SelectItem>
              <SelectItem value="all" className="text-xs">Seluruh Waktu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(value) => `Rp ${value/1000000}jt`}
              width={60}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                      <p className="text-sm font-bold text-primary-600">{formatCurrency(payload[0].value as number)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
