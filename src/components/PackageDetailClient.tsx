"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Share2,
  ArrowRight,
  Compass,
} from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

export default function PackageDetailClient({ pkg, adminPhone = "" }: { pkg: any; adminPhone?: string }) {
  const { dt, locale } = useLocale();
  const t = translations[locale as keyof typeof translations]?.packageDetail || translations.id.packageDetail;
  const [activeImage, setActiveImage] = useState(0);
  const images =
    pkg.images && pkg.images.length > 0
      ? pkg.images
      : [
          "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        ];

  const formatPrice = (priceStr: string | number) => {
    const numPrice = Number(priceStr);
    if (isNaN(numPrice)) return priceStr;
    if (locale === "id") return `Rp ${numPrice.toLocaleString("id-ID")}`;
    if (locale === "ms")
      return `RM ${(numPrice / 3500).toLocaleString("ms-MY", { maximumFractionDigits: 0 })}`;
    return `$${(numPrice / 15000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  const getWaktuLabel = (score: number) => {
    if (score === 1) return t.departureMorning;
    if (score === 2) return t.departureAfternoon;
    return t.departureEvening;
  };

  // Group price tiers by vehicle type
  const tiersByVehicle = (pkg.priceTiers || []).reduce((acc: any, tier: any) => {
    const vName = tier.vehicleType?.name || t.defaultVehicle || "Standar";
    if (!acc[vName]) acc[vName] = [];
    acc[vName].push(tier);
    return acc;
  }, {});

  return (
    <div id="detail_paket" className="pb-20 relative">
      {/* Decorative Blurs on Dark Hero Area */}
      <div className="absolute top-0 left-0 w-full h-128 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      {/* Light Background below hero */}
      <div className="absolute top-128 left-0 w-full bottom-0 bg-background z-0" />

      {/* Top Navigation Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/#paket"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToList}
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary-500 transition-all border border-white/10">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side: Images & Description */}
          <div className="lg:col-span-8 space-y-10">

            {/* Hero Title Section (On Dark BG) */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
                  <Compass className="w-3 h-3" />
                  {dt(pkg.tag || "Travel")}
                </span>
                <div className="flex items-center gap-1 text-accent-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold">{pkg.rating || "0"}</span>
                  <span className="text-[10px] text-white/40">({pkg.reviews || "0"})</span>
                </div>
                {pkg.facilityScore >= 4 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    {t.premiumLabel}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-white leading-tight">
                {dt(pkg.title)}
              </h1>

              <div className="flex flex-wrap gap-6 text-white/60 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/30">{t.locationLabel}</p>
                    <p className="text-sm font-semibold text-white">{dt(pkg.location)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/30">{t.durationLabel}</p>
                    <p className="text-sm font-semibold text-white">{dt(pkg.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/30">{t.capacityLabel}</p>
                    <p className="text-sm font-semibold text-white">{pkg.capacity} {t.capacityUnit}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <SafeImage
                  src={images[activeImage]}
                  alt={dt(pkg.title)}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? "border-primary-500 scale-95 shadow-lg" : "border-card-border opacity-60 hover:opacity-100"}`}
                    >
                      <SafeImage
                        src={img}
                        alt={`Thumb ${idx}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary-500 rounded-full" />
                <h2 className="text-2xl font-bold font-(family-name:--font-playfair) text-foreground">
                  {t.descriptionTitle}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-foreground-secondary leading-relaxed whitespace-pre-line">
                {(dt(pkg.description) || t.noDescription)
                  .split("\n")
                  .map((line, i) => (
                    <p key={i} className={line.trim() === "" ? "min-h-[1.2em]" : ""}>
                      {line}
                    </p>
                  ))}
              </div>
            </div>

            {/* Price Tiers Table */}
            {pkg.priceTiers && pkg.priceTiers.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-primary-500 rounded-full" />
                  <h2 className="text-2xl font-bold font-(family-name:--font-playfair) text-foreground">
                    {t.pricingTitle || "Daftar Tarif Wisata"}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(tiersByVehicle).map(([vName, tiers]: [string, any]) => (
                    <div key={vName} className="overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-sm">
                      <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-3 border-b border-card-border flex items-center gap-2">
                        <Compass className="w-4 h-4 text-primary-500" />
                        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                          {vName}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left bg-muted/30">
                              <th className="px-5 py-3 font-semibold text-foreground-secondary text-xs">{t.paxRangeLabel || "Jumlah Peserta"}</th>
                              <th className="px-5 py-3 font-semibold text-foreground-secondary text-xs text-right">{t.pricePerPaxLabel || "Harga per Orang"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-card-border">
                            {tiers.map((tier: any, idx: number) => (
                              <tr key={idx} className="hover:bg-primary-500/5 transition-colors">
                                <td className="px-5 py-4 text-foreground font-medium">
                                  {tier.minPax} - {tier.maxPax} {t.capacityUnit}
                                </td>
                                <td className="px-5 py-4 text-right">
                                  {tier.originalPrice && Number(tier.originalPrice) > 0 && (
                                    <span className="text-[10px] text-foreground-secondary line-through block opacity-50">
                                      {formatPrice(tier.originalPrice)}
                                    </span>
                                  )}
                                  <span className="text-primary-600 font-bold">
                                    {formatPrice(tier.price)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-foreground-secondary italic">
                  * {t.pricingNote || "Harga di atas dapat berubah sewaktu-waktu tergantung ketersediaan."}
                </p>
              </div>
            )}

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-card-bg border border-card-border flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">
                    {t.departureTitle}
                  </h4>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {t.departureDesc.split("{time}")[0]}
                    <span className="font-bold text-primary-500">
                      {getWaktuLabel(pkg.departureScore)}
                    </span>
                    {t.departureDesc.split("{time}")[1]}
                  </p>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-card-bg border border-card-border flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">
                    {t.guaranteeTitle}
                  </h4>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {t.guaranteeDesc.split("{score}")[0]}
                    <span className="font-bold text-primary-500">
                      {pkg.facilityScore}/5
                    </span>
                    {t.guaranteeDesc.split("{score}")[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Sticky Pricing Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-card-bg border border-card-border shadow-2xl shadow-primary-500/5 space-y-6 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />

                <div>
                  <p className="text-xs font-bold text-foreground-secondary uppercase tracking-widest mb-2">
                    {t.priceLabel}
                  </p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary-500">
                      {formatPrice(pkg.price)}
                    </h2>
                    <span className="text-sm text-foreground-secondary mb-1">
                      {t.pricePerPerson}
                    </span>
                  </div>
                  {pkg.originalPrice && (
                    <p className="text-sm text-foreground-secondary/60 line-through mt-1">
                      {formatPrice(pkg.originalPrice)}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-card-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      {t.depositLabel}
                    </span>
                    <span className="font-bold text-foreground">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      {t.availabilityLabel}
                    </span>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {t.availabilityValue}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link 
                    href={`/paket/${pkg.slug}/booking`}
                    className="w-full py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 group"
                  >
                    {t.bookNow}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <p className="text-[10px] text-center text-foreground-secondary leading-relaxed">
                  {t.priceDisclaimer}
                </p>
              </div>

              {/* Help Card — Chat WA Admin */}
              <a
                href={`https://api.whatsapp.com/send?phone=${adminPhone.startsWith("0") ? "62" + adminPhone.slice(1) : adminPhone}&text=${encodeURIComponent(`Halo Admin Titan Travel, saya ingin bertanya tentang paket ${typeof pkg.title === "object" ? (pkg.title as any)?.[locale] || (pkg.title as any)?.id : pkg.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex items-center gap-4 group cursor-pointer hover:bg-primary-500/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {t.helpTitle}
                  </h4>
                  <p className="text-xs text-foreground-secondary">
                    {t.helpSubtitle}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground-secondary ml-auto group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
