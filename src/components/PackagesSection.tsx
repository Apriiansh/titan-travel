"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Star, MapPin, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";

import { useState } from "react";
import RecommendationFinder from "./RecommendationFinder";

export default function PackagesSection({ 
    dbData, 
    settingsData, 
    limit = 6,
    hideViewAll = false
}: { 
    dbData?: any[], 
    settingsData?: any, 
    limit?: number | null,
    hideViewAll?: boolean
}) {
    const { dt, dObj, locale } = useLocale();
    const [recommendedPackages, setRecommendedPackages] = useState<any[]>([]);
    
    // Localize the whole settings object first
    const p = dObj(settingsData) || {};
    
    // Use recommended packages if available, otherwise use default
    const displayPackages = recommendedPackages.length > 0 
        ? (limit ? recommendedPackages.slice(0, limit) : recommendedPackages) 
        : (limit ? (dbData || []).slice(0, limit) : (dbData || []));

    const formatPrice = (priceStr: string | number) => {
        const numPrice = Number(priceStr);
        if (isNaN(numPrice)) return priceStr;
        if (locale === 'id') {
            return `Rp ${numPrice.toLocaleString('id-ID')}`;
        }
        if (locale === 'ms') {
            return `RM ${(numPrice / 3500).toLocaleString('ms-MY', { maximumFractionDigits: 0 })}`;
        }
        return `$${(numPrice / 15000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    };

    return (
        <section id="paket" className="section-padding bg-background relative overflow-hidden">
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

                <RecommendationFinder onResult={(results) => setRecommendedPackages(results)} />

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {displayPackages.map((pkg: any) => (
                        <div
                            key={pkg.id}
                            className={`group flex flex-col rounded-md overflow-hidden bg-card-bg border hover:shadow-xl transition-all duration-500 ${pkg.topsisScore ? 'border-primary-500/30' : 'border-card-border hover:border-primary-500/20'}`}
                        >
                            {/* Image Container */}
                            <div className="relative h-44 sm:h-52 overflow-hidden">
                                <Image
                                    src={(pkg.images && Array.isArray(pkg.images) && pkg.images[0]) || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80"}
                                    alt={dt(pkg.title || "Package")}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                {/* Tag */}
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2">
                                    {pkg.badge ? (
                                        <span className={`px-2.5 py-1 rounded-full text-white text-[10px] sm:text-xs font-bold shadow-lg w-fit flex items-center gap-1 ${
                                            pkg.badge.color === 'green' ? 'bg-green-600' :
                                            pkg.badge.color === 'blue' ? 'bg-blue-600' :
                                            pkg.badge.color === 'amber' ? 'bg-amber-500' :
                                            pkg.badge.color === 'orange' ? 'bg-orange-500' : 'bg-slate-500'
                                        }`}>
                                            {pkg.ranking === 1 && <Sparkles className="w-3 h-3 fill-current" />}
                                            {pkg.badge.label}
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full bg-primary-500 text-white text-[10px] sm:text-xs font-bold shadow-lg w-fit">
                                            {dt(pkg.tag || "Travel")}
                                        </span>
                                    )}
                                    
                                    {pkg.topsisScore && (
                                        <span className="px-2.5 py-1 rounded-full bg-black/40 text-white text-[10px] sm:text-[9px] font-medium backdrop-blur-md border border-white/20 w-fit">
                                            Match: {(pkg.topsisScore * 100).toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                                {/* Price Badge */}
                                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-right">
                                    {pkg.originalPrice && (
                                        <span className="block text-white/60 text-[10px] sm:text-xs line-through">
                                            {formatPrice(pkg.originalPrice)}
                                        </span>
                                    )}
                                    <span className="block text-white text-sm sm:text-lg font-bold">
                                        {formatPrice(pkg.price)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5 flex flex-col grow">
                                <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                                    {pkg.topsisScore ? (
                                        <Sparkles className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                                    ) : (
                                        <Star className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                                    )}
                                    {/* PERBAIKAN RATING: Menangani nilai 0 dan memformat dengan 1 angka desimal */}
                                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                                        {pkg.topsisScore ? `Best Match` : Number(pkg.rating ?? 4.9).toFixed(1)}
                                    </span>
                                    {/* PERBAIKAN REVIEWS: Menangani nilai 0 review */}
                                    <span className="text-[10px] sm:text-sm text-foreground-secondary">
                                        {pkg.topsisScore ? `#${pkg.ranking} Result` : `(${pkg.reviews ?? 0} review)`}
                                    </span>
                                </div>

                                <h3 className="text-sm sm:text-lg font-bold text-foreground font-(family-name:--font-playfair) mb-1.5 sm:mb-2 group-hover:text-primary-500 transition-colors">
                                    {dt(pkg.title || "Package Title")}
                                </h3>

                                <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-sm text-foreground-secondary">
                                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-500" />
                                        {dt(pkg.location || "Location")}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-sm text-foreground-secondary">
                                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-500" />
                                        {dt(pkg.duration || "Duration")}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 sm:pt-4 mt-auto border-t border-card-border">
                                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-foreground-secondary">
                                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        {pkg.capacity || 0} {locale === 'id' ? 'Peserta' : 'Pax'}
                                    </span>
                                    <Link 
                                        href={`/paket/${pkg.slug}`}
                                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors group/btn"
                                    >
                                        {p.detail || "Detail"}
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
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