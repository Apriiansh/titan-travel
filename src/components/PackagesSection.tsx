"use client";

import { Clock, MapPin, Star, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/lib/LocaleContext";

const images = [
    "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1585435465945-bef5a93f8849?auto=format&fit=crop&w=800&q=80",
];

const prices = [
    { price: "Rp 8.500.000", originalPrice: "Rp 10.000.000", rating: 4.9, reviews: 128 },
    { price: "Rp 4.200.000", originalPrice: "Rp 5.500.000", rating: 4.8, reviews: 256 },
    { price: "Rp 18.900.000", originalPrice: "Rp 22.000.000", rating: 4.9, reviews: 89 },
    { price: "Rp 6.800.000", originalPrice: "Rp 8.200.000", rating: 4.8, reviews: 174 },
    { price: "Rp 25.000.000", originalPrice: "Rp 30.000.000", rating: 5.0, reviews: 67 },
    { price: "Rp 32.000.000", originalPrice: "Rp 38.000.000", rating: 4.9, reviews: 312 },
];

export default function PackagesSection() {
    const { t } = useLocale();
    const p = t.packages;

    return (
        <section id="paket" className="section-padding bg-background relative overflow-hidden">
            {/* Abstract Decorative */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-600 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                        {p.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
                        {p.title1} <span className="gradient-text">{p.title2}</span>
                    </h2>
                    <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        {p.subtitle}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {p.items.map((pkg, i) => (
                        <div
                            key={pkg.title}
                            className="group rounded-md overflow-hidden bg-card-bg border border-card-border hover:border-primary-500/20 hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image */}
                            <div className="relative h-44 sm:h-52 overflow-hidden">
                                <Image
                                    src={images[i]}
                                    alt={pkg.title}
                                    width={800}
                                    height={533}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                {/* Tag */}
                                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-full bg-primary-500 text-white text-[10px] sm:text-xs font-bold shadow-lg">
                                    {pkg.tag}
                                </span>
                                {/* Price Badge */}
                                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-right">
                                    <span className="block text-white/60 text-[10px] sm:text-xs line-through">
                                        {prices[i].originalPrice}
                                    </span>
                                    <span className="block text-white text-sm sm:text-lg font-bold">{prices[i].price}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                                    <Star className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                                    <span className="text-xs sm:text-sm font-semibold text-foreground">{prices[i].rating}</span>
                                    <span className="text-[10px] sm:text-sm text-foreground-secondary">({prices[i].reviews} review)</span>
                                </div>

                                <h3 className="text-sm sm:text-lg font-bold text-foreground font-(family-name:--font-playfair) mb-1.5 sm:mb-2 group-hover:text-primary-500 transition-colors">
                                    {pkg.title}
                                </h3>

                                <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-sm text-foreground-secondary mb-3 sm:mb-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        {pkg.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        {pkg.duration}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-card-border">
                                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-foreground-secondary">
                                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        {pkg.capacity}
                                    </span>
                                    <button className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors group/btn">
                                        {p.detail}
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8 sm:mt-12">
                    <a href="#" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                        {p.viewAll}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
