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
import { deleteBooking, updateBookingStatus } from "@/lib/actions/bookings";
import { Trash2, Loader2, MessageSquare, MoreVertical, ExternalLink, Calendar, Users, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

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
  createdAt: Date;
  package?: any;
};

const STATUS_CONFIG = {
  PENDING: { label: "Pending", variant: "secondary" as const, color: "bg-slate-100 text-slate-700 border-slate-200" },
  CONFIRMED: { label: "Confirmed", variant: "default" as const, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const, color: "bg-red-50 text-red-700 border-red-200" },
  COMPLETED: { label: "Completed", variant: "outline" as const, color: "bg-blue-50 text-blue-700 border-blue-200" },
};

export function BookingsClient({ initialData }: { initialData: Booking[] }) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<string>("ALL");
  const router = useRouter();

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

  const sendWhatsApp = (booking: Booking) => {
    const pkgTitle = booking.package?.title?.id || "Paket Wisata";
    const dateStr = booking.tourDate 
      ? new Date(booking.tourDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "-";
    
    const balance = booking.totalPrice - booking.amountPaid;
    const balanceStr = balance > 0 
      ? `\n\n*Sisa Tagihan:* Rp ${balance.toLocaleString("id-ID")}\nMohon lakukan pelunasan sebelum keberangkatan.`
      : "\n\n*Status:* Lunas. Terima kasih!";

    const message = `Halo Kak *${booking.name}*,\n\nKami dari *Titan Travel* ingin mengonfirmasi pesanan Anda:\n\n📌 *Paket:* ${pkgTitle}\n📅 *Tanggal:* ${dateStr}\n👥 *Peserta:* ${booking.pax} Orang\n💰 *Total:* Rp ${Number(booking.totalPrice).toLocaleString("id-ID")}${balanceStr}\n\nApakah ada yang bisa kami bantu terkait persiapan perjalanannya?\n\nTerima kasih! 🙏`;
    
    const phone = booking.phone.startsWith("0") ? "62" + booking.phone.slice(1) : booking.phone;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Booking"
        description="Kelola reservasi, pantau pembayaran, dan hubungi pelanggan"
        action={
          <Select value={filter} onValueChange={(val) => setFilter(val ?? "ALL")}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">⌛ Pending</SelectItem>
              <SelectItem value="CONFIRMED">✅ Confirmed</SelectItem>
              <SelectItem value="COMPLETED">⭐ Selesai</SelectItem>
              <SelectItem value="CANCELLED">❌ Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="rounded-2xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-foreground-secondary">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">Belum ada data booking untuk kategori ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-slate-50/50">
                  <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Informasi Pelanggan</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Paket & Jadwal</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status Pembayaran</th>
                  <th className="text-center px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                  <th className="text-center px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {filtered.map((booking) => {
                  const balance = Number(booking.totalPrice) - Number(booking.amountPaid);
                  const isFullyPaid = balance <= 0;

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Customer Info */}
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-base">{booking.name}</p>
                          <div className="flex flex-col gap-0.5 text-xs text-slate-500 font-medium">
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
                            <div className="mt-1 p-1.5 rounded-lg bg-primary-50 text-primary-600">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 leading-tight">
                                {booking.package?.title?.id || "Paket Wisata"}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {booking.tourDate
                                  ? new Date(booking.tourDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                  : "Tanggal belum dipilih"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-100 w-fit px-2 py-0.5 rounded-md">
                            <Users className="w-3 h-3" />
                            {booking.pax} Peserta
                          </div>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                            <span className="font-black text-slate-900">Rp {Number(booking.totalPrice).toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Dibayar</span>
                            <span className="font-bold text-emerald-600">Rp {Number(booking.amountPaid).toLocaleString("id-ID")}</span>
                          </div>
                          {balance > 0 && (
                            <div className="flex justify-between items-end pt-1 border-t border-slate-100">
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Sisa</span>
                              <span className="font-black text-red-600">Rp {balance.toLocaleString("id-ID")}</span>
                            </div>
                          )}
                          {isFullyPaid && (
                            <div className="mt-1 flex items-center justify-center gap-1 py-0.5 px-2 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                              <CreditCard className="w-2.5 h-2.5" />
                              Lunas
                            </div>
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
                          <SelectTrigger className={`w-[130px] h-9 text-xs font-bold rounded-xl border shadow-none ${STATUS_CONFIG[booking.status].color}`}>
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
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                          Dibuat: {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3 rounded-xl border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all gap-1.5 font-bold text-xs"
                            onClick={() => sendWhatsApp(booking)}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Notify via WhatsApp
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none">
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-card-border p-1.5 w-48">
                              <ConfirmDialog
                                trigger={
                                  <DropdownMenuItem 
                                    className="rounded-lg py-2 cursor-pointer gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Hapus Pesanan
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
