"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowRight, MapPin, Plane, Star, Users } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/lib/LocaleContext";

const ICONS = [Star, Users, MapPin, Star];

const FALLBACK_BG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80";

export default function HeroSection({ data }: { data?: any }) {
  const { locale } = useLocale();

  // Pick locale object directly — dt() is for string fields only
  const raw = data as Record<string, any> | null;
  const h: Record<string, any> = raw?.[locale] ?? raw?.["en"] ?? raw?.["id"] ?? {};

  const bgImage: string = h.imageUrl || FALLBACK_BG;
  const stats: { value: string; label: string }[] = Array.isArray(h.stats) ? h.stats : [];

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Beautiful tropical beach destination"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-neutral-950/80 via-neutral-900/60 to-neutral-950/90" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Abstract Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 sm:w-96 sm:h-96 rounded-md bg-primary-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 right-10 w-48 h-48 sm:w-72 sm:h-72 rounded-md bg-primary-300/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-md bg-primary-400/8 blur-2xl pointer-events-none animate-float" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 fill-accent-400" />
          {h.badge || "Trusted Since 2013"}
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up delay-100 font-(family-name:--font-playfair) text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
          {h.title1 || "Explore the World"}
          <br />
          <span className="bg-linear-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
            {h.title2 || "With Titan Travel"}
          </span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up delay-200 text-sm sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          {h.subtitle || "Specialist Umroh, Corporate Gathering, Family Trip, Domestik & Internasional."}
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#paket"
            className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            {h.cta1 || "View Tour Packages"}
          </a>
          <a
            href="#kontak"
            className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 sm:w-auto justify-center"
          >
            {h.cta2 || "Contact Us"}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>

        {/* Stats — rendered from hero CMS data */}
        {stats.length > 0 && (
          <div className="animate-fade-in-up delay-500 mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={i}
                  className="p-3 sm:p-4 rounded-md bg-white/10 backdrop-blur-md border border-white/10"
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-400" />
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-(family-name:--font-playfair)">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-tight block">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
        <Plane className="w-6 h-6 text-white/40 rotate-135" />
      </div>
    </section>
  );
}
