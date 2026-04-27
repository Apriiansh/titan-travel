"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Upload,
  MessageSquare,
  Copy,
  Loader2,
  ImageIcon,
  Building2,
  QrCode,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { uploadPaymentProof } from "@/lib/actions/bookings";
import { uploadFile } from "@/lib/actions/upload";
import SafeImage from "@/components/ui/safe-image";

type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  imageUrl: string | null;
};

type BookingResult = {
  id: string;
  name: string;
  phone: string;
  pax: number;
  paymentType: string;
  totalPrice: number;
  amountPaid: number;
  packageTitle: string;
  tourDate: string;
};

export function PaymentConfirmation({
  booking,
  bankAccounts,
  adminPhone,
  onBack,
}: {
  booking: BookingResult;
  bankAccounts: BankAccount[];
  adminPhone: string;
  onBack: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploaded, setUploaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadFile(formData);

        if (result.success && result.url) {
          await uploadPaymentProof(booking.id, result.url);
          setUploaded(true);
        }
      } catch {
        setPreviewUrl(null);
      }
    });
  };

  const sendWhatsApp = () => {
    const dateStr = booking.tourDate
      ? new Date(booking.tourDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    const message = `Halo Admin *Titan Travel*,\n\nSaya telah melakukan pemesanan dan ${uploaded ? "mengunggah bukti pembayaran" : "akan segera melakukan pembayaran"}:\n\n📌 *Paket:* ${booking.packageTitle}\n📅 *Tanggal:* ${dateStr}\n👥 *Peserta:* ${booking.pax} Orang\n💰 *Total Bayar:* Rp ${booking.amountPaid.toLocaleString("id-ID")} (${booking.paymentType})\n🆔 *Kode Booking:* ${booking.id.substring(0, 8).toUpperCase()}\n\nMohon diproses ya. Terima kasih! 🙏`;

    const phone = adminPhone.startsWith("0")
      ? "62" + adminPhone.slice(1)
      : adminPhone;
    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* LEFT: Bank Info + Upload */}
      <div className="md:col-span-3 space-y-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Form
        </button>

        {/* Success Banner */}
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-emerald-800">
              Pesanan Berhasil Dibuat!
            </h3>
            <p className="text-xs text-emerald-600 mt-1">
              Kode Booking:{" "}
              <span className="font-mono font-bold">
                {booking.id.substring(0, 8).toUpperCase()}
              </span>{" "}
              — Silakan transfer sesuai nominal dan upload bukti pembayaran.
            </p>
          </div>
        </div>

        {/* Daftar Rekening */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
              <Building2 className="w-4 h-4" />
            </span>
            <p className="text-sm font-bold text-slate-800">
              Transfer ke Rekening
            </p>
          </div>
          <CardContent className="p-6 space-y-4">
            {bankAccounts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Belum ada rekening yang dikonfigurasi.
              </p>
            ) : (
              bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-200 transition-colors"
                >
                  {bank.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 relative">
                      <SafeImage
                        src={bank.imageUrl}
                        alt={bank.bankName}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {bank.bankName.toLowerCase().includes("qris") ? (
                        <QrCode className="w-7 h-7 text-slate-400" />
                      ) : (
                        <Building2 className="w-7 h-7 text-slate-400" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {bank.bankName}
                    </p>
                    <p className="text-lg font-black text-slate-900 mt-0.5 font-mono tracking-wide">
                      {bank.accountNumber}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      a.n. {bank.accountName}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-xl border-slate-200 h-9 px-3 text-xs font-bold gap-1.5"
                    onClick={() =>
                      copyToClipboard(
                        bank.accountNumber.replace(/[^0-9]/g, ""),
                        bank.id
                      )
                    }
                  >
                    {copiedId === bank.id ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upload Bukti */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
              <Upload className="w-4 h-4" />
            </span>
            <p className="text-sm font-bold text-slate-800">
              Upload Bukti Pembayaran
            </p>
          </div>
          <CardContent className="p-6">
            {uploaded ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-emerald-700">
                  Bukti pembayaran berhasil diupload!
                </p>
                <p className="text-xs text-slate-400">
                  Admin akan memverifikasi pembayaran Anda.
                </p>
                {previewUrl && (
                  <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border border-slate-200 mt-4">
                    <SafeImage
                      src={previewUrl}
                      alt="Bukti Pembayaran"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/30 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={isPending}
                />
                {isPending ? (
                  <>
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    <p className="text-sm font-bold text-primary-600">
                      Mengupload...
                    </p>
                  </>
                ) : previewUrl ? (
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-slate-200">
                    <SafeImage
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">
                        Klik untuk upload bukti transfer
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        JPG, PNG, atau WebP · Maks 5MB
                      </p>
                    </div>
                  </>
                )}
              </label>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Summary + WhatsApp CTA */}
      <div className="md:col-span-2 space-y-6">
        <div className="sticky top-24 space-y-6">
          {/* Summary */}
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-900/10">
            <div className="relative bg-slate-900 px-6 py-5 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-500/20 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-white">Ringkasan Biaya</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                  Detail Transaksi
                </p>
              </div>
            </div>
            <div className="bg-white p-6 space-y-4">
              <div className="pb-3 border-b border-dashed border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Paket
                </p>
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {booking.packageTitle}
                </p>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Tanggal</span>
                <span className="font-bold text-slate-700">
                  {booking.tourDate
                    ? new Date(booking.tourDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Jumlah Peserta</span>
                <span className="font-bold text-slate-700">
                  {booking.pax} Orang
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Metode</span>
                <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full text-[10px]">
                  {booking.paymentType === "FULL"
                    ? "LUNAS 100%"
                    : booking.paymentType === "HALF"
                      ? "50%"
                      : "DP 30%"}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Wajib Transfer
                  </span>
                  <span className="text-2xl font-black text-primary-600">
                    Rp {booking.amountPaid.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <Button
            onClick={sendWhatsApp}
            className="w-full h-13 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm gap-2.5 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Konfirmasi via WhatsApp
          </Button>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <Shield className="w-3 h-3 text-green-500" />
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
              Transfer Bank · Verified by Titan Travel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
