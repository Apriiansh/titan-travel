"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Star,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ChevronRight,
  Share2,
  ArrowRight,
  Timer,
  XCircle,
  AlertCircle,
  Compass,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { uploadPaymentProof } from "@/lib/actions/bookings";
import { uploadFile } from "@/lib/actions/upload";
import { id, enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardClient({
  initialBookings,
  userName,
  adminPhone = "",
}: {
  initialBookings: any[];
  userName: string;
  adminPhone?: string;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const { dt, locale } = useLocale();
  const router = useRouter();

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);
  
  // Ambil translasi berdasarkan locale yang aktif
  const t =
    translations[locale as keyof typeof translations]?.dashboard ||
    translations.id.dashboard;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: t.status?.pending || "Menunggu Pembayaran",
          color: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <Timer className="w-3.5 h-3.5" />,
        };
      case "PEMBAYARAN_DITERIMA":
      case "CONFIRMED":
        return {
          label: t.status?.confirmed || "Berhasil / Terkonfirmasi",
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "CANCELLED":
        return {
          label: t.status?.cancelled || "Dibatalkan",
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: t.status?.unknown || status,
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleUploadProof = async (bookingId: string, file: File) => {
    setUploadingId(bookingId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(formData);
      if (result.success && result.url) {
        await uploadPaymentProof(bookingId, result.url);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, paymentProof: result.url } : b
          )
        );
      }
    } catch {
      alert(t.actions?.failed || "Gagal upload bukti pembayaran.");
    } finally {
      setUploadingId(null);
    }
  };

  const sendWhatsApp = (booking: any) => {
    const pkgTitle = booking.package?.title?.id || "Paket Wisata";
    const dateStr = booking.tourDate
      ? new Date(booking.tourDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "-";
    const message = `Halo Admin *Titan Travel*,\n\nSaya telah melakukan pemesanan dan ${booking.paymentProof ? "mengunggah bukti pembayaran" : "akan segera melakukan pembayaran"}:\n\n📌 *Paket:* ${pkgTitle}\n📅 *Tanggal:* ${dateStr}\n👥 *Peserta:* ${booking.pax} Orang\n💰 *Total Bayar:* Rp ${Number(booking.amountPaid).toLocaleString("id-ID")}\n🆔 *Kode Booking:* ${booking.id.substring(0, 8).toUpperCase()}\n\nMohon diproses ya. Terima kasih! 🙏`;
    const phone = adminPhone.startsWith("0") ? "62" + adminPhone.slice(1) : adminPhone;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  const dateLocale = locale === "id" ? id : enUS;

  return (
    <div className="pb-20 relative">
      {/* Dark Hero Background Segment (Consistent with Package Detail) */}
      <div className="absolute -top-20 left-0 w-full h-100 bg-slate-900 z-0" />

      {/* Top Navigation Bar */}
      <div className="bg-transparent sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "id" ? "Kembali ke Beranda" : "Back to Home"}
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary-500 transition-all border border-white/10">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side: Booking List */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header / Title Section (On Fixed Dark BG) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
                  <Compass className="w-3 h-3" />
                  {locale === "id" ? "Dashboard Pengguna" : "User Dashboard"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-(family-name:--font-playfair) text-white leading-tight">
                {locale === "id" ? (
                  <>
                    <span className="text-primary-400 italic">Pesanan </span>Saya
                  </>
                ) : (
                  <>
                    <span className="text-primary-400 italic">My </span>Bookings
                  </>
                )}
              </h1>

              <p className="text-slate-300 max-w-xl text-base leading-relaxed opacity-90">
                {(
                  t.heroSubtitle ||
                  "Halo {name}, pantau semua rencana perjalanan dan status pembayaran Anda secara real-time."
                ).replace("{name}", userName)}
              </p>

              {/* Quick Stats - Using Theme Cards */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-card-bg border border-card-border shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-foreground-secondary mb-1">
                    {t.stats?.totalBookings || "Total Pesanan"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {bookings.length}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-card-bg border border-card-border shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-foreground-secondary mb-1">
                    {t.stats?.active || "Aktif"}
                  </p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {bookings.filter(b => b.status === "CONFIRMED").length}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-card-bg border border-card-border shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-foreground-secondary mb-1">
                    {t.stats?.totalPax || "Total Pax"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {bookings.reduce((sum, b) => sum + (b.pax || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Divider / Trip History Header */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary-500 rounded-full" />
                <h2 className="text-2xl font-bold font-(family-name:--font-playfair) text-foreground">
                  {locale === "id" ? "Daftar Perjalanan" : "Trip History"}
                </h2>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-card-bg rounded-2xl border border-dashed border-card-border shadow-sm">
                  <AlertCircle className="w-12 h-12 text-foreground-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground">
                    {t.emptyTitle || "Belum ada pesanan"}
                  </h3>
                  <p className="text-foreground-secondary mt-1 mb-6">
                    {t.emptySubtitle || "Anda belum pernah melakukan pemesanan paket wisata."}
                  </p>
                  <Button onClick={() => router.push("/")} variant="outline" className="rounded-xl border-card-border">
                    {t.searchButton || "Cari Paket Wisata"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {bookings.map((booking) => {
                    const status = getStatusConfig(booking.status);
                    const pkg = booking.package;
                    const title = pkg?.title?.id || pkg?.title?.en || "Paket Wisata";

                    return (
                      <Card key={booking.id} className="overflow-hidden border border-card-border shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group bg-card-bg">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image Section */}
                            <div className="w-full sm:w-56 h-56 sm:h-auto relative overflow-hidden bg-background-secondary">
                              <img
                                src={pkg?.images?.[0] || "/placeholder.jpg"}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-40" />
                              
                              {/* Status Badge */}
                              <div className="absolute top-4 left-4">
                                <Badge className={`${status.color} border-none flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-bold shadow-lg`}>
                                  {status.icon}
                                  {status.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                              <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                                      {dt(pkg?.location || "Destinasi")}
                                    </p>
                                    <h3 className="text-xl sm:text-2xl font-bold text-foreground font-(family-name:--font-playfair) leading-tight line-clamp-2">
                                      {dt(pkg?.title || "Package Title")}
                                    </h3>
                                  </div>
                                  <div className="sm:text-right shrink-0">
                                    <p className="text-2xl font-black text-primary-500">
                                      {locale === "id"
                                        ? `Rp ${Number(booking.totalPrice).toLocaleString("id-ID")}`
                                        : `$ ${(Number(booking.totalPrice) / 15000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                                    </p>
                                    <p className="text-[10px] font-bold text-foreground-secondary uppercase tracking-wider">
                                      {t.fields?.total || "Total Harga"}
                                    </p>
                                    
                                    {/* Sisa Tagihan Logic */}
                                    {Number(booking.amountPaid) < Number(booking.totalPrice) && (
                                      <div className="mt-2 pt-2 border-t border-dashed border-card-border">
                                        <p className="text-xs font-bold text-emerald-500">
                                          {locale === "id" ? "Dibayar:" : "Paid:"} {locale === "id" 
                                            ? `Rp ${Number(booking.amountPaid).toLocaleString("id-ID")}`
                                            : `$ ${(Number(booking.amountPaid) / 15000).toFixed(0)}`}
                                        </p>
                                        <p className="text-[11px] font-black text-red-500 mt-1">
                                          {locale === "id" ? "Sisa:" : "Balance:"} {locale === "id"
                                            ? `Rp ${(Number(booking.totalPrice) - Number(booking.amountPaid)).toLocaleString("id-ID")}`
                                            : `$ ${((Number(booking.totalPrice) - Number(booking.amountPaid)) / 15000).toFixed(0)}`}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary border border-card-border">
                                    <Calendar className="w-4 h-4 text-primary-500" />
                                    <div>
                                      <p className="text-[9px] uppercase font-bold text-foreground-secondary">Berangkat</p>
                                      <p className="text-sm text-foreground font-bold">
                                        {format(new Date(booking.tourDate), "dd MMM yyyy", { locale: dateLocale })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary border border-card-border">
                                    <Users className="w-4 h-4 text-primary-500" />
                                    <div>
                                      <p className="text-[9px] uppercase font-bold text-foreground-secondary">
                                        {t.fields?.pax || "Peserta"}
                                      </p>
                                      <p className="text-sm text-foreground font-bold">
                                        {booking.pax} {locale === "id" ? "Orang" : "Pax"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary border border-card-border">
                                    <Clock className="w-4 h-4 text-primary-500" />
                                    <div>
                                      <p className="text-[9px] uppercase font-bold text-foreground-secondary">Kode</p>
                                      <p className="text-sm text-foreground font-bold font-mono uppercase">
                                        {booking.id.substring(0, 8)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-card-border">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <p className="text-[10px] text-foreground-secondary font-medium italic">
                                    {t.fields?.bookedAt || "Dipesan pada"}{" "}
                                    {format(new Date(booking.createdAt), "dd MMM yyyy, HH:mm", { locale: dateLocale })}
                                  </p>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                  {booking.status === "PENDING" && !booking.paymentProof && (
                                    <label className="flex-1 sm:flex-none cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleUploadProof(booking.id, file);
                                        }}
                                        disabled={uploadingId === booking.id}
                                      />
                                      <span className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-11 px-6 font-bold text-sm shadow-lg shadow-primary-500/20 transition-all hover:scale-105 cursor-pointer w-full">
                                        {uploadingId === booking.id
                                          ? "Mengupload..."
                                          : "Upload Bukti Bayar"}
                                      </span>
                                    </label>
                                  )}
                                  {booking.status === "PENDING" && booking.paymentProof && (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 border px-4 py-2 text-xs font-bold">
                                      Menunggu Verifikasi
                                    </Badge>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none rounded-xl h-11 px-6 text-sm border-card-border hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 gap-2 font-bold"
                                    onClick={() => sendWhatsApp(booking)}
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                    Hubungi Admin
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-card-bg border border-card-border flex gap-5 hover:border-primary-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1.5 text-base">
                    {t.help?.bookingStatusTitle || "Status Pemesanan"}
                  </h4>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    {t.help?.bookingStatusSubtitle || "Semua status pesanan Anda diperbarui secara otomatis dan real-time dari sistem kami."}
                  </p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-card-bg border border-card-border flex gap-5 hover:border-primary-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1.5 text-base">
                    {t.help?.customerSupportTitle || "Dukungan Pelanggan"}
                  </h4>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    {t.help?.customerSupportSubtitle || "Butuh bantuan dengan pesanan Anda? Tim kami siap membantu Anda 24/7."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Sticky Summary Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-card-bg border border-card-border shadow-xl space-y-8 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />

                <div>
                  <p className="text-xs font-bold text-foreground-secondary uppercase tracking-widest mb-3">
                    {t.profile?.title || "Profil Pengguna"}
                  </p>
                  <h2 className="text-3xl font-bold text-foreground font-(family-name:--font-playfair) mb-1">
                    {userName}
                  </h2>
                  <p className="text-sm font-bold text-primary-500">
                    {t.profile?.memberLabel || "Member Titan Travel"}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-card-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-foreground-secondary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{t.profile?.totalBookings || "Total Pesanan"}</span>
                    </div>
                    <span className="font-bold text-foreground">{bookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-foreground-secondary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">{t.profile?.activeBookings || "Pesanan Aktif"}</span>
                    </div>
                    <span className="text-emerald-600 font-bold">{bookings.filter(b => b.status === "CONFIRMED").length}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 text-foreground-secondary">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{t.profile?.totalSpending || "Total Pengeluaran"}</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {locale === "id"
                        ? `Rp ${bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0).toLocaleString("id-ID")}`
                        : `$ ${(bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0) / 15000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  <Link 
                    href="/"
                    className="w-full py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    {t.profile?.explorePackages || "Jelajahi Paket Wisata"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="w-full py-4 rounded-xl border border-card-border bg-background-secondary text-foreground font-bold hover:bg-background transition-all flex items-center justify-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    Bantuan CS
                  </button>
                </div>
              </div>

              {/* Help Card */}
              <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex items-center gap-4 group cursor-pointer hover:bg-primary-500/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-card-bg flex items-center justify-center text-primary-500 shadow-sm border border-card-border">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {t.help?.title || "Butuh Bantuan?"}
                  </h4>
                  <p className="text-xs text-foreground-secondary">
                    {t.help?.subtitle || "Hubungi konsultan travel kami"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground-secondary ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

