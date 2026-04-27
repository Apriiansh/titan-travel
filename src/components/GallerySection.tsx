"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { useLocale } from "@/lib/LocaleContext";

export default function GallerySection({ dbData, settingsData }: { dbData?: any[], settingsData?: any }) {
    const [lightbox, setLightbox] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    
    const { dt, dObj } = useLocale();
    const g = dObj(settingsData) || {};
    const gallery = dbData || [];

    const navigateLightbox = (direction: "prev" | "next") => {
        if (lightbox === null) return;
        if (direction === "prev") {
            setLightbox(lightbox > 0 ? lightbox - 1 : gallery.length - 1);
        } else {
            setLightbox(lightbox < gallery.length - 1 ? lightbox + 1 : 0);
        }
    };

    // Fungsi klik cerdas (mendukung layar sentuh/HP)
    const handleCardClick = (index: number) => {
        // Jika kartu sudah terbuka, klik lagi untuk buka lightbox
        if (activeIndex === index) {
            setLightbox(index);
        } else {
            // Jika kartu belum terbuka, klik untuk memperlebar
            setActiveIndex(index);
        }
    };

    if (!gallery || gallery.length === 0) return null;

    return (
        <section id="galeri" className="section-padding bg-background relative overflow-hidden">
            {/* Abstract Decorative */}
            <div className="absolute -bottom-20 right-1/4 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-600 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                        {g.badge || "Gallery"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
                        {g.title1 || "Precious"}{" "}
                        <span className="gradient-text">{g.title2 || "Moments"}</span>
                    </h2>
                    <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        {g.subtitle}
                    </p>
                </div>

                {/* PERBAIKAN MOBILE: 
                  Gunakan flex-col (Vertikal) untuk HP, dan md:flex-row (Horizontal) untuk Desktop.
                  Tinggi juga disesuaikan agar lebih proporsional di HP.
                */}
                <div className="flex flex-col md:flex-row w-full h-125 sm:h-150 md:h-125 gap-2 sm:gap-4">
                    {gallery.map((item: any, index: number) => {
                        const isActive = activeIndex === index;

                        return (
                            <div
                                key={item.id || index}
                                onMouseEnter={() => setActiveIndex(index)} // Tetap expand saat di-hover (untuk PC)
                                onClick={() => handleCardClick(index)}     // Tap logic (untuk HP & klik PC)
                                style={{ flex: isActive ? 5 : 1 }}
                                className="group relative rounded-xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out"
                            >
                                <SafeImage
                                    src={item.imageUrl || "/placeholder.jpg"}
                                    alt={dt(item.title || "Gallery Image")}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                    className={`object-cover transition-transform duration-700 ${
                                        isActive ? "scale-100" : "scale-110"
                                    }`}
                                />

                                {/* Dark Overlay Gradient */}
                                <div 
                                    className={`absolute inset-0 transition-all duration-700 ${
                                        isActive 
                                            ? "bg-linear-to-t from-black/90 via-black/30 to-transparent" 
                                            : "bg-black/50 hover:bg-black/40"
                                    }`} 
                                />

                                {/* Konten Kartu */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden">
                                    {/* Teks Vertikal di PC / Teks Tengah di HP (Saat kartu menyempit) */}
                                    <div 
                                        className={`absolute inset-0 flex items-end md:items-center justify-center pb-6 md:pb-0 transition-all duration-300 ${
                                            isActive ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100 delay-150"
                                        }`}
                                    >
                                        <h3 className="text-white font-bold text-xs sm:text-sm md:text-xl tracking-widest px-2 text-center whitespace-nowrap transform md:-rotate-90 uppercase drop-shadow-md">
                                            {dt(item.title || "Nama")}
                                        </h3>
                                    </div>

                                    {/* Teks Horizontal (Saat kartu melebar) */}
                                    <div 
                                        className={`absolute bottom-0 left-0 p-4 md:p-8 w-full flex flex-col justify-end transition-all duration-500 transform ${
                                            isActive ? "opacity-100 translate-y-0 delay-150" : "opacity-0 translate-y-6 pointer-events-none"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                            <span className="w-4 md:w-8 h-1 md:h-1.5 bg-accent-500 rounded-full inline-block"></span>
                                            <span className="text-accent-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                                {dt(item.category || "Lokasi")}
                                            </span>
                                        </div>
                                        <h3 className="text-white text-lg md:text-3xl font-bold font-(family-name:--font-playfair)">
                                            {dt(item.title || "Nama")}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox Modal (Full Screen) */}
            {lightbox !== null && gallery[lightbox] && (
                <div
                    className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

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

                    <SafeImage
                        src={gallery[lightbox].imageUrl || "/placeholder.jpg"}
                        alt={dt(gallery[lightbox].title || "Gambar Terpilih")}
                        width={1600}
                        height={1067}
                        sizes="90vw"
                        priority
                        className="max-w-[90vw] sm:max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-md"
                    />
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-4">
                        <h3 className="text-white text-base sm:text-2xl font-bold font-(family-name:--font-playfair)">
                            {dt(gallery[lightbox].title || "Nama")}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm mt-1">
                            {dt(gallery[lightbox].category || "Lokasi")}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}