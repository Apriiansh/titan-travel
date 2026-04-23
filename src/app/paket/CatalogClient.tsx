"use client";

import { ArrowLeft, MapPin, Star, Compass } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import PackagesSection from "@/components/PackagesSection";

export default function CatalogClient({ 
  packages, 
  settingsObj, 
  totalPackages 
}: { 
  packages: any[], 
  settingsObj: any,
  totalPackages: number
}) {
  const { locale } = useLocale();
  
  // Get translations based on active locale
  const t = translations[locale as keyof typeof translations] || translations.id;
  const cat = t.catalog;

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero Section (Solid Slate) ── */}
      <section className="relative w-full bg-slate-900 pt-24 sm:pt-32 pb-20 sm:pb-28">
        {/* Abstract background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {cat.backToHome}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
                  <Compass className="w-3 h-3" />
                  {cat.exploreCatalog}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-(family-name:--font-playfair)">
                {cat.titlePart1}{" "}
                <span className="text-primary-400 italic">{cat.titlePart2}</span>
              </h1>

              <p className="text-slate-300 max-w-xl text-base sm:text-lg leading-relaxed opacity-90">
                {cat.description}
              </p>

              {/* Stats chips */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">{cat.statsAvailable}</p>
                    <p className="text-sm text-white font-bold">
                      {cat.statsPackageCount.replace("{count}", totalPackages.toString())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">{cat.statsRating}</p>
                    <p className="text-sm text-white font-bold">{cat.statsTrust}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative h-64 rounded-2xl overflow-hidden border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={cat.heroAlt}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Packages Content ── */}
      <section className="bg-background relative z-10 rounded-t-[40px] -mt-10 border-t border-card-border">
        {/* Top info bar */}
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground font-(family-name:--font-playfair)">
              {cat.catalogTitle}
            </h2>
            <p className="text-sm text-foreground-secondary">
              {cat.showingCount.replace("{count}", totalPackages.toString())}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary border border-card-border rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-foreground-secondary font-bold uppercase tracking-wider">
              {cat.updateToday}
            </span>
          </div>
        </div>

        {/* Package grid from component */}
        <div className="pb-24">
          <PackagesSection
            dbData={packages}
            settingsData={settingsObj}
            limit={null}
            hideViewAll={true}
          />
        </div>
      </section>
    </main>
  );
}
