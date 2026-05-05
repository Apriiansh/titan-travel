"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { ConfirmDialog } from "@/components/panel/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBooking, updateBookingStatus, verifyPayment, verifySettlement } from "@/lib/actions/bookings";
import { Trash2, Loader2, MessageSquare, MoreVertical, ExternalLink, Calendar, Users, CreditCard, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import { formatCurrency } from "@/lib/utils";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageId?: string | null;
  tourDate?: Date | null;
  pax: number;
  paymentType: "DP" | "HALF" | "FULL";
  totalPrice: number;
  amountPaid: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  paymentProof?: string | null;
  settlementProof?: string | null;
  createdAt: Date;
  package?: any;
};

export function BookingsClient({ initialData }: { initialData: Booking[] }) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<string>("ALL");
  const router = useRouter();
  const { dObj, locale, rates, dt } = useLocale();
  const t = dObj(translations).adminPanel.bookings;

  const STATUS_CONFIG = {
    PENDING: { label: t?.pending || "Pending", variant: "secondary" as const, color: "bg-muted text-foreground-secondary border-card-border" },
    CONFIRMED: { label: t?.confirmed || "Confirmed", variant: "default" as const, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    CANCELLED: { label: t?.cancelled || "Cancelled", variant: "destructive" as const, color: "bg-destructive/10 text-destructive border-destructive/20" },
    COMPLETED: { label: t?.completed || "Completed", variant: "outline" as const, color: "bg-primary-500/10 text-primary-600 border-primary-500/20" },
  };

  const refresh = () => router.refresh();

  const filtered = filter === "ALL" ? data : data.filter((b) => b.status === filter);

  function handleStatusChange(id: string, status: Booking["status"]) {
    startTransition(async () => {
      try {
        await updateBookingStatus(id, status);
        setData((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        refresh();
      } catch (err) {
        console.error(err);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteBooking(id);
        setData((prev) => prev.filter((b) => b.id !== id));
        refresh();
      } catch (err) {
        console.error(err);
      }
    });
  }

  function handleVerifySettlement(id: string) {
    startTransition(async () => {
      try {
        await verifySettlement(id);
        setData((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: "COMPLETED", amountPaid: b.totalPrice }
              : b
          )
        );
        refresh();
      } catch (err) {
        console.error(err);
      }
    });
  }

  const sendWhatsApp = (booking: Booking) => {
    const pkgTitle = dt(booking.package?.title) || t?.waMessage?.package || "Paket Wisata";
    const dateStr = booking.tourDate 
      ? new Date(booking.tourDate).toLocaleDateString(locale === "id" ? "id-ID" : locale === "ms" ? "en-MY" : "en-US", { day: "numeric", month: "long", year: "numeric" })
      : "-";
    
    const balance = booking.totalPrice - booking.amountPaid;
    const balanceStr = balance > 0 
      ? `\n\n*${t?.waMessage?.remaining || "Sisa Tagihan"}:* ${formatCurrency(balance, locale, rates)}\n${t?.waMessage?.paymentNote || "Mohon lakukan pelunasan sebelum keberangkatan."}`
      : `\n\n${t?.waMessage?.paidNote || "*Status:* Lunas. Terima kasih!"}`;

    const message = `${t?.waMessage?.greeting?.replace("{name}", booking.name) || `Halo Kak *${booking.name}*`},\n\n${t?.waMessage?.intro || "Kami dari *Titan Travel* ingin mengonfirmasi pesanan Anda:"}\n\n📌 *${t?.waMessage?.package || "Paket"}:* ${pkgTitle}\n📅 *${t?.waMessage?.date || "Tanggal"}:* ${dateStr}\n👥 *${t?.waMessage?.pax || "Peserta"}:* ${booking.pax} ${locale === "id" ? "Orang" : "Pax"}\n💰 *${t?.waMessage?.total || "Total"}:* ${formatCurrency(booking.totalPrice, locale, rates)}${balanceStr}\n\n${t?.waMessage?.helpNote || "Apakah ada yang bisa kami bantu terkait persiapan perjalanannya?"}\n\n${t?.waMessage?.closing || "Terima kasih! 🙏"}`;
    
    const phone = booking.phone.startsWith("0") ? "62" + booking.phone.slice(1) : booking.phone;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t?.title || "Manajemen Booking"}
        description={t?.description || "Kelola reservasi, pantau pembayaran, dan hubungi pelanggan"}
        action={
          <Select value={filter} onValueChange={(val) => setFilter(val ?? "ALL")}>
            <SelectTrigger className="w-45 bg-card-bg border-card-border">
              <SelectValue placeholder={t?.filter || "Filter Status"} />
            </SelectTrigger>
            <SelectContent className="bg-card-bg border-card-border">
              <SelectItem value="ALL">{t?.allStatus || "Semua Status"}</SelectItem>
              <SelectItem value="PENDING">{t?.pending || "⌛ Pending"}</SelectItem>
              <SelectItem value="CONFIRMED">{t?.confirmed || "✅ Confirmed"}</SelectItem>
              <SelectItem value="COMPLETED">{t?.completed || "⭐ Selesai"}</SelectItem>
              <SelectItem value="CANCELLED">{t?.cancelled || "❌ Dibatalkan"}</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="rounded-2xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-foreground-secondary">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">{t?.empty || "Belum ada data booking untuk kategori ini."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t?.table?.customerInfo || "Informasi Pelanggan"}</th>
                  <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t?.table?.packageSchedule || "Paket & Jadwal"}</th>
                  <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t?.table?.paymentStatus || "Status Pembayaran"}</th>
                  <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t?.table?.status || "Status"}</th>
                  <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">{t?.table?.action || "Aksi"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {filtered.map((booking) => {
                  const balance = Number(booking.totalPrice) - Number(booking.amountPaid);
                  const isFullyPaid = balance <= 0;

                  return (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors group">
                      {/* Customer Info */}
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground text-base">{booking.name}</p>
                          <div className="flex flex-col gap-0.5 text-xs text-foreground-secondary font-medium">
                            <span>{booking.email}</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-emerald-500" />
                              {booking.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Package & Schedule */}
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 p-1.5 rounded-lg bg-primary-500/10 text-primary-500">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-tight">
                                {dt(booking.package?.title) || "Paket Wisata"}
                              </p>
                              <p className="text-[11px] text-foreground-secondary mt-0.5">
                                {booking.tourDate
                                  ? new Date(booking.tourDate).toLocaleDateString(locale === "id" ? "id-ID" : locale === "ms" ? "en-MY" : "en-US", { day: "numeric", month: "long", year: "numeric" })
                                  : "Tanggal belum dipilih"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground-secondary bg-foreground/5 w-fit px-2 py-0.5 rounded-md">
                            <Users className="w-3 h-3" />
                            {booking.pax} {locale === "id" ? "Peserta" : "Pax"}
                          </div>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-foreground-secondary uppercase">{t?.payment?.total || "Total"}</span>
                            <span className="font-black text-foreground">{formatCurrency(booking.totalPrice, locale, rates)}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">{t?.payment?.paid || "Dibayar"}</span>
                            <span className="font-bold text-emerald-600">{formatCurrency(booking.amountPaid, locale, rates)}</span>
                          </div>
                          {balance > 0 && (
                            <div className="flex justify-between items-end pt-1 border-t border-card-border">
                              <span className="text-[10px] font-bold text-destructive uppercase tracking-tighter">{t?.payment?.remaining || "Sisa"}</span>
                              <span className="font-black text-destructive">{formatCurrency(balance, locale, rates)}</span>
                            </div>
                          )}
                          {isFullyPaid && (
                            <div className="mt-1 flex items-center justify-center gap-1 py-0.5 px-2 bg-emerald-500/10 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">
                              <CreditCard className="w-2.5 h-2.5" />
                              {t?.payment?.fullPayment || "Lunas"}
                            </div>
                          )}
                          {/* Payment Proof */}
                          {booking.paymentProof && (
                            <a
                              href={booking.paymentProof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                              <ImageIcon className="w-3 h-3" />
                              {t?.payment?.viewProof || "Lihat Bukti Bayar"}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {booking.status === "PENDING" && booking.paymentProof && (
                            <Button
                              size="sm"
                              className="mt-2 h-7 px-3 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg gap-1"
                              onClick={() => {
                                startTransition(async () => {
                                  await verifyPayment(booking.id);
                                  setData((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "CONFIRMED" } : b)));
                                  refresh();
                                });
                              }}
                              disabled={isPending}
                            >
                              <CheckCircle className="w-3 h-3" />
                              {t?.payment?.verifyPayment || "Verifikasi Pembayaran"}
                            </Button>
                          )}
                          {/* Settlement Proof */}
                          {booking.settlementProof && (
                            <a
                              href={booking.settlementProof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              <ImageIcon className="w-3 h-3" />
                              {t?.payment?.viewSettlement || "Lihat Bukti Pelunasan"}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {booking.status === "CONFIRMED" && booking.settlementProof && (
                            <Button
                              size="sm"
                              className="mt-2 h-7 px-3 text-[10px] font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-lg gap-1"
                              onClick={() => handleVerifySettlement(booking.id)}
                              disabled={isPending}
                            >
                              <CheckCircle className="w-3 h-3" />
                              {t?.payment?.verifySettlement || "Verifikasi Pelunasan"}
                            </Button>
                          )}
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="px-6 py-5 text-center">
                        <Select
                          value={booking.status}
                          onValueChange={(val) => val && handleStatusChange(booking.id, val as Booking["status"])}
                          disabled={isPending}
                        >
                          <SelectTrigger className={`w-32.5 h-9 text-xs font-bold rounded-xl border shadow-none ${STATUS_CONFIG[booking.status].color}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl shadow-xl border-card-border">
                            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                              <SelectItem key={key} value={key} className="text-xs font-medium py-2.5">
                                {val.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] text-foreground-secondary mt-2 font-medium">
                          {locale === "id" ? "Dibuat" : locale === "ms" ? "Dibuat" : "Created"}: {new Date(booking.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : locale === "ms" ? "en-MY" : "en-US")}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3 rounded-xl border-card-border bg-card-bg hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20 transition-all gap-1.5 font-bold text-xs text-foreground"
                            onClick={() => sendWhatsApp(booking)}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {t?.actions?.whatsapp || "Notify via WhatsApp"}
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-foreground/5 transition-colors focus:outline-none">
                              <MoreVertical className="w-4 h-4 text-foreground-secondary" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-card-border p-1.5 w-48">
                              <ConfirmDialog
                                trigger={
                                  <DropdownMenuItem 
                                    className="rounded-lg py-2 cursor-pointer gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {t?.actions?.delete || "Hapus Pesanan"}
                                  </DropdownMenuItem>
                                }
                                onConfirm={() => handleDelete(booking.id)}
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
