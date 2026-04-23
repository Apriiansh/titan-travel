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
import { deleteBooking, updateBookingStatus } from "@/lib/actions/bookings";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageId?: string | null;
  tourDate?: Date | null;
  pax: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  createdAt: Date;
};

const STATUS_CONFIG = {
  PENDING: { label: "Pending", variant: "secondary" as const },
  CONFIRMED: { label: "Dikonfirmasi", variant: "default" as const },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" as const },
  COMPLETED: { label: "Selesai", variant: "outline" as const },
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
      await updateBookingStatus(id, status);
      setData((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteBooking(id);
      setData((prev) => prev.filter((b) => b.id !== id));
      refresh();
    });
  }

  return (
    <>
      <PageHeader
        title="Manajemen Booking"
        description="Tinjau dan kelola semua permintaan booking wisata"
        action={
          <Select value={filter} onValueChange={(val) => setFilter(val ?? "ALL")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
              <SelectItem value="COMPLETED">Selesai</SelectItem>
              <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="rounded-xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-foreground-secondary">
            <p className="text-sm">Tidak ada booking ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card-border/20">
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary">Pemesan</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary hidden sm:table-cell">Kontak</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">Pax</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary hidden md:table-cell">Tanggal Tour</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground-secondary hidden lg:table-cell">Masuk</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking.id} className="border-b border-card-border last:border-0 hover:bg-card-border/10 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{booking.name}</p>
                      {booking.notes && (
                        <p className="text-xs text-foreground-secondary truncate max-w-[160px]" title={booking.notes}>
                          {booking.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground-secondary hidden sm:table-cell">
                      <p>{booking.email}</p>
                      <p className="text-xs">{booking.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-foreground">{booking.pax}</td>
                    <td className="px-4 py-3 text-foreground-secondary hidden md:table-cell">
                      {booking.tourDate
                        ? new Date(booking.tourDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Select
                        value={booking.status}
                        onValueChange={(val) => val && handleStatusChange(booking.id, val as Booking["status"])}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <Badge variant={STATUS_CONFIG[booking.status].variant}>
                            {STATUS_CONFIG[booking.status].label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{val.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-secondary hidden lg:table-cell">
                      {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </Button>
                          }
                          onConfirm={() => handleDelete(booking.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
