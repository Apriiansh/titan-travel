import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { StatCard } from "@/components/panel/StatCard";
import {
  Package,
  Users,
  Image as ImageIcon,
  MessageCircle,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP = {
  PENDING: { label: "Pending", variant: "secondary" as const, icon: Clock },
  CONFIRMED: {
    label: "Dikonfirmasi",
    variant: "default" as const,
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Dibatalkan",
    variant: "destructive" as const,
    icon: XCircle,
  },
  COMPLETED: {
    label: "Selesai",
    variant: "outline" as const,
    icon: CheckCircle,
  },
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Paket Wisata",
      value: stats.packages,
      icon: Package,
      iconColor: "text-primary-500",
      iconBg: "bg-primary-500/10",
      trend: `${stats.publishedPackages} aktif dipublikasikan`,
      trendColor: "text-green-500",
    },
    {
      title: "Total Pengguna",
      value: stats.users,
      icon: Users,
      iconColor: "text-accent-500",
      iconBg: "bg-accent-500/10",
      trend: "Semua role",
      trendColor: "text-foreground-secondary",
    },
    {
      title: "Total Booking",
      value: stats.bookings,
      icon: CalendarCheck,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      trend: `${stats.pendingBookings} menunggu konfirmasi`,
      trendColor:
        stats.pendingBookings > 0 ? "text-amber-500" : "text-green-500",
    },
    {
      title: "Aset Galeri",
      value: stats.gallery,
      icon: ImageIcon,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
      trend: `${stats.testimonials} testimoni`,
      trendColor: "text-foreground-secondary",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-(family-name:--font-playfair)">
          Beranda Admin
        </h1>
        <p className="text-sm text-foreground-secondary">
          Selamat datang kembali,{" "}
          <strong>{session?.name as string}</strong>! Tinjau aktivitas sistem
          hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Booking Terbaru
            </h2>
            <p className="text-xs text-foreground-secondary mt-0.5">
              5 permintaan booking terakhir masuk
            </p>
          </div>
          <a
            href="/admin/bookings"
            className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            Lihat semua →
          </a>
        </div>

        {stats.recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-foreground-secondary">
            <CalendarCheck className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Belum ada booking masuk</p>
          </div>
        ) : (
          <div className="divide-y divide-card-border">
            {stats.recentBookings.map((booking) => {
              const statusInfo =
                STATUS_MAP[booking.status as keyof typeof STATUS_MAP];
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-card-border/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-sm shrink-0">
                      {booking.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {booking.name}
                      </p>
                      <p className="text-xs text-foreground-secondary">
                        {booking.email} · {booking.pax} pax
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.label}
                    </Badge>
                    <span className="text-xs text-foreground-secondary hidden sm:block">
                      {new Date(booking.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/admin/packages",
            label: "Kelola Paket Wisata",
            desc: "Tambah, edit, atau hapus paket wisata",
            icon: Package,
            color: "text-primary-500",
            bg: "bg-primary-500/10",
          },
          {
            href: "/admin/content/gallery",
            label: "Kelola Galeri",
            desc: "Upload dan atur foto galeri",
            icon: ImageIcon,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
          {
            href: "/admin/content/testimonials",
            label: "Kelola Testimoni",
            desc: "Atur ulasan dan testimoni publik",
            icon: MessageCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-xl border border-card-border bg-card-bg p-5 flex items-start gap-4 hover:border-primary-500/30 hover:shadow-md transition-all group"
          >
            <div
              className={`w-10 h-10 rounded-lg ${link.bg} flex items-center justify-center ${link.color} shrink-0`}
            >
              <link.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary-500 transition-colors">
                {link.label}
              </p>
              <p className="text-xs text-foreground-secondary mt-0.5">
                {link.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
