"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  Info,
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
  const router = useRouter();
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
    <div className="flex flex-col md:grid md:grid-cols-5 gap-6 md:gap-8">
      {/* RIGHT: Order Summary (Mobile: Top, Desktop: Right) */}
      <div className="order-first md:order-last md:col-span-2 space-y-4 md:space-y-6">
        <Card className="border border-primary-100 shadow-sm rounded-2xl overflow-hidden bg-primary-50/30">
          <div className="px-5 py-4 border-b border-primary-100 bg-primary-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-600" />
              <p className="text-xs font-bold text-primary-800 uppercase tracking-wider">
                Ringkasan Tagihan
              </p>
            </div>
            <span className="text-[10px] font-bold bg-primary-500 text-white px-2 py-0.5 rounded-full">
              {booking.paymentType}
            </span>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                Paket Wisata
              </p>
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {booking.packageTitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-primary-100/50">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                  Tanggal
                </p>
                <p className="text-xs font-semibold text-slate-700">
                  {booking.tourDate ? new Date(booking.tourDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                  Peserta
                </p>
                <p className="text-xs font-semibold text-slate-700">
                  {booking.pax} Orang
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs font-bold text-primary-800">Total Wajib Bayar</p>
              <p className="text-xl font-black text-primary-600">
                Rp {booking.amountPaid.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={sendWhatsApp}
            className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 shadow-lg shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            Konfirmasi via WhatsApp
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold gap-2"
            onClick={() => router.push("/dashboard")}
          >
            Cek Status Pesanan
          </Button>
        </div>
      </div>

      {/* LEFT: Bank Info + Upload (Mobile: Bottom, Desktop: Left) */}
      <div className="md:col-span-3 space-y-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit Data Pemesanan
        </button>

        {/* Success Banner */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-emerald-800">
              Pemesanan Berhasil!
            </h3>
            <p className="text-[11px] text-emerald-600 mt-0.5 leading-relaxed">
              ID: <span className="font-mono font-bold">{booking.id.substring(0, 8).toUpperCase()}</span> — Segera transfer dan upload bukti bayar.
            </p>
          </div>
        </div>

        {/* Daftar Rekening */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-100 text-primary-600">
              <Building2 className="w-3.5 h-3.5" />
            </span>
            <p className="text-xs font-bold text-slate-800">
              Tujuan Transfer
            </p>
          </div>
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            {bankAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Belum ada rekening tersedia.
              </p>
            ) : (
              bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {bank.imageUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shrink-0 relative">
                        <SafeImage
                          src={bank.imageUrl}
                          alt={bank.bankName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {bank.bankName.toLowerCase().includes("qris") ? (
                          <QrCode className="w-6 h-6 text-slate-400" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 sm:hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {bank.bankName}
                      </p>
                      <p className="text-base font-black text-slate-900 font-mono">
                        {bank.accountNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {bank.bankName}
                    </p>
                    <p className="text-base font-black text-slate-900 mt-0.5 font-mono">
                      {bank.accountNumber}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      a.n. {bank.accountName}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto flex items-center justify-between sm:block mt-1 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="sm:hidden text-left">
                       <p className="text-[11px] text-slate-500 truncate">
                        a.n. {bank.accountName}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-slate-200 h-8 px-3 text-[10px] font-bold gap-1.5"
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
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upload Bukti */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-100 text-primary-600">
              <Upload className="w-3.5 h-3.5" />
            </span>
            <p className="text-xs font-bold text-slate-800">
              Konfirmasi Pembayaran
            </p>
          </div>
          <CardContent className="p-6">
            {uploaded ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Bukti Terkirim!</h4>
                  <p className="text-xs text-slate-500 mt-1 px-4">
                    Tim kami akan segera memverifikasi pembayaran Anda dalam waktu 1x24 jam.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setUploaded(false)}
                  className="h-9 rounded-xl text-xs font-semibold"
                >
                  Ganti File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={isPending}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`
                    border-2 border-dashed rounded-2xl p-8 text-center transition-all
                    ${previewUrl ? 'border-primary-400 bg-primary-50/30' : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50'}
                  `}>
                    {previewUrl ? (
                      <div className="relative w-full aspect-[4/3] max-w-[240px] mx-auto rounded-lg overflow-hidden shadow-md">
                        <SafeImage
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        {isPending && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-colors">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">Pilih Foto Bukti Bayar</p>
                          <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG atau WEBP (Maks. 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {!previewUrl && (
                  <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Info className="w-3.5 h-3.5 shrink-0 text-primary-400" />
                    <p>Pastikan nominal transfer dan nomor rekening terlihat jelas dalam foto bukti pembayaran.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
