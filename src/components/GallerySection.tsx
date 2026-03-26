"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/lib/LocaleContext";

const images = [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80",
];

// Items that span 2 cols on md+
const isSpan2 = (index: number) => index === 0 || index === 5 || index === 6 || index === 7;

export default function GallerySection() {
    const [lightbox, setLightbox] = useState<number | null>(null);
    const { t } = useLocale();
    const g = t.gallery;

    const navigateLightbox = (direction: "prev" | "next") => {
        if (lightbox === null) return;
        if (direction === "prev") {
            setLightbox(lightbox > 0 ? lightbox - 1 : g.items.length - 1);
        } else {
            setLightbox(lightbox < g.items.length - 1 ? lightbox + 1 : 0);
        }
    };

    return (
        <section id="galeri" className="section-padding bg-background relative overflow-hidden">
            {/* Abstract Decorative */}
            <div className="absolute -bottom-20 right-1/4 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-600 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                        {g.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
                        {g.title1} <span className="gradient-text">{g.title2}</span>
                    </h2>
                    <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        {g.subtitle}
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px]">
                    {g.items.map((item, index) => (
                        <div
                            key={item.title}
                            className={`group relative rounded-md overflow-hidden cursor-pointer ${isSpan2(index) ? "md:col-span-2" : ""
                                }`}
                            onClick={() => setLightbox(index)}
                        >
                            <Image
                                src={images[index]}
                                alt={item.title}
                                width={800}
                                height={533}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-primary-950/70 via-primary-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-4 md:p-5">
                                <span className="text-accent-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
                                    {item.category}
                                </span>
                                <h3 className="text-white text-sm sm:text-base md:text-lg font-bold font-(family-name:--font-playfair)">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Nav Arrows */}
                    <button
                        onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
                        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
                        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <Image
                        src={images[lightbox].replace("w=800", "w=1600")}
                        alt={g.items[lightbox].title}
                        width={1600}
                        height={1067}
                        className="max-w-[90vw] sm:max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-md"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-center">
                        <h3 className="text-white text-base sm:text-xl font-bold font-(family-name:--font-playfair)">
                            {g.items[lightbox].title}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm mt-1">{g.items[lightbox].category}</p>
                    </div>
                </div>
            )}
        </section>
    );
}
