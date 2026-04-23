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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";

export default function PackageDetailClient({ pkg }: { pkg: any }) {
  const { dt, locale } = useLocale();
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
    if (score === 1) return "Pagi Hari";
    if (score === 2) return "Siang Hari";
    return "Malam Hari";
  };

  return (
    <div className="pb-20 relative">
      {/* Dark Hero Background Segment */}
      <div className="absolute top-[-80px] left-0 w-full h-[400px] bg-slate-900 z-0" />

      {/* Top Navigation Bar */}
      <div className="bg-transparent sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/#paket"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary-500 transition-all border border-white/10">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side: Images & Description */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <Image
                  src={images[activeImage]}
                  alt={dt(pkg.title)}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Float Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 rounded-full bg-primary-500 text-white text-xs font-bold shadow-xl">
                    {dt(pkg.tag || "Travel")}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? "border-primary-500 scale-95 shadow-lg" : "border-white/10 opacity-60 hover:opacity-100"}`}
                    >
                      <Image
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

            {/* Title & Info Mobile */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-accent-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-accent-400">4.9</span>
                  <span className="text-xs text-primary-400/60">
                    (120+ Review)
                  </span>
                </div>
                {pkg.facilityScore >= 4 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Fasilitas Premium
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-slate-900 leading-tight">
                {dt(pkg.title)}
              </h1>

              <div className="flex flex-wrap gap-6 text-slate-700 border-y border-white/10 py-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600/40">
                      Lokasi
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {dt(pkg.location)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600/40">
                      Durasi
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {dt(pkg.duration)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600/40">
                      Kapasitas
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {pkg.capacity} Pax
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary-500 rounded-full" />
                <h2 className="text-2xl font-bold font-(family-name:--font-playfair)">
                  Rincian Perjalanan
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-foreground-secondary leading-relaxed">
                {dt(pkg.description) ||
                  "Tidak ada deskripsi tersedia untuk paket ini."}
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-card-bg border border-card-border flex gap-4">
                <Calendar className="w-6 h-6 text-primary-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">
                    Waktu Keberangkatan
                  </h4>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Paket ini dijadwalkan berangkat pada{" "}
                    <span className="font-bold text-primary-500">
                      {getWaktuLabel(pkg.departureScore)}
                    </span>{" "}
                    untuk pengalaman terbaik.
                  </p>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-card-bg border border-card-border flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">
                    Jaminan Layanan
                  </h4>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Kami menjamin layanan terbaik sesuai dengan standar
                    fasilitas skor{" "}
                    <span className="font-bold text-primary-500">
                      {pkg.facilityScore}/5
                    </span>{" "}
                    yang kami janjikan.
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
                    Harga Mulai Dari
                  </p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary-500">
                      {formatPrice(pkg.price)}
                    </h2>
                    <span className="text-sm text-foreground-secondary mb-1">
                      / Orang
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
                      Deposit Minimum
                    </span>
                    <span className="font-bold text-foreground">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      Ketersediaan
                    </span>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Tersedia
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link 
                    href={`/paket/${pkg.slug}/booking`}
                    className="w-full py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 group"
                  >
                    Pesan Sekarang
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="w-full py-4 rounded-xl border border-card-border bg-foreground/2 text-foreground font-bold hover:bg-foreground/5 transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Tanya Lewat WhatsApp
                  </button>
                </div>

                <p className="text-[10px] text-center text-foreground-secondary leading-relaxed">
                  *Harga dapat berubah sewaktu-waktu tergantung musim dan
                  ketersediaan kuota.
                </p>
              </div>

              {/* Help Card */}
              <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex items-center gap-4 group cursor-pointer hover:bg-primary-500/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    Butuh Bantuan?
                  </h4>
                  <p className="text-xs text-foreground-secondary">
                    Hubungi konsultan travel kami
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground-secondary ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
