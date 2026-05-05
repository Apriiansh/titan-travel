"use client";

import { PageHeader } from "@/components/panel/PageHeader";
import { FileText, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

export default function ManagerReportsPage() {
  const { dObj } = useLocale();
  const t = dObj(translations).managerPanel.reportCenter;

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t.title} 
        description={t.description}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/manager/reports/bookings" className="group">
          <div className="bg-card-bg border border-card-border p-6 rounded-2xl hover:border-primary-500/50 transition-all shadow-sm">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500">
                <FileText className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-card-border group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="text-lg font-bold mt-4 text-foreground">{t.transaction.title}</h3>
            <p className="text-sm text-foreground-secondary mt-1">{t.transaction.description}</p>
          </div>
        </Link>

        <Link href="/manager/reports/topsis" className="group">
          <div className="bg-card-bg border border-card-border p-6 rounded-2xl hover:border-accent-500/50 transition-all shadow-sm">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-accent-500/10 text-accent-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-card-border group-hover:text-accent-500 transition-colors" />
            </div>
            <h3 className="text-lg font-bold mt-4 text-foreground">{t.topsis.title}</h3>
            <p className="text-sm text-foreground-secondary mt-1">{t.topsis.description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
