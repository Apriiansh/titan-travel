"use client";

import { ArrowRight, MapPin, Plane, Star, Users } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/lib/LocaleContext";

export default function HeroSection() {
    const { t } = useLocale();
    const h = t.hero;
    const icons = [Star, Users, MapPin, Star];

    return (
        <section
            id="beranda"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
                    alt="Beautiful tropical beach destination"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-primary-950/70 via-primary-950/50 to-primary-950/80" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
            </div>

            {/* Abstract Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 sm:w-96 sm:h-96 rounded-md bg-primary-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-32 right-10 w-48 h-48 sm:w-72 sm:h-72 rounded-md bg-accent-500/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-md bg-primary-400/5 blur-2xl pointer-events-none animate-float" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
                {/* Badge */}
                <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500 fill-accent-500" />
                    {h.badge}
                </div>

                {/* Heading */}
                <h1 className="animate-fade-in-up delay-100 font-(family-name:--font-playfair) text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
                    {h.title1}
                    <br />
                    <span className="bg-linear-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                        {h.title2}
                    </span>
                </h1>

                {/* Subheading */}
                <p className="animate-fade-in-up delay-200 text-sm sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                    {h.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <a href="#paket" className="btn-accent text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        {h.cta1}
                    </a>
                    <a href="#kontak" className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 border-white/30 text-white hover:border-white hover:text-white w-full sm:w-auto justify-center">
                        {h.cta2}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>

                {/* Stats */}
                <div className="animate-fade-in-up delay-500 mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto">
                    {h.stats.map((stat, i) => {
                        const Icon = icons[i];
                        return (
                            <div
                                key={stat.label}
                                className="p-3 sm:p-4 rounded-sm sm:rounded-md bg-white/10 backdrop-blur-md border border-white/10"
                            >
                                <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-400" />
                                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-(family-name:--font-playfair)">
                                        {stat.value}
                                    </span>
                                </div>
                                <span className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-tight block">{stat.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
                <Plane className="w-6 h-6 text-primary-900/60 rotate-[135deg]" />
            </div>
        </section>
    );
}
