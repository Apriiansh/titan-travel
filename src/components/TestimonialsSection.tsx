"use client";

import { Star, Quote } from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";

export default function TestimonialsSection() {
    const { t } = useLocale();
    const tm = t.testimonials;

    return (
        <section className="section-padding bg-background-secondary relative overflow-hidden">
            {/* Abstract Decorative */}
            <div className="absolute top-1/2 left-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-primary-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                        {tm.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
                        {tm.title1} <span className="gradient-text">{tm.title2}</span>
                    </h2>
                    <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        {tm.subtitle}
                    </p>
                </div>

                {/* Testimonial Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {tm.items.map((item) => (
                        <div
                            key={item.name}
                            className="group relative p-5 sm:p-6 rounded-md border border-card-border bg-card-bg hover:border-primary-500/20 hover:shadow-xl transition-all duration-500"
                        >
                            {/* Abstract corner */}
                            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-primary-500/5 pointer-events-none" />

                            {/* Quote icon */}
                            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500/15 mb-3 sm:mb-4" />

                            {/* Stars */}
                            <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                                {Array.from({ length: item.rating }).map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500 fill-accent-500" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                                &ldquo;{item.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-card-border">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-xs sm:text-sm">{item.name}</h4>
                                    <p className="text-foreground-secondary text-[10px] sm:text-xs">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
