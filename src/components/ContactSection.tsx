"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
} from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";

const contactIcons = [Phone, MessageCircle, MapPin, Clock];

export default function ContactSection({ data, packages = [] }: { data?: any, packages?: any[] }) {
    const { dt, dObj } = useLocale();
    // Localize the whole settings object first
    const c = dObj(data);

    return (
        <section id="kontak" className="section-padding bg-background-secondary relative overflow-hidden">
            {/* Abstract Decorative */}
            <div className="absolute -top-24 -left-24 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />

            {/* Abstract dots pattern */}
            <svg className="absolute bottom-0 right-0 w-48 h-48 sm:w-80 sm:h-80 pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="dots-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots-pattern)" />
            </svg>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                        {c.badge || "Contact"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-foreground mb-3 sm:mb-4">
                        {c.title1 || "Ready to"}{" "}
                        <span className="gradient-text">{c.title2 || "Adventure?"}</span>
                    </h2>
                    <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        {c.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-3 p-5 sm:p-8 rounded-md border border-card-border bg-card-bg shadow-sm">
                        <h3 className="text-lg sm:text-xl font-bold font-(family-name:--font-playfair) text-foreground mb-4 sm:mb-6">
                            {c.formTitle || "Send us a message"}
                        </h3>
                        <form className="space-y-4 sm:space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                                        {c.labelName || "Full Name"}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-sm border border-card-border bg-background text-foreground placeholder-foreground-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                                        {c.labelPhone || "WhatsApp Number"}
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="0812-xxxx-xxxx"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-sm border border-card-border bg-background text-foreground placeholder-foreground-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                                    {c.labelEmail || "Email Address"}
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@email.com"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-sm border border-card-border bg-background text-foreground placeholder-foreground-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                                    {c.labelDestination || "Destination of Interest"}
                                </label>
                                <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-sm border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
                                    <option value="">{c.placeholderDestination || "Select destination..."}</option>
                                    {/* Map from packages table for truly dynamic experience */}
                                    {packages && packages.length > 0 ? (
                                        packages.map((pkg: any) => (
                                            <option key={pkg.id} value={pkg.slug}>{dt(pkg.title)}</option>
                                        ))
                                    ) : (
                                        c.destinationOptions && Array.isArray(c.destinationOptions) && c.destinationOptions.map((opt: any) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                                    {c.labelMessage || "Message"}
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder={c.placeholderMessage || "Tell us about your travel plans..."}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-sm border border-card-border bg-background text-foreground placeholder-foreground-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all resize-none"
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full justify-center py-3 sm:py-4 text-sm sm:text-base">
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                {c.submit || "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        {c.contactInfo && Array.isArray(c.contactInfo) && c.contactInfo.map((info: any, i: number) => {
                            const Icon = contactIcons[i % contactIcons.length];
                            return (
                                <div
                                    key={i}
                                    className="group p-4 sm:p-5 rounded-md border border-card-border bg-card-bg hover:border-primary-500/20 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-primary-500/10 group-hover:bg-primary-500/15 flex items-center justify-center shrink-0 transition-colors">
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-0.5">{info.title}</h4>
                                            {info.details && Array.isArray(info.details) && info.details.map((detail: any, j: number) =>
                                                "link" in info && info.link ? (
                                                    <a
                                                        key={j}
                                                        href={info.link as string}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-xs sm:text-sm text-primary-500 hover:underline"
                                                    >
                                                        {detail}
                                                    </a>
                                                ) : (
                                                    <p key={j} className="text-xs sm:text-sm text-foreground-secondary">
                                                        {detail}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* WhatsApp CTA */}
                        <a
                            href="https://wa.me/6285268111110?text=Halo%20Titan%20Travel%2C%20saya%20ingin%20bertanya%20tentang%20paket%20wisata"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-4 rounded-md bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            {c.whatsappCta || "Chat WhatsApp"}
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://instagram.com/titan.travel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-4 rounded-md bg-linear-to-r from-primary-500 to-primary-700 text-white font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            @titan.travel · 32.1K Followers
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
