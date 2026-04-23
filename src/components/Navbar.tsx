"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Sun,
  Moon,
  TrendingUp,
  RefreshCw,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLocale } from "@/lib/LocaleContext";
import type { Locale } from "@/lib/translations";

export default function Navbar({ data }: { data?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, dObj } = useLocale();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [hoveredAuth, setHoveredAuth] = useState<"login" | "register" | null>(
    null,
  );

  // Localize the whole settings object first
  const d = dObj(data) || {};

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const resData = await response.json();
        setRate(resData.rates.IDR);
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
        const sessionData = await res.json();
        if (sessionData.user) setUser(sessionData.user);
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-solid shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo_black.png"
              alt="Titan Travel"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain transform group-hover:scale-110 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {d.links &&
              Array.isArray(d.links) &&
              d.links.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 ${
                    isScrolled
                      ? "text-foreground-secondary hover:text-primary-500"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
          </div>

          {/* Exchange Rate Badge */}
          {rateLoading ? (
            <div
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border animate-pulse ${
                isScrolled
                  ? "bg-primary-500/5 border-primary-500/20 text-foreground-secondary"
                  : "bg-white/10 border-white/20 text-white/70"
              }`}
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              {locale === "id" ? "Memuat Kurs..." : "Loading Rate..."}
            </div>
          ) : rate ? (
            <div
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border ${
                isScrolled
                  ? "bg-primary-500/5 border-primary-500/20 text-foreground-secondary"
                  : "bg-white/10 border-white/20 text-white/70"
              }`}
            >
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="opacity-70">USD</span>
              <strong className={isScrolled ? "text-foreground" : "text-white"}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(rate)}
              </strong>
            </div>
          ) : null}

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:bg-primary-500/10 ${
                isScrolled ? "text-foreground-secondary" : "text-white/80"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* PERBAIKAN: Language Toggle - Tampil di HP & Klik Langsung (Direct Select) */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border transition-all duration-200 ${
                isScrolled
                  ? "border-card-border text-foreground-secondary"
                  : "border-white/30 text-white"
              }`}
            >
              {(["id", "en", "ms"] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`transition-all duration-200 ${
                    locale === l
                      ? isScrolled
                        ? "opacity-100 text-primary-500 scale-110"
                        : "opacity-100 text-white scale-110 drop-shadow-md"
                      : "opacity-40 hover:opacity-80"
                  }`}
                  aria-label={`Ubah bahasa ke ${l.toUpperCase()}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Auth / CTA Section */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="relative group">
                  <div
                    className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                      isScrolled
                        ? "bg-primary-500/5 border-primary-500/20 text-foreground hover:bg-primary-500/10"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-xs font-semibold truncate max-w-[80px]">
                      {user.name}
                    </span>
                  </div>

                  <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                    <div className="w-48 py-2 rounded-xl shadow-xl bg-card-bg border border-card-border flex flex-col backdrop-blur-lg">
                      <div className="px-4 py-2 border-b border-card-border mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-foreground-secondary truncate capitalize">
                          {user.role.toLowerCase()}
                        </p>
                      </div>
                      {(user.role === "ADMIN" || user.role === "MANAGER") && (
                        <Link
                          href={user.role === "ADMIN" ? "/admin" : "/manager"}
                          className="px-4 py-2 text-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 transition-colors flex items-center gap-2"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Dashboard Panel
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        className="px-4 py-2 text-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 transition-colors flex items-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Pesanan Saya
                      </Link>
                      <div className="h-px bg-card-border my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 rounded-b-xl"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03] ${
                    isScrolled
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-accent-500 text-white hover:bg-accent-600"
                  }`}
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center">
                <div
                  className={`relative flex items-center p-1 rounded-full transition-all duration-300 ${isScrolled ? "bg-primary-500/5 border border-primary-500/10" : "bg-white/10 border border-white/20 backdrop-blur-md"}`}
                  onMouseLeave={() => setHoveredAuth(null)}
                >
                  {/* Sliding Hover Background */}
                  <div
                    className={`absolute top-1 bottom-1 w-20 rounded-full transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-md ${
                      isScrolled
                        ? "bg-primary-500 shadow-primary-500/20"
                        : "bg-accent-500 shadow-accent-500/20"
                    }`}
                    style={{
                      left: hoveredAuth === "login" ? "4px" : "84px",
                    }}
                  />
                  <Link
                    href="/login"
                    onMouseEnter={() => setHoveredAuth("login")}
                    className={`relative z-10 w-20 text-center py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                      hoveredAuth === "login"
                        ? "text-white"
                        : isScrolled
                          ? "text-foreground-secondary hover:text-primary-500"
                          : "text-white/80 hover:text-white"
                    }`}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onMouseEnter={() => setHoveredAuth("register")}
                    className={`relative z-10 w-20 text-center py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                      hoveredAuth === "register" || !hoveredAuth
                        ? "text-white"
                        : isScrolled
                          ? "text-foreground-secondary hover:text-primary-500"
                          : "text-white/80 hover:text-white"
                    } ${hoveredAuth === "register" || !hoveredAuth ? "scale-105" : "scale-100"}`}
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`lg:hidden p-1.5 sm:p-2 rounded-sm transition-colors ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-solid mt-2 mx-4 rounded-md p-4 shadow-xl border border-card-border">
          {d.links &&
            Array.isArray(d.links) &&
            d.links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href}
                onClick={handleLinkClick}
                className="block px-4 py-3 rounded-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          {user ? (
            <div className="mt-3 pt-3 border-t border-card-border flex flex-col gap-1">
              <div className="px-3 pb-2 mb-2 border-b border-card-border">
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-foreground-secondary capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>

              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/manager"}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 rounded-sm transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard Panel
                </Link>
              )}
              <Link
                href="/my-trips"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 rounded-sm transition-colors"
              >
                Perjalanan Saya
              </Link>
              <Link
                href="/history"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:text-primary-500 hover:bg-primary-500/5 rounded-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Riwayat
              </Link>

              {/* PERBAIKAN: Tombol bahasa duplikat di menu mobile dihapus agar tidak rancu */}
              <div className="flex gap-2 mt-2 pt-2 border-t border-card-border">
                <a
                  href="#kontak"
                  onClick={handleLinkClick}
                  className="flex-1 inline-flex items-center justify-center py-2.5 rounded-sm bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                >
                  {d.cta || "Pesan Sekarang"}
                </a>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2.5 rounded-sm border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 pt-3 border-t border-card-border flex gap-2">
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
