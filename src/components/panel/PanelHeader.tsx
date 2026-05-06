"use client"

import { useState, useRef, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Home, Package, CheckSquare, BarChart, TrendingUp, 
  ImageIcon, FileText, MessageCircle, Users,
  Landmark, Compass, Activity, ChevronRight,
  ChevronDown, Sun, Moon, UserCircle, LogOut, Globe
} from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { useLocale } from "@/lib/LocaleContext"
import { translations } from "@/lib/translations"
import type { Locale } from "@/lib/LocaleContext"

const BREADCRUMB_MAP: Record<string, { label: string; icon: typeof Home; color: string }> = {
  "/admin": { label: "Dashboard", icon: Home, color: "text-blue-500" },
  "/admin/stats": { label: "Statistik", icon: BarChart, color: "text-violet-500" },
  "/admin/topsis": { label: "Analisis TOPSIS", icon: TrendingUp, color: "text-cyan-500" },
  "/admin/bookings": { label: "Booking", icon: CheckSquare, color: "text-emerald-500" },
  "/admin/packages": { label: "Paket Wisata", icon: Package, color: "text-amber-500" },
  "/admin/content/hero": { label: "Hero Banner", icon: ImageIcon, color: "text-pink-500" },
  "/admin/content/about": { label: "Tentang Kami", icon: FileText, color: "text-orange-500" },
  "/admin/content/services": { label: "Layanan", icon: Compass, color: "text-sky-500" },
  "/admin/content/testimonials": { label: "Testimoni", icon: MessageCircle, color: "text-teal-500" },
  "/admin/content/gallery": { label: "Galeri", icon: ImageIcon, color: "text-pink-500" },
  "/admin/settings/contact": { label: "Info Kontak", icon: MessageCircle, color: "text-teal-500" },
  "/admin/settings/bank-accounts": { label: "Rekening Bank", icon: Landmark, color: "text-indigo-500" },
  "/admin/account": { label: "Akun Saya", icon: UserCircle, color: "text-primary-500" },
  "/admin/users": { label: "Pengguna", icon: Users, color: "text-rose-500" },
  "/manager": { label: "Dashboard", icon: Home, color: "text-blue-500" },
  "/manager/validation": { label: "Validasi", icon: CheckSquare, color: "text-emerald-500" },
  "/manager/activity": { label: "Aktivitas", icon: Activity, color: "text-purple-500" },
  "/manager/reports/bookings": { label: "Laporan Transaksi", icon: FileText, color: "text-orange-500" },
  "/manager/reports/topsis": { label: "Laporan TOPSIS", icon: TrendingUp, color: "text-cyan-500" },
  "/manager/account": { label: "Akun Saya", icon: UserCircle, color: "text-primary-500" },
}

function getGreeting(g: any): string {
  const hour = new Date().getHours();
  if (hour < 12) return g.morning;
  if (hour < 15) return g.afternoon;
  if (hour < 18) return g.evening;
  return g.night;
}

export function PanelHeader({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, dObj } = useLocale();
  const t = dObj(translations);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = BREADCRUMB_MAP[pathname];
  const Icon = current?.icon || Home;
  const color = current?.color || "text-primary-500";
  const isRoot = pathname === "/admin" || pathname === "/manager";
  const isAdmin = user.role === "ADMIN";
  const accountPath = isAdmin ? "/admin/account" : "/manager/account";

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-card-border bg-background/80 backdrop-blur-lg">
      <div className="h-0.5 bg-linear-to-r from-primary-500 via-accent-500 to-primary-500" />
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <SidebarTrigger className="text-foreground-secondary hover:text-foreground transition-colors" />

        <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
          {isRoot ? (
            <p className="text-foreground-secondary truncate">
              <span className="font-medium text-foreground">{getGreeting(t.greetings)}</span>, {user.name} 👋
            </p>
          ) : (
            <nav className="flex items-center gap-1.5 text-foreground-secondary truncate">
              <Home className="w-3.5 h-3.5 shrink-0" />
              <ChevronRight className="w-3 h-3 shrink-0 opacity-40" />
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                <span className="font-medium text-foreground truncate">
                  {current?.label || "Halaman"}
                </span>
              </div>
            </nav>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-card-border hover:bg-primary-500/5 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-foreground truncate max-w-28">{user.name}</p>
              <p className="text-[10px] text-foreground-secondary capitalize">{user.role.toLowerCase()}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-foreground-secondary transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-xl shadow-xl bg-card-bg border border-card-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-card-border bg-primary-500/5">
                <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-foreground-secondary truncate">{user.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-500 text-[10px] font-bold uppercase">
                  {user.role}
                </span>
              </div>

              <div className="py-1.5">
                {/* Theme Toggle */}
                <button
                  onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-secondary hover:text-foreground hover:bg-primary-500/5 transition-colors"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
                </button>

                {/* Language Toggle */}
                <div className="px-4 py-2.5">
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-2">
                    <Globe className="w-4 h-4" />
                    <span>Bahasa / Language</span>
                  </div>
                  <div className="flex items-center gap-1 bg-primary-500/5 rounded-lg p-1">
                    {(["id", "en", "ms"] as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setDropdownOpen(false); }}
                        className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${
                          locale === l
                            ? "bg-primary-500 text-white shadow-sm"
                            : "text-foreground-secondary hover:text-foreground hover:bg-primary-500/10"
                        }`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Link */}
                <Link
                  href={accountPath}
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-secondary hover:text-foreground hover:bg-primary-500/5 transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  Akun Saya
                </Link>
              </div>

              <div className="border-t border-card-border py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
