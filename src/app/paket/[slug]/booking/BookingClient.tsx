"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Users,
  CreditCard,
  Loader2,
  CheckCircle,
  Shield,
  ChevronRight,
} from "lucide-react";
import { createBooking } from "@/lib/actions/bookings";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap: any;
  }
}

export function BookingClient({ packageData }: { packageData: any }) {
  const [pax, setPax] = useState(1);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentType, setPaymentType] = useState<"DP" | "HALF" | "FULL">("FULL");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const getUnitPrice = (p: number) => {
    const tier = packageData.priceTiers.find(
      (t: any) => p >= t.minPax && p <= t.maxPax
    );
    if (tier) return Number(tier.price);
    const sorted = [...packageData.priceTiers].sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
    return sorted.length > 0 ? Number(sorted[0].price) : 0;
  };

  const unitPrice = getUnitPrice(pax);
  const totalPrice = unitPrice * pax;

  let amountToPay = totalPrice;
  if (paymentType === "HALF") amountToPay = totalPrice * 0.5;
  if (paymentType === "DP") amountToPay = totalPrice * 0.3;

  const currentTier = packageData.priceTiers.find(
    (t: any) => pax >= t.minPax && pax <= t.maxPax
  );

  const savings =
    currentTier?.originalPrice
      ? Number(currentTier.originalPrice) * pax - totalPrice
      : 0;

  const paymentOptions: { key: "FULL" | "HALF" | "DP"; label: string; pct: string; desc: string }[] = [
    { key: "FULL", label: "Lunas", pct: "100%", desc: "Bayar sekarang" },
    { key: "HALF", label: "Setengah", pct: "50%", desc: "Sisa saat tour" },
    { key: "DP", label: "DP", pct: "30%", desc: "Min. down payment" },
  ];

  const handleBooking = () => {
    if (!date || !name || !email || !phone) {
      alert("Mohon isi semua data!");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createBooking({
          name,
          email,
          phone,
          packageId: packageData.id,
          tourDate: new Date(date),
          pax,
          paymentType,
        });

        if (result.snapToken) {
          window.snap.pay(result.snapToken, {
            onSuccess: (result: any) => {
              router.push(`/dashboard?status=success&bookingId=${result.order_id}`);
            },
            onPending: (result: any) => {
              router.push(`/dashboard?status=pending&bookingId=${result.order_id}`);
            },
            onError: () => {
              alert("Pembayaran gagal!");
            },
            onClose: () => {
              alert("Anda menutup popup pembayaran sebelum selesai.");
            },
          });
        }
      } catch (err) {
        console.error(err);
        alert("Gagal membuat booking");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* ── LEFT: Form ── */}
      <div className="md:col-span-3 space-y-6">
        {/* Informasi Pemesan */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          {/* Section header strip */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
              <Users className="w-4 h-4" />
            </span>
            <p className="text-sm font-bold text-slate-800">Informasi Pemesan</p>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">
                Nama Lengkap
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama sesuai KTP"
                className="h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Nomor WhatsApp
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812..."
                  className="h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Perjalanan */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
              <Calendar className="w-4 h-4" />
            </span>
            <p className="text-sm font-bold text-slate-800">Detail Perjalanan</p>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Tanggal Keberangkatan
                </Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Jumlah Peserta (Pax)
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={pax}
                  onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                  className="h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20"
                />
              </div>
            </div>

            {/* Payment type selector */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-slate-600">
                Metode Pembayaran
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPaymentType(opt.key)}
                    className={`relative flex flex-col items-center justify-center gap-1 py-3.5 px-2 rounded-xl border-2 text-center transition-all duration-200 ${
                      paymentType === opt.key
                        ? "border-primary-500 bg-primary-50 shadow-sm shadow-primary-500/15"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {paymentType === opt.key && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white fill-white" />
                      </span>
                    )}
                    <span
                      className={`text-base font-black leading-none ${
                        paymentType === opt.key ? "text-primary-600" : "text-slate-700"
                      }`}
                    >
                      {opt.pct}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        paymentType === opt.key ? "text-primary-700" : "text-slate-600"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── RIGHT: Summary Card ── */}
      <div className="md:col-span-2 space-y-6">
        {/*
          KEY FIX: Ganti <Card> dengan <div> biasa + shadow manual,
          supaya dark header bisa langsung flush ke atas tanpa padding
          bawaan dari komponen Card shadcn.
        */}
        <div className="sticky top-24 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-900/10">

          {/* Dark header — now truly flush to top */}
          <div className="relative bg-slate-900 px-6 py-5 overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/15">
                <CreditCard className="w-4 h-4 text-primary-400" />
              </span>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  Ringkasan Biaya
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                  Detail Transaksi
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white p-6 space-y-5">

            {/* Tier info row */}
            <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-700">Harga per Orang</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Tier {pax} peserta
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">
                  Rp {unitPrice.toLocaleString("id-ID")}
                </p>
                <p className="text-[10px] text-slate-400">/ orang</p>
              </div>
            </div>

            {/* Pax row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Jumlah Peserta</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                {pax}x
              </span>
            </div>

            {/* Savings badge */}
            {savings > 0 && (
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-green-50 border border-green-100">
                <span className="text-green-600 text-xs">🎉</span>
                <p className="text-[11px] font-bold text-green-700">
                  Hemat Rp {savings.toLocaleString("id-ID")} untuk tier ini!
                </p>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                Subtotal
              </span>
              <p className="text-xl font-black text-primary-600">
                Rp {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Payment split box */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Metode
                </span>
                <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {paymentType === "FULL" ? "LUNAS 100%" : paymentType === "HALF" ? "50%" : "DP 30%"}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-600">Wajib Bayar Sekarang</span>
                <span className="text-xl font-black text-slate-900">
                  Rp {amountToPay.toLocaleString("id-ID")}
                </span>
              </div>
              {paymentType !== "FULL" && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>Sisa tagihan</span>
                  <span className="font-bold">
                    Rp {(totalPrice - amountToPay).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Button
              className="w-full h-13 text-sm font-bold gap-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              onClick={handleBooking}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Konfirmasi &amp; Bayar
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                </>
              )}
            </Button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Shield className="w-3 h-3 text-green-500" />
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                Secure Payment · Midtrans
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}