"use client";

import { useState } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Calendar,
  FileSpreadsheet,
  Loader2,
  Users
} from "lucide-react";
import { getBookingReport } from "@/lib/actions/reports";
import { format } from "date-fns";
import { id, enUS, ms } from "date-fns/locale";
import { exportBookingsToExcel } from "@/lib/utils/export";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import { formatCurrency } from "@/lib/utils";

export function ReportBookingsClient({ initialData }: { initialData: any[] }) {
  const { dObj, locale, rates } = useLocale();
  const t = dObj(translations).managerPanel.reports;
  const common = dObj(translations).managerPanel.common;
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Date-fns locale mapping
  const dateLocale = locale === "en" ? enUS : locale === "ms" ? ms : id;

  const handleFilter = async () => {
    setIsLoading(true);
    try {
        const result = await getBookingReport(startDate, endDate);
        setData(result);
    } finally {
        setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      await exportBookingsToExcel(data, startDate, endDate);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const totalRevenue = data.reduce((sum, b) => sum + Number(b.amountPaid), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.title}
        description={t.description}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="outline"
              onClick={exportToExcel}
              disabled={isExporting}
              className="h-10 px-6 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 gap-2 font-bold shadow-sm"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              {t.exportExcel}
            </Button>
          </div>
        }
      />

      {/* Stats Summary - New Section for Manager */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="p-6 rounded-2xl border border-card-border bg-card-bg shadow-sm">
          <p className="text-[10px] font-bold text-foreground-secondary uppercase tracking-widest mb-1">{t.totalRevenue}</p>
          <p className="text-2xl font-black text-primary-600">{formatCurrency(totalRevenue, locale, rates)}</p>
        </div>
        <div className="p-6 rounded-2xl border border-card-border bg-card-bg shadow-sm">
          <p className="text-[10px] font-bold text-foreground-secondary uppercase tracking-widest mb-1">{t.totalBookings}</p>
          <p className="text-2xl font-black text-foreground">{data.length}</p>
        </div>
        <div className="p-6 rounded-2xl border border-card-border bg-card-bg shadow-sm">
          <p className="text-[10px] font-bold text-foreground-secondary uppercase tracking-widest mb-1">{t.reportPeriod}</p>
          <p className="text-sm font-bold text-foreground mt-2">
            {startDate ? format(new Date(startDate), "dd/MM/yy") : common.start} - {endDate ? format(new Date(endDate), "dd/MM/yy") : common.now}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end gap-4 bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm no-print">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-wider">{t.startDate}</label>
            <div className="relative">
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background border-card-border pl-10 rounded-xl"
              />
              <Calendar className="w-4 h-4 text-foreground-secondary absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-wider">{t.endDate}</label>
            <div className="relative">
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-background border-card-border pl-10 rounded-xl"
              />
              <Calendar className="w-4 h-4 text-foreground-secondary absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleFilter} 
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 h-10 px-8 rounded-xl gap-2 font-bold shadow-md shadow-primary-500/10"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
          {t.showData}
        </Button>
      </div>

      <div className="rounded-2xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-muted/30">
                <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px] w-16">{t.no}</th>
                <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t.customer}</th>
                <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t.package}</th>
                <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t.vehicle}</th>
                <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t.pax}</th>
                <th className="text-right px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t.pricePerPax}</th>
                <th className="text-right px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t.totalAmount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center text-foreground-secondary italic">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-10" />
                    {t.noDataFound}
                  </td>
                </tr>
              ) : (
                data.map((b, i) => {
                  const amountPaid = Number(b.amountPaid);
                  const pax = Number(b.pax);
                  const pricePerPax = pax > 0 ? amountPaid / pax : 0;

                  return (
                    <tr key={b.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4 text-center text-xs font-bold text-foreground-secondary">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">{b.name}</p>
                          <p className="text-[11px] text-foreground-secondary font-medium">
                            {format(new Date(b.createdAt), "dd MMM yyyy", { locale: dateLocale })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground text-xs leading-tight">
                          {(b.package?.title as any)?.[locale] || (b.package?.title as any)?.id || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-foreground">
                          {b.vehicleType?.name || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-secondary bg-foreground/5 px-2.5 py-1 rounded-lg">
                          <Users className="w-3 h-3" />
                          {b.pax}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-medium text-foreground">
                          {formatCurrency(pricePerPax, locale, rates)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-black text-primary-600 text-sm">
                          {formatCurrency(amountPaid, locale, rates)}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot className="bg-primary-500/5">
                <tr>
                  <td colSpan={6} className="px-6 py-5 text-right font-black text-xs uppercase tracking-widest text-foreground-secondary">
                    {t.totalIncome}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="font-black text-xl text-primary-600">
                      {formatCurrency(totalRevenue, locale, rates)}
                    </p>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
