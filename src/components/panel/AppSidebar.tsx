"use client"

import { Home, Users, FileText, Activity, LogOut, Package, BarChart, TrendingUp, Image as ImageIcon, MessageCircle, CheckSquare, Landmark, Compass, Bus } from "lucide-react"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "@/lib/LocaleContext"
import { translations } from "@/lib/translations"

export function AppSidebar({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";
  const { dObj } = useLocale();
  const t = dObj(translations);
  const ta = t.adminPanel;
  const tm = t.managerPanel;

  const adminMenuGroups = [
    {
      label: ta?.menu?.main || "Menu Utama",
      items: [
        { title: ta?.menu?.dashboard || "Dashboard Admin", url: "/admin", icon: Home, iconKey: "Home" },
        { title: ta?.menu?.statistics || "Statistik Travel", url: "/admin/stats", icon: BarChart, iconKey: "BarChart" },
        { title: ta?.menu?.topsisAnalysis || "Analisis TOPSIS", url: "/admin/topsis", icon: TrendingUp, iconKey: "TrendingUp" },
      ]
    },
    {
      label: ta?.menu?.operational || "Operasional & Transaksi",
      items: [
        { title: ta?.menu?.bookings || "Manajemen Booking", url: "/admin/bookings", icon: CheckSquare, iconKey: "CheckSquare" },
        { title: ta?.menu?.packages || "Paket Wisata", url: "/admin/packages", icon: Package, iconKey: "Package" },
        { title: ta?.menu?.vehicles || "Tipe Kendaraan", url: "/admin/vehicles", icon: Bus, iconKey: "Bus" },
      ]
    },
    {
      label: ta?.menu?.content || "Menu Konten Publik",
      items: [
        { title: ta?.menu?.hero || "Hero Banner", url: "/admin/content/hero", icon: ImageIcon, iconKey: "ImageIcon" },
        { title: ta?.menu?.about || "Tentang Kami", url: "/admin/content/about", icon: FileText, iconKey: "FileText" },
        { title: ta?.menu?.services || "Layanan Wisata", url: "/admin/content/services", icon: Compass, iconKey: "Compass" },
        { title: ta?.menu?.testimonials || "Testimoni", url: "/admin/content/testimonials", icon: MessageCircle, iconKey: "MessageCircle" },
        { title: ta?.menu?.gallery || "Galeri Foto", url: "/admin/content/gallery", icon: ImageIcon, iconKey: "ImageIcon" },
      ]
    },
    {
      label: ta?.menu?.settings || "Pengaturan & Bantuan",
      items: [
        { title: ta?.menu?.contact || "Info Kontak & Chat", url: "/admin/settings/contact", icon: MessageCircle, iconKey: "MessageCircle" },
        { title: ta?.menu?.bankAccounts || "Rekening Bank", url: "/admin/settings/bank-accounts", icon: Landmark, iconKey: "Landmark" },
        { title: ta?.menu?.users || "Kelola Pengguna", url: "/admin/users", icon: Users, iconKey: "Users" },
      ]
    }
  ];

  const managerMenuGroups = [
    {
      label: tm?.menu?.main || "Menu Utama",
      items: [
        { title: tm?.menu?.dashboard || "Dashboard", url: "/manager", icon: Home, iconKey: "Home" },
      ]
    },
    {
      label: tm?.menu?.reports || "Laporan & Dokumen",
      items: [
        { title: tm?.menu?.transactionReports || "Laporan Transaksi", url: "/manager/reports/bookings", icon: FileText, iconKey: "FileText" },
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

  return (
    <Sidebar className="border-r border-white/5 bg-primary-500">
      <SidebarHeader className="p-4 pb-5">
        <Link href="/" className="flex items-center gap-3 font-bold font-(family-name:--font-playfair) group">
          <div className="w-9 h-9 rounded-xl bg-primary-700/30 flex items-center justify-center shrink-0 group-hover:bg-primary-700/40 transition-colors">
            <Image src="/logo_white.png" alt="Titan Travel" width={28} height={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-primary-950 leading-tight text-base tracking-tight">Titan Travel</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-900/70">
              {isAdmin ? (ta?.title || "Admin Panel") : (tm?.title || "Manager")}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {currentGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-900/80 flex items-center gap-2 px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== "/admin" && item.url !== "/manager" && pathname.startsWith(item.url + "/"));

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link
                        href={item.url}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item
                          ${isActive
                            ? "bg-primary-700/25 text-white font-semibold shadow-lg shadow-primary-900/15"
                            : "text-primary-white/90 hover:bg-primary-700/15 hover:text-primary-950 hover:translate-x-0.5"
                          }
                        `}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? "bg-white/20" : "bg-primary-700/10 group-hover/item:bg-primary-700/20"
                        }`}>
                          <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-white/90 group-hover/item:text-primary-950/90"}`} />
                        </div>
                        <span className="text-sm truncate">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1 h-5 rounded-full bg-primary-950/40" />
                        )}
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-primary-700/20 p-3">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-700 hover:bg-rose-500/60 hover:text-red-600 transition-all duration-200 group/logout"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-700/10 flex items-center justify-center group-hover/logout:bg-rose-500/30 transition-colors">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-sm font-medium text-red-600 hover:text-rose-800">
            {ta?.actions?.logout || "Keluar"}
          </span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
