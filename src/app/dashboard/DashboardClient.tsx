"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  CreditCard,
  Clock,
  ExternalLink,
  AlertCircle,
  XCircle,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  initialBookings: any[];
}

export function DashboardClient({ initialBookings }: DashboardClientProps) {
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Menunggu Pembayaran",
          color: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <Timer className="w-3.5 h-3.5" />,
        };
      case "PEMBAYARAN_DITERIMA":
      case "CONFIRMED":
        return {
          label: "Berhasil / Terkonfirmasi",
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "CANCELLED":
        return {
          label: "Dibatalkan",
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: status,
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const handlePayNow = (snapToken: string) => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: () => router.refresh(),
        onPending: () => router.refresh(),
        onError: () => alert("Pembayaran gagal!"),
        onClose: () => alert("Selesaikan pembayaran Anda segera."),
      });
    }
  };

  if (initialBookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Belum ada pesanan
        </h3>
        <p className="text-slate-500 mt-1 mb-6">
          Anda belum pernah melakukan pemesanan paket wisata.
        </p>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="rounded-xl"
        >
          Cari Paket Wisata
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {initialBookings.map((booking) => {
        const status = getStatusConfig(booking.status);
        const pkg = booking.package;
        const title = pkg?.title?.id || pkg?.title?.en || "Paket Wisata";

        return (
          <Card
            key={booking.id}
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl group bg-white dark:bg-slate-900"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden bg-slate-200">
                  <img
                    src={pkg?.images?.[0] || "/placeholder.jpg"}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${status.color} border flex items-center gap-1 px-3 py-1 text-[10px] uppercase font-bold shadow-sm`}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                        {title}
                      </h2>
                      <p className="text-lg font-black text-primary-600">
                        Rp {Number(booking.totalPrice).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Tanggal
                          </p>
                          <p>
                            {format(new Date(booking.tourDate), "dd MMM yyyy", {
                              locale: id,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users className="w-4 h-4 text-primary-500" />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Peserta
                          </p>
                          <p>{booking.pax} Pax</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <CreditCard className="w-4 h-4 text-primary-500" />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Metode
                          </p>
                          <p>{booking.paymentType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Kode Booking
                          </p>
                          <p className="font-mono uppercase">
                            {booking.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <p className="text-[10px] text-slate-400 font-medium italic">
                      Dipesan pada{" "}
                      {format(
                        new Date(booking.createdAt),
                        "dd MMM yyyy, HH:mm",
                        { locale: id },
                      )}
                    </p>

                    <div className="flex items-center gap-3">
                      {booking.status === "PENDING" && booking.snapToken && (
                        <Button
                          onClick={() => handlePayNow(booking.snapToken!)}
                          className="bg-primary-500 hover:bg-primary-600 text-white gap-2 rounded-xl h-10 px-6 font-bold text-sm shadow-lg shadow-primary-500/20"
                        >
                          <CreditCard className="w-4 h-4" />
                          Bayar Sekarang
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="rounded-xl h-10 px-4 gap-2 border-slate-200"
                        disabled
                      >
                        <ExternalLink className="w-4 h-4" />
                        Detail
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
  );
}
