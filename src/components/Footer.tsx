"use client";

import { Plane, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";

export default function Footer() {
    const { t } = useLocale();
    const f = t.footer;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-neutral-900 text-neutral-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <a href="#beranda" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-sm bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Plane className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white font-(family-name:--font-playfair)">
                                    Titan
                                </span>
                                <span className="text-xl font-bold text-accent-500"> Travel</span>
                            </div>
                        </a>
                        <p className="text-sm leading-relaxed text-neutral-400 mb-5">
                            {f.brandDesc}
                        </p>
                        <div className="flex items-center gap-3">
                            {/* Social Icons */}
                            <a
                                href="https://instagram.com/titan.travel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/6285268111110"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-emerald-500 flex items-center justify-center transition-colors"
                                aria-label="WhatsApp"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:info@titantravel.co.id"
                                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-accent-500 flex items-center justify-center transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-(family-name:--font-playfair)">
                            {f.menuTitle}
                        </h4>
                        <ul className="space-y-2">
                            {f.quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-(family-name:--font-playfair)">
                            {f.servicesTitle}
                        </h4>
                        <ul className="space-y-2">
                            {f.services.map((service) => (
                                <li key={service}>
                                    <span className="text-sm text-neutral-400 hover:text-primary-400 transition-colors cursor-pointer">
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-(family-name:--font-playfair)">
                            {f.contactTitle}
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-neutral-400">
                                <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                                <span>Jl. Musi Raya No. 42, Sialang, Kec. Sako, Palembang 30161</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-400">
                                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                                <span>0852-6811-1110</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-400">
                                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                                <span>0852-6884-4491</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-neutral-500">
                        © 2013 — {new Date().getFullYear()} {f.copyright}
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
