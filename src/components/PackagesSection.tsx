"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Star, MapPin, Clock, Users, ArrowRight, Sparkles, ThumbsUp, CheckCircle2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";

import { useState } from "react";
import RecommendationFinder from "./RecommendationFinder";

export default function PackagesSection({
  dbData,
  settingsData,
  limit = 6,
  hideViewAll = false,
}: {
  dbData?: any[];
  settingsData?: any;
  limit?: number | null;
  hideViewAll?: boolean;
}) {
  const { dt, dObj, locale } = useLocale();
  const [recommendedPackages, setRecommendedPackages] = useState<any[]>([]);

  // Localize the whole settings object first
  const p = dObj(settingsData) || {};

  // Use recommended packages if available, otherwise use default
  const displayPackages =
    recommendedPackages.length > 0
      ? limit
        ? recommendedPackages.slice(0, limit)
        : recommendedPackages
      : limit
        ? (dbData || []).slice(0, limit)
        : dbData || [];

  const formatPrice = (priceStr: string | number) => {
    const numPrice = Number(priceStr);
    if (isNaN(numPrice)) return priceStr;
    if (locale === "id") {
      return `Rp ${numPrice.toLocaleString("id-ID")}`;
    }
    if (locale === "ms") {
      return `RM ${(numPrice / 3500).toLocaleString("ms-MY", { maximumFractionDigits: 0 })}`;
    }
    return `$${(numPrice / 15000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  return (
    <section
      id="paket"
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Abstract Decorative */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs sm:text-sm font-semibold mb-3">
              {p.badge || "Popular Packages"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
              {p.title1 || "Destinations"}{" "}
              <span className="gradient-text">{p.title2 || "Popular"}</span>
            </h2>
            <p className="text-foreground-secondary text-sm sm:text-base">
              {p.subtitle}
            </p>
          </div>
          {!hideViewAll && (
            <Link
              href="/paket"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary-500 text-primary-500 font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300"
            >
              {p.viewAll || "View All"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <RecommendationFinder
          onResult={(results) => setRecommendedPackages(results)}
        />

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {displayPackages.map((pkg: any) => (
            <div
              key={pkg.id}
              className={`group flex flex-col rounded-2xl overflow-hidden bg-card-bg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                pkg.topsisScore 
                  ? "border-primary-500/40 shadow-lg shadow-primary-500/5" 
                  : "border-card-border shadow-sm"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <Image
                  src={
                    (pkg.images &&
                      Array.isArray(pkg.images) &&
                      pkg.images[0]) ||
                    "/placeholder.jpg"
                  }
                  alt={dt(pkg.title || "Package")}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {pkg.badge ? (
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg border w-fit flex items-center gap-1.5 backdrop-blur-md ${pkg.badge.color}`}
                    >
                      {pkg.badge.icon === "Sparkles" && <Sparkles size={12} className="fill-current" />}
                      {pkg.badge.icon === "ThumbsUp" && <ThumbsUp size={12} />}
                      {pkg.badge.icon === "Check" && <CheckCircle2 size={12} />}
                      {pkg.badge.icon === "Info" && <Info size={12} />}
                      {pkg.badge.label}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-primary-500 text-white text-[10px] font-bold shadow-lg w-fit">
                      {dt(pkg.tag || "Travel")}
                    </span>
                  )}

                  {pkg.topsisScore && (
                    <span className="px-3 py-1.5 rounded-full bg-accent-500 text-white text-[10px] font-black shadow-lg w-fit flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      {((pkg.topsisScore * 100)).toFixed(0)}% Match
                    </span>
                  )}
                </div>

                {/* Price Label */}
                <div className="absolute bottom-4 right-4 text-right">
                  {pkg.originalPrice && (
                    <span className="block text-white/70 text-xs line-through mb-0.5">
                      {formatPrice(pkg.originalPrice)}
                    </span>
                  )}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl">
                    <span className="block text-white text-lg font-bold">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7 flex flex-col grow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    {pkg.topsisScore ? (
                      <div className="flex items-center gap-1 bg-accent-500/10 text-accent-600 px-2 py-0.5 rounded text-[10px] font-bold border border-accent-500/20">
                        <Sparkles className="w-3 h-3 fill-current" />
                        Best Recommendation
                      </div>
                    ) : (
                      <>
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <span className="text-sm font-bold text-foreground">
                          {Number(pkg.rating ?? 4.9).toFixed(1)}
                        </span>
                        <span className="text-xs text-foreground-secondary">
                          ({pkg.reviews ?? 0} reviews)
                        </span>
                      </>
                    )}
                  </div>
                  {pkg.ranking && (
                    <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                      Rank #{pkg.ranking}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-foreground font-(family-name:--font-playfair) mb-4 group-hover:text-primary-500 transition-colors line-clamp-1">
                  {dt(pkg.title || "Package Title")}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                    <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{dt(pkg.location || "Location")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                    <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span>{dt(pkg.duration || "Duration")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-auto border-t border-card-border">
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary font-medium">
                    <Users className="w-4 h-4 text-slate-400" />
                    {pkg.capacity || 0} {locale === "id" ? "Peserta" : "Pax"}
                  </div>
                  <Link
                    href={`/paket/${pkg.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500/10 text-primary-600 rounded-xl text-xs font-bold hover:bg-primary-500 hover:text-white transition-all duration-300"
                  >
                    {p.detail || "View Detail"}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!hideViewAll && (
          <div className="text-center mt-8 sm:mt-12 md:hidden">
            <Link
              href="/paket"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary-500 text-primary-500 font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300"
            >
              {p.viewAll || "View All"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
