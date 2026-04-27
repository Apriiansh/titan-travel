"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Plane,
    Globe,
    Building2,
    Users,
    GraduationCap,
} from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";

const icons = [Globe, Plane, Globe, Building2, Users, GraduationCap];

export default function ServicesSection({ data }: { data?: any }) {
    const { dObj } = useLocale();
    // Localize the whole settings object first
    const s = dObj(data);

    return (
        <section id="layanan" className="section-padding bg-background-secondary relative overflow-hidden">
            {/* Abstract Decorative */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />

            {/* Abstract geometric lines */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                        {s.badge || "Our Services"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
                        {s.title1 || "Complete Travel"}{" "}
                        <span className="gradient-text">{s.title2 || "Solutions"}</span>
                    </h2>
                    <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        {s.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
                    {s.items && Array.isArray(s.items) && s.items.map((service: any, i: number) => {
                        const Icon = icons[i % icons.length];
                        return (
                            <div
                                key={i}
                                className="group relative rounded-md overflow-hidden border border-card-border bg-card-bg p-5 sm:p-6 hover:border-primary-500/30 transition-all duration-500 hover:shadow-xl"
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-linear-to-br from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Abstract corner accent */}
                                <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-primary-500/5 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
                                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-accent-500/5 group-hover:bg-white/5 transition-colors duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-primary-500/10 group-hover:bg-white/20 flex items-center justify-center mb-4 sm:mb-5 transition-all duration-500">
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 group-hover:text-white transition-colors duration-500" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground group-hover:text-white font-(family-name:--font-playfair) mb-2 sm:mb-3 transition-colors duration-500">
                                        {service.title}
                                    </h3>
                                    <p className="text-foreground-secondary group-hover:text-white/85 text-xs sm:text-sm leading-relaxed transition-colors duration-500">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
