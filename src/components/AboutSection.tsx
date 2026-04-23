"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Award, Globe, Heart, Shield } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/lib/LocaleContext";

const icons = [Shield, Globe, Heart, Award];

const FALLBACK_IMAGES = {
  main: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  secondary: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=400&q=80",
};

export default function AboutSection({ data }: { data?: any }) {
    const { dObj } = useLocale();
    const a = dObj(data);

    // Use the uploaded image from CMS, or fall back to Unsplash
    const mainImage = a.imageUrl || FALLBACK_IMAGES.main;

    return (
        <section id="tentang" className="section-padding bg-background relative overflow-hidden">
            {/* Decorative blurs */}
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section badge */}
                <div className="mb-6 sm:mb-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs sm:text-sm font-semibold">
                        {a.badge || "About Us"}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4
                    grid-rows-[auto]
                    md:grid-rows-[220px_160px_130px]">

                    {/* ── A: TEXT block (col-span-2, row-span-2) ── */}
                    <div className="col-span-2 md:row-span-2 flex flex-col justify-center p-5 sm:p-7 rounded-md bg-background-secondary border border-card-border">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-(family-name:--font-playfair) text-foreground leading-tight mb-3 sm:mb-5">
                            {a.title1 || "Titan Jaya"}<br />
                            <span className="gradient-text">{a.title2 || "Travelindo"}</span>
                        </h2>
                        <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed mb-3">
                            {a.desc1}
                        </p>
                        <p className="text-foreground-secondary text-sm leading-relaxed">
                            {a.desc2}
                        </p>
                    </div>

                    {/* ── B: Main image from CMS (col-span-2) ── */}
                    <div className="col-span-2 relative rounded-md overflow-hidden shadow-xl">
                        <Image
                            src={mainImage}
                            alt={a.title1 || "About Titan Travel"}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* ── C: yearsCard accent block (col-span-1) ── */}
                    <div className="col-span-1 rounded-md bg-linear-to-br from-primary-500 to-primary-700 p-4 sm:p-5 flex flex-col justify-center text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-md bg-white/10 pointer-events-none" />
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-md bg-white/5 pointer-events-none" />
                        <span className="relative text-4xl sm:text-5xl font-bold font-(family-name:--font-playfair)">10+</span>
                        <span className="relative text-white/80 text-xs sm:text-sm mt-1 leading-snug">
                            {a.yearsCard || "Years Serving Travelers"}
                        </span>
                    </div>

                    {/* ── D: Secondary image (col-span-1) ── */}
                    <div className="col-span-1 relative rounded-md overflow-hidden shadow-xl">
                        <Image
                            src={FALLBACK_IMAGES.secondary}
                            alt="Travel destination"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* ── E–H: Highlight cards (each col-span-1) ── */}
                    {a.highlights && Array.isArray(a.highlights) && a.highlights.map((item: any, i: number) => {
                        const Icon = icons[i % icons.length];
                        return (
                            <div
                                key={i}
                                className="col-span-1 group flex flex-col gap-2 p-4 rounded-md bg-background-secondary border border-card-border hover:border-primary-500/30 hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-5 h-5 rounded-md bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors">
                                    <Icon className="w-3 h-3 text-primary-500" />
                                </div>
                                <h4 className="font-semibold text-foreground text-xs sm:text-sm">{item.title}</h4>
                                <p className="text-foreground-secondary text-[11px] sm:text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
