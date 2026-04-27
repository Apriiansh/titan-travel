"use client"

import { Home, Users, Settings, FileText, Activity, LogOut, Package, BarChart, TrendingUp, Image as ImageIcon, MessageCircle, CheckSquare, Landmark, Compass } from "lucide-react"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"

const ICON_COLORS: Record<string, string> = {
  Home: "text-blue-500",
  BarChart: "text-violet-500",
  TrendingUp: "text-cyan-500",
  CheckSquare: "text-emerald-500",
  Package: "text-amber-500",
  ImageIcon: "text-pink-500",
  FileText: "text-orange-500",
  MessageCircle: "text-teal-500",
  Landmark: "text-indigo-500",
  Users: "text-rose-500",
  Settings: "text-slate-500",
  Activity: "text-purple-500",
  Compass: "text-sky-500",
};

const ICON_BG: Record<string, string> = {
  Home: "bg-blue-500/10",
  BarChart: "bg-violet-500/10",
  TrendingUp: "bg-cyan-500/10",
  CheckSquare: "bg-emerald-500/10",
  Package: "bg-amber-500/10",
  ImageIcon: "bg-pink-500/10",
  FileText: "bg-orange-500/10",
  MessageCircle: "bg-teal-500/10",
  Landmark: "bg-indigo-500/10",
  Users: "bg-rose-500/10",
  Settings: "bg-slate-500/10",
  Activity: "bg-purple-500/10",
  Compass: "bg-sky-500/10",
};

const GROUP_COLORS = [
  "from-blue-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-pink-500 to-orange-500",
  "from-indigo-500 to-purple-500",
];

export function AppSidebar({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";

  const adminMenuGroups = [
    {
      label: "Menu Utama",
      items: [
        { title: "Dashboard Admin", url: "/admin", icon: Home, iconKey: "Home" },
        { title: "Statistik Travel", url: "/admin/stats", icon: BarChart, iconKey: "BarChart" },
        { title: "Analisis TOPSIS", url: "/admin/topsis", icon: TrendingUp, iconKey: "TrendingUp" },
      ]
    },
    {
      label: "Operasional & Transaksi",
      items: [
        { title: "Manajemen Booking", url: "/admin/bookings", icon: CheckSquare, iconKey: "CheckSquare" },
        { title: "Paket Wisata", url: "/admin/packages", icon: Package, iconKey: "Package" },
      ]
    },
    {
      label: "Menu Konten Publik",
      items: [
        { title: "Hero Banner", url: "/admin/content/hero", icon: ImageIcon, iconKey: "ImageIcon" },
        { title: "Tentang Kami", url: "/admin/content/about", icon: FileText, iconKey: "FileText" },
        { title: "Layanan Wisata", url: "/admin/content/services", icon: Compass, iconKey: "Compass" },
        { title: "Testimoni", url: "/admin/content/testimonials", icon: MessageCircle, iconKey: "MessageCircle" },
        { title: "Galeri Foto", url: "/admin/content/gallery", icon: ImageIcon, iconKey: "ImageIcon" },
      ]
    },
    {
      label: "Pengaturan & Bantuan",
      items: [
        { title: "Info Kontak & Chat", url: "/admin/settings/contact", icon: MessageCircle, iconKey: "MessageCircle" },
        { title: "Rekening Bank", url: "/admin/settings/bank-accounts", icon: Landmark, iconKey: "Landmark" },
        { title: "Kelola Pengguna", url: "/admin/users", icon: Users, iconKey: "Users" },
      ]
    }
  ];

  const managerMenuGroups = [
    {
      label: "Menu Utama",
      items: [
        { title: "Dashboard", url: "/manager", icon: Home, iconKey: "Home" },
        { title: "Validasi", url: "/manager/validation", icon: CheckSquare, iconKey: "CheckSquare" },
        { title: "Aktivitas Sistem", url: "/manager/activity", icon: Activity, iconKey: "Activity" },
      ]
    },
    {
      label: "Laporan & Dokumen",
      items: [
        { title: "Laporan Transaksi", url: "/manager/reports/bookings", icon: FileText, iconKey: "FileText" },
        { title: "Laporan TOPSIS", url: "/manager/reports/topsis", icon: TrendingUp, iconKey: "TrendingUp" },
      ]
    }
  ];

  const currentGroups = isAdmin ? adminMenuGroups : managerMenuGroups;

  const handleLogout = async () => {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
    } catch (err) {
        console.error("Logout failed", err);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Sidebar className="border-r border-card-border bg-card-bg">
      <SidebarHeader className="p-4 pb-5">
        <Link href="/" className="flex items-center gap-3 font-bold font-(family-name:--font-playfair) group">
          <Image src="/logo_white.png" alt="Titan Travel" width={36} height={36} className="group-hover:shadow-primary-500/40 transition-shadow" />
          <div className="flex flex-col">
            <span className="text-foreground leading-tight text-base tracking-tight">Titan Travel</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
              {isAdmin ? "Admin" : "Manager"}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {currentGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground-secondary/60 flex items-center gap-2 px-3 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${GROUP_COLORS[groupIdx % GROUP_COLORS.length]}`} />
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== "/admin" && item.url !== "/manager" && pathname.startsWith(item.url + "/"));
                  const iconColor = ICON_COLORS[item.iconKey] || "text-primary-500";
                  const iconBg = ICON_BG[item.iconKey] || "bg-primary-500/10";

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link href={item.url} passHref>
                        <SidebarMenuButton
                          isActive={isActive}
                          className={`
                            relative rounded-xl transition-all duration-200
                            ${isActive
                              ? `${iconBg} font-bold`
                              : "hover:bg-foreground/5"
                            }
                          `}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={isActive ? { backgroundColor: `color-mix(in srgb, currentColor 8%, transparent)` } : undefined}
                          >
                            <item.icon className={`w-3.5 h-3.5 ${isActive ? iconColor : "text-foreground-secondary"}`} />
                          </div>
                          <span className={`text-[13px] ${isActive ? "text-foreground font-semibold" : "text-foreground-secondary"}`}>
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-card-border p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-foreground-secondary truncate">{user.email}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <ThemeToggle className="w-8 h-8 p-0!" />
            <button 
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-foreground-secondary hover:text-red-500 transition-all"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
