"use client";

import {
  Package,
  Users,
  Image as ImageIcon,
  MessageCircle,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Medal,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import { RevenueChart } from "../manager/components/RevenueChart";
import { StatCard } from "@/components/panel/StatCard";
import { formatCurrency } from "@/lib/utils";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface DashboardStats {
  packages: number;
  publishedPackages: number;
  users: number;
  bookings: number;
  pendingBookings: number;
  totalRevenue: number;
  chartData: { name: string; revenue: number }[];
  topPackages: Array<{
    id: string;
    title: string;
    totalRevenue: number;
    bookingCount: number;
  }>;
  recentBookings: Array<{
    id: string;
    name: string;
    email: string;
    pax: number;
    status: BookingStatus;
    createdAt: Date;
  }>;
}

interface AdminDashboardClientProps {
  initialStats: DashboardStats;
  userName: string;
}

export function AdminDashboardClient({ initialStats, userName }: AdminDashboardClientProps) {
  const { dObj, locale, rates } = useLocale();
  const t = dObj(translations).adminPanel;
  const tm = dObj(translations).managerPanel;

  const getStatusMap = () => ({
    PENDING: { 
      label: t?.status?.pending || "Pending", 
      variant: "secondary" as const, 
      icon: Clock 
    },
    CONFIRMED: {
      label: t?.status?.confirmed || "Confirmed",
      variant: "default" as const,
      icon: CheckCircle,
    },
    CANCELLED: {
      label: t?.status?.cancelled || "Cancelled",
      variant: "destructive" as const,
      icon: XCircle,
    },
    COMPLETED: {
      label: t?.status?.completed || "Completed",
      variant: "outline" as const,
      icon: CheckCircle,
    },
  });

  const statusMap = getStatusMap();

  const statCards = [
    {
      title: t?.stats?.totalPackages || "Total Packages",
      value: initialStats.packages,
      icon: Package,
      iconColor: "text-primary-500",
      iconBg: "bg-primary-500/10",
      trend: `${initialStats.publishedPackages} ${t?.stats?.publishedSuffix || "published active"}`,
      trendColor: "text-green-500",
    },
    {
      title: t?.stats?.totalUsers || "Total Users",
      value: initialStats.users,
      icon: Users,
      iconColor: "text-accent-500",
      iconBg: "bg-accent-500/10",
      trend: t?.stats?.allRoles || "All roles",
      trendColor: "text-foreground-secondary",
    },
    {
      title: t?.stats?.totalBookings || "Total Bookings",
      value: initialStats.bookings,
      icon: CalendarCheck,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      trend: `${initialStats.pendingBookings} ${t?.stats?.pendingSuffix || "awaiting confirmation"}`,
      trendColor:
        initialStats.pendingBookings > 0 ? "text-amber-500" : "text-green-500",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-(family-name:--font-playfair)">
          {t?.title || "Admin Dashboard"}
        </h1>
        <p className="text-sm text-foreground-secondary">
          {t?.greeting || "Welcome back"}, <strong>{userName}</strong>!
          {t?.description || "Review today's system activity."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts & Top Packages Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart 
            data={initialStats.chartData} 
            period="6months"
            onPeriodChange={() => {}} // Admin chart is static 6 months for now
          />
        </div>

        {/* Top Packages */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 text-amber-500 mb-6">
            <Medal className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">{tm?.stats?.topPackages || "Top Packages"}</h3>
          </div>

          <div className="flex-1 space-y-6">
            {initialStats.topPackages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-foreground-secondary text-center">
                <Package className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-xs font-medium italic">{tm?.stats?.noPackageData || "No package performance data yet"}</p>
              </div>
            ) : (
              initialStats.topPackages.map((pkg, idx) => (
                <div key={pkg.id} className="relative group flex items-start gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all border border-transparent hover:border-card-border/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-black shrink-0 border border-amber-500/20">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary-600 transition-colors">
                      {pkg.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <Wallet className="w-3 h-3" />
                        {formatCurrency(pkg.totalRevenue, locale, rates)}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-foreground-secondary">
                        <Users className="w-3 h-3" />
                        {pkg.bookingCount} {tm?.stats?.bookingsLabel || "Bookings"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="rounded-xl border border-card-border bg-card-bg shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
            <h2 className="text-base font-semibold text-foreground">
              {t?.recentBookings?.title || "Recent Bookings"}
            </h2>
            <a
              href="/admin/bookings"
              className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              {t?.actions?.viewAll || "View all"} →
            </a>
          </div>

          {initialStats.recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-foreground-secondary">
              <CalendarCheck className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">{t?.recentBookings?.empty || "No bookings yet"}</p>
            </div>
          ) : (
            <div className="divide-y divide-card-border">
              {initialStats.recentBookings.map((booking) => {
                const statusInfo =
                  statusMap[booking.status as keyof typeof statusMap];
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
                          {booking.email} · {booking.pax} {t?.recentBookings?.paxLabel || "pax"}
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
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              href: "/admin/packages",
              label: t?.quickLinks?.managePackages || "Manage Tour Packages",
              desc: t?.quickLinks?.managePackagesDesc || "Add, edit, or delete tour packages",
              icon: Package,
              color: "text-primary-500",
              bg: "bg-primary-500/10",
            },
            {
              href: "/admin/content/gallery",
              label: t?.quickLinks?.manageGallery || "Manage Gallery",
              desc: t?.quickLinks?.manageGalleryDesc || "Upload and organize gallery photos",
              icon: ImageIcon,
              color: "text-violet-500",
              bg: "bg-violet-500/10",
            },
            {
              href: "/admin/content/testimonials",
              label: t?.quickLinks?.manageTestimonials || "Manage Testimonials",
              desc: t?.quickLinks?.manageTestimonialsDesc || "Manage public reviews and testimonials",
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
    </div>
  );
}
