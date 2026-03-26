"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon, Plane, TrendingUp, RefreshCw, LogOut, User as UserIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLocale } from "@/lib/LocaleContext";
import type { Locale } from "@/lib/translations";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [rate, setRate] = useState<number | null>(null);
    const [rateLoading, setRateLoading] = useState(true);
    const { theme, toggleTheme } = useTheme();
    const { locale, setLocale, t } = useLocale();
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [hoveredAuth, setHoveredAuth] = useState<"login" | "register" | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const response = await fetch("https://open.er-api.com/v6/latest/USD");
                const data = await response.json();
                setRate(data.rates.IDR);
            } catch (err) {
                console.error("Failed to fetch exchange rate", err);
            } finally {
                setRateLoading(false);
            }
        };
        fetchRate();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                const data = await res.json();
                if (data.user) setUser(data.user);
            } catch (err) {
                console.error("Session check failed", err);
            }
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            window.location.reload();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const handleLinkClick = () => {
        setIsMobileOpen(false);
    };

    const toggleLocale = () => {
        setLocale(locale === "id" ? "en" : "id");
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass-solid shadow-lg py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-sm bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span
                                className={`text-xl font-bold font-(family-name:--font-playfair) ${isScrolled ? "text-foreground" : "text-white"
                                    }`}
                            >
                                Titan
                            </span>
                            <span className="text-xl font-bold text-accent-500"> Travel</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {t.navbar.links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 ${isScrolled
                                        ? "text-foreground-secondary hover:text-primary-500"
                                        : "text-white/80 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all duration-200 hover:bg-primary-500/10 ${isScrolled ? "text-foreground-secondary" : "text-white/80"
                                }`}
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLocale}
                            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${isScrolled
                                    ? "border-card-border text-foreground-secondary hover:border-primary-500 hover:text-primary-500"
                                    : "border-white/30 text-white/80 hover:border-white hover:text-white"
                                }`}
                            aria-label="Toggle language"
                        >
                            {(["id", "en"] as Locale[]).map((l) => (
                                <span
                                    key={l}
                                    className={`transition-opacity ${locale === l ? "opacity-100 font-bold" : "opacity-40"}`}
                                >
                                    {l.toUpperCase()}
                                </span>
                            ))}
                        </button>

                        {/* Exchange Rate Badge */}
                        {rateLoading ? (
                            <div className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border animate-pulse ${
                                isScrolled
                                    ? "bg-primary-500/5 border-primary-500/20 text-foreground-secondary"
                                    : "bg-white/10 border-white/20 text-white/70"
                            }`}>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                {locale === "id" ? "Memuat Kurs..." : "Loading Rate..."}
                            </div>
                        ) : rate ? (
                            <div className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border ${
                                isScrolled
                                    ? "bg-primary-500/5 border-primary-500/20 text-foreground-secondary"
                                    : "bg-white/10 border-white/20 text-white/70"
                            }`}>
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span className="opacity-70">USD</span>
                                <strong className={isScrolled ? "text-foreground" : "text-white"}>
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rate)}
                                </strong>
                            </div>
                        ) : null}

                        {/* Auth / CTA Section */}
                        {user ? (
                            <div className="hidden sm:flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${
                                    isScrolled ? "border-primary-500/20 text-foreground" : "border-white/20 text-white"
                                }`}>
                                    <UserIcon className="w-3.5 h-3.5 text-primary-500" />
                                    <span className="text-xs font-semibold truncate max-w-[80px]">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`p-2 rounded-full transition-colors hover:bg-red-500/10 text-red-500`}
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                                <a
                                    href="#kontak"
                                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03] ${
                                        isScrolled
                                            ? "bg-primary-500 text-white hover:bg-primary-600"
                                            : "bg-accent-500 text-white hover:bg-accent-600"
                                    }`}
                                >
                                    {t.navbar.cta}
                                </a>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center">
                                <div 
                                    className={`relative flex items-center p-1 rounded-full transition-all duration-300 ${isScrolled ? "bg-primary-500/5 border border-primary-500/10" : "bg-white/10 border border-white/20 backdrop-blur-md"}`}
                                    onMouseLeave={() => setHoveredAuth(null)}
                                >
                                    {/* Sliding Hover Background */}
                                    <div 
                                        className={`absolute top-1 bottom-1 w-20 rounded-full transition-all duration-300 ease-out-expo ${isScrolled ? "bg-primary-500/10" : "bg-white/20"}`}
                                        style={{
                                            left: hoveredAuth === "register" ? "84px" : "4px",
                                            opacity: hoveredAuth ? 1 : 0,
                                            transform: hoveredAuth ? "scale(1)" : "scale(0.8)"
                                        }}
                                    />
                                    <Link
                                        href="/login"
                                        onMouseEnter={() => setHoveredAuth("login")}
                                        className={`relative z-10 w-20 text-center py-1.5 text-xs font-bold rounded-full transition-colors ${
                                            isScrolled ? "text-foreground-secondary hover:text-primary-600" : "text-white/90 hover:text-white"
                                        }`}
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        onMouseEnter={() => setHoveredAuth("register")}
                                        className={`relative z-10 w-20 text-center py-1.5 text-xs font-bold rounded-full transition-all duration-300 shadow-sm ${
                                            isScrolled
                                                ? "bg-primary-500 text-white shadow-primary-500/20"
                                                : "bg-accent-500 text-white shadow-accent-500/20"
                                        } ${hoveredAuth === "register" ? "scale-105" : "scale-100"}`}
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className={`lg:hidden p-2 rounded-sm transition-colors ${isScrolled ? "text-foreground" : "text-white"
                                }`}
                            aria-label="Toggle menu"
                        >
                            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="glass-solid mt-2 mx-4 rounded-md p-4 shadow-xl border border-card-border">
                    {t.navbar.links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleLinkClick}
                            className="block px-4 py-3 rounded-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 font-medium transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    {user ? (
                        <div className="mt-3 pt-3 border-t border-card-border flex gap-2">
                            <button
                                onClick={toggleLocale}
                                className="px-3 py-2.5 rounded-sm border border-card-border text-foreground-secondary text-xs font-bold hover:border-primary-500 hover:text-primary-500 transition-colors"
                            >
                                {locale === "id" ? "ID" : "EN"}
                            </button>
                            <a
                                href="#kontak"
                                onClick={handleLinkClick}
                                className="flex-1 inline-flex items-center justify-center py-2.5 rounded-sm bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                            >
                                {t.navbar.cta}
                            </a>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2.5 rounded-sm border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-3 pt-3 border-t border-card-border flex gap-2">
                            <button
                                onClick={toggleLocale}
                                className="px-3 py-2.5 rounded-sm border border-card-border text-foreground-secondary text-xs font-bold hover:border-primary-500 hover:text-primary-500 transition-colors"
                            >
                                {locale === "id" ? "ID" : "EN"}
                            </button>
                            <Link
                                href="/login"
                                onClick={handleLinkClick}
                                className="flex-1 inline-flex items-center justify-center py-2.5 rounded-sm border border-card-border text-foreground-secondary text-sm font-semibold hover:border-primary-500 hover:text-primary-500 transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                onClick={handleLinkClick}
                                className="flex-1 inline-flex items-center justify-center py-2.5 rounded-sm bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
