"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { 
  Home, Package, CheckSquare, BarChart, TrendingUp, 
  ImageIcon, FileText, MessageCircle, Users, Settings, 
  Landmark, Compass, Activity, ChevronRight
} from "lucide-react"

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
  "/admin/users": { label: "Pengguna", icon: Users, color: "text-rose-500" },
  "/manager": { label: "Dashboard", icon: Home, color: "text-blue-500" },
  "/manager/validation": { label: "Validasi", icon: CheckSquare, color: "text-emerald-500" },
  "/manager/activity": { label: "Aktivitas", icon: Activity, color: "text-purple-500" },
  "/manager/reports/bookings": { label: "Laporan Transaksi", icon: FileText, color: "text-orange-500" },
  "/manager/reports/topsis": { label: "Laporan TOPSIS", icon: TrendingUp, color: "text-cyan-500" },
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export function PanelHeader({ userName }: { userName: string }) {
  const pathname = usePathname();
  const current = BREADCRUMB_MAP[pathname];
  const Icon = current?.icon || Home;
  const color = current?.color || "text-primary-500";

  const isRoot = pathname === "/admin" || pathname === "/manager";

  return (
    <header className="sticky top-0 z-10 border-b border-card-border bg-background/80 backdrop-blur-lg">
      <div className="h-0.5 bg-linear-to-r from-primary-500 via-accent-500 to-primary-500" />
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <SidebarTrigger className="text-foreground-secondary hover:text-foreground transition-colors" />

        <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
          {isRoot ? (
            <p className="text-foreground-secondary truncate">
              <span className="font-medium text-foreground">{getGreeting()}</span>, {userName} 👋
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

        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-primary-500/5 border border-primary-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-foreground-secondary">Online</span>
          </div>
        </div>
      </div>
    </header>
  )
}
