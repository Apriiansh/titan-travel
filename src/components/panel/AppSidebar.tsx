"use client"

import { Home, Users, Settings, FileText, Activity, LogOut, Package, BarChart, TrendingUp, Image as ImageIcon, MessageCircle, CheckSquare } from "lucide-react"
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

export function AppSidebar({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";

  // Menu Groups for Admin
  const adminMenuGroups = [
    {
      label: "Menu Utama",
      items: [
        { title: "Dashboard Admin", url: "/admin", icon: Home },
        { title: "Statistik Travel", url: "/admin/stats", icon: BarChart },
        { title: "Analisis TOPSIS", url: "/admin/topsis", icon: TrendingUp },
      ]
    },
    {
      label: "Operasional & Transaksi",
      items: [
        { title: "Manajemen Booking", url: "/admin/bookings", icon: CheckSquare },
        { title: "Paket Wisata", url: "/admin/packages", icon: Package },
      ]
    },
    {
      label: "Menu Konten Publik",
      items: [
        { title: "Hero Banner", url: "/admin/content/hero", icon: ImageIcon },
        { title: "Tentang Kami", url: "/admin/content/about", icon: FileText },
        { title: "Layanan Wisata", url: "/admin/content/services", icon: CheckSquare }, // Using CheckSquare or Map
        { title: "Testimoni", url: "/admin/content/testimonials", icon: MessageCircle },
        { title: "Galeri Foto", url: "/admin/content/gallery", icon: ImageIcon },
      ]
    },
    {
      label: "Pengaturan & Bantuan",
      items: [
        { title: "Info Kontak & Chat", url: "/admin/settings/contact", icon: MessageCircle },
        { title: "Kelola Pengguna", url: "/admin/users", icon: Users },
        { title: "Pengaturan Global", url: "/admin/settings", icon: Settings },
      ]
    }
  ];

  // Menu Groups for Manager
  const managerMenuGroups = [
    {
      label: "Menu Utama",
      items: [
        { title: "Dashboard", url: "/manager", icon: Home },
        { title: "Validasi", url: "/manager/validation", icon: CheckSquare },
        { title: "Laporan Perjalanan", url: "/manager/reports", icon: FileText },
        { title: "Aktivitas Sistem", url: "/manager/activity", icon: Activity },
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
    <Sidebar className="border-r border-card-border bg-card-bg">
      <SidebarHeader className="border-b border-card-border p-4">
        <Link href="/" className="flex items-center gap-2 font-bold font-(family-name:--font-playfair)">
          <div className="w-8 h-8 rounded-sm bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white text-sm">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground leading-tight">Titan</span>
            <span className="text-primary-500 text-xs">{isAdmin ? "Admin Panel" : "Manager Panel"}</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {currentGroups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-foreground-secondary">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} passHref>
                      <SidebarMenuButton 
                        isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                        className="hover:bg-primary-500/10 hover:text-primary-600 transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-card-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
              <span className="text-xs text-foreground-secondary truncate">{user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-red-500/10 text-red-500 transition-colors shrink-0"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
