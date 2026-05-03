"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
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
  AlertTriangle,
  Info,
  ArrowLeft,
  Clock,
  MapPin,
  Bus,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { createBooking, getAvailableQuota } from "@/lib/actions/bookings";
import { useRouter } from "next/navigation";
import { PaymentConfirmation } from "./PaymentConfirmation";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

type QuotaInfo = {
  capacity: number;
  booked: number;
  available: number;
} | null;

type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  imageUrl: string | null;
};

type VehicleType = {
  id: string;
  name: string;
};

export function BookingClient({ 
  packageData,
  session,
  bankAccounts = [],
  vehicleTypes = [],
  adminPhone = "",
  slug = "",
}: { 
  packageData: any;
  session: any;
  bankAccounts?: BankAccount[];
  vehicleTypes?: VehicleType[];
  adminPhone?: string;
  slug?: string;
}) {
  const { locale } = useLocale();
  const t = (translations[locale as keyof typeof translations] as any)?.bookingPage || translations.id.bookingPage;
  const [pax, setPax] = useState(1);
  const [date, setDate] = useState("");
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<string | null>(null);
  
  // Pre-fill fields from session if available
  const [name, setName] = useState(session?.name || "");
  const [email, setEmail] = useState(session?.email || "");
  const [phone, setPhone] = useState(session?.phone || "");
  
  const [paymentType, setPaymentType] = useState<"DP" | "HALF" | "FULL">("FULL");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>(null);
  const [isCheckingQuota, setIsCheckingQuota] = useState(false);
  const router = useRouter();

  // --- Real-time quota check when date changes ---
  const checkQuota = useCallback(async (selectedDate: string) => {
    if (!selectedDate) {
      setQuotaInfo(null);
      return;
    }
    setIsCheckingQuota(true);
    try {
      const result = await getAvailableQuota(packageData.id, selectedDate);
      setQuotaInfo(result);
    } catch {
      setQuotaInfo(null);
    } finally {
      setIsCheckingQuota(false);
    }
  }, [packageData.id]);

  useEffect(() => {
    checkQuota(date);
  }, [date, checkQuota]);

  // Clamp pax to available quota when quota changes
  useEffect(() => {
    if (quotaInfo && pax > quotaInfo.available && quotaInfo.available > 0) {
      setPax(quotaInfo.available);
    }
  }, [quotaInfo, pax]);

  // Kendaraan yang tersedia = kendaraan unik dari priceTiers paket
  const availableVehicleIds = new Set(
    (packageData.priceTiers as any[]).map((t: any) => t.vehicleTypeId).filter(Boolean)
  );
  const displayedVehicleTypes = vehicleTypes.filter((v) => availableVehicleIds.has(v.id));
  const haVehicleChoice = displayedVehicleTypes.length > 0;

  // Auto-select jika hanya 1 kendaraan
  const effectiveVehicleId =
    selectedVehicleTypeId ??
    (displayedVehicleTypes.length === 1 ? displayedVehicleTypes[0].id : null);

  // --- Pricing logic ---
  const getUnitPrice = (p: number) => {
    const tiersForVehicle = effectiveVehicleId
      ? (packageData.priceTiers as any[]).filter((t: any) => t.vehicleTypeId === effectiveVehicleId)
      : (packageData.priceTiers as any[]);

    const tier = tiersForVehicle.find((t: any) => p >= t.minPax && p <= t.maxPax);
    if (tier) return Number(tier.price);
    const sorted = [...tiersForVehicle].sort((a: any, b: any) => Number(a.price) - Number(b.price));
    return sorted.length > 0 ? Number(sorted[0].price) : 0;
  };

  const unitPrice = getUnitPrice(pax);
  const totalPrice = unitPrice * pax;

  let amountToPay = totalPrice;
  if (paymentType === "HALF") amountToPay = totalPrice * 0.5;
  if (paymentType === "DP") amountToPay = totalPrice * 0.3;

  const tiersForCurrentVehicle = effectiveVehicleId
    ? (packageData.priceTiers as any[]).filter((t: any) => t.vehicleTypeId === effectiveVehicleId)
    : (packageData.priceTiers as any[]);
  const currentTier = tiersForCurrentVehicle.find((t: any) => pax >= t.minPax && pax <= t.maxPax);
  const savings =
    currentTier?.originalPrice
      ? Number(currentTier.originalPrice) * pax - totalPrice
      : 0;

  // Helper untuk klik tarif
  const handleTierClick = (vehicleId: string | null, minPax: number) => {
    if (vehicleId) setSelectedVehicleTypeId(vehicleId);
    setPax(minPax);
    // Scroll smooth ke input tanggal jika perlu (opsional)
  };

  const formatPrice = (amount: number) => {
    if (locale === "en") return `$ ${(amount / 15000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (locale === "ms") return `RM ${(amount / 3500).toLocaleString("ms-MY", { maximumFractionDigits: 0 })}`;
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const paymentOptions: { key: "FULL" | "HALF" | "DP"; label: string; pct: string; desc: string }[] = [
    { key: "FULL", label: t.payFull, pct: "100%", desc: t.payFullDesc },
    { key: "HALF", label: t.payHalf, pct: "50%", desc: t.payHalfDesc },
    { key: "DP", label: t.payDp, pct: "30%", desc: t.payDpDesc },
  ];

  // --- Quota status badge ---
  const quotaBadge = () => {
    if (!date) return null;
    if (isCheckingQuota) {
      return (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t.checkingAvailability}
        </div>
      );
    }
    if (!quotaInfo) return null;
    const { available, capacity, booked } = quotaInfo;
    if (available === 0) {
      return (
        <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-700">{t.quotaFullTitle}</p>
            <p className="text-[10px] text-red-500">{t.quotaFullDesc.replace("{booked}", booked).replace("{capacity}", capacity)}</p>
          </div>
        </div>
      );
    }
    if (available <= 5) {
      return (
        <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-700">{t.almostFullTitle.replace("{count}", available)}</p>
            <p className="text-[10px] text-amber-600">{t.almostFullDesc.replace("{booked}", booked).replace("{capacity}", capacity)}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-700">{t.seatsAvailable.replace("{count}", available)}</p>
          <p className="text-[10px] text-emerald-600">{t.seatsAvailableDesc.replace("{booked}", booked).replace("{capacity}", capacity)}</p>
        </div>
      </div>
    );
  };

  // --- Submit handler ---
  const handleBooking = () => {
    setErrorMsg("");

    if (!date || !name || !email || !phone) {
      setErrorMsg(t.fillAllFields);
      return;
    }
    if (quotaInfo && pax > quotaInfo.available) {
      setErrorMsg(t.quotaLeft.replace("{count}", quotaInfo.available));
      return;
    }
    if (quotaInfo?.available === 0) {
      setErrorMsg(t.noQuota);
      return;
    }

    startTransition(async () => {
      try {
        const result = await createBooking({
          userId: session?.id,
          name,
          email,
          phone,
          packageId: packageData.id,
          tourDate: new Date(date),
          pax,
          paymentType,
          vehicleTypeId: effectiveVehicleId ?? undefined,
        });

        if (result) {
          setBookingResult({
            ...result,
            packageTitle: (packageData.title as any)?.id || "Paket Wisata",
            tourDate: date,
          });
        }
      } catch (err: any) {
        setErrorMsg(err?.message || t.bookingFailed);
      }
    });
  };

  const isSubmitDisabled =
    isPending ||
    isCheckingQuota ||
    (quotaInfo !== null && quotaInfo.available === 0) ||
    (quotaInfo !== null && pax > quotaInfo.available);

  if (bookingResult) {
    return (
      <PaymentConfirmation
        booking={bookingResult}
        bankAccounts={bankAccounts}
        adminPhone={adminPhone}
        onBack={() => setBookingResult(null)}
      />
    );
  }

  const title = (packageData.title as any)?.[locale] || (packageData.title as any)?.id || t.packageLabel;
  const location = (packageData.location as any)?.[locale] || (packageData.location as any)?.id || "";
  const duration = (packageData.duration as any)?.[locale] || (packageData.duration as any)?.id || "";

  return (
    <>
      {/* Dark Slate Header */}
      <section className="relative bg-slate-900 pt-24 sm:pt-32 pb-12">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            href={`/paket/${slug || packageData.slug}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.backToDetail}
          </Link>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
              {t.formBadge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-(family-name:--font-playfair) leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary-400" />
                  {location}
                </div>
              )}
              {duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary-400" />
                  {duration}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-400" />
                {t.capacityLabel.replace("{count}", packageData.capacity)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background rounded-t-[40px] -mt-8 relative z-10 border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 py-10">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* ── LEFT: Form ── */}
      <div className="md:col-span-3 space-y-6">
        {/* Informasi Pemesan */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
              <Users className="w-4 h-4" />
            </span>
            <p className="text-sm font-bold text-slate-800">{t.bookerInfo}</p>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">
                {t.fullName}
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
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
                  {t.whatsappNumber}
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
            <p className="text-sm font-bold text-slate-800">{t.tripDetail}</p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Tabel Tarif Interaktif */}
            {packageData.priceTiers && packageData.priceTiers.length > 0 && (
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-primary-500" />
                  Pilih Paket & Tarif (Klik untuk pilih)
                </Label>
                <div className="space-y-4">
                  {Object.entries(
                    (packageData.priceTiers as any[]).reduce((acc: any, tier: any) => {
                      const vId = tier.vehicleTypeId || "standard";
                      const vName = tier.vehicleType?.name || "Standar";
                      if (!acc[vId]) acc[vId] = { name: vName, tiers: [] };
                      acc[vId].tiers.push(tier);
                      return acc;
                    }, {})
                  ).map(([vId, data]: [string, any]) => (
                    <div key={vId} className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/30">
                      <div className="px-3 py-1.5 bg-slate-100/50 border-b border-slate-100 flex items-center gap-2">
                        <Bus className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{data.name}</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {data.tiers.map((tier: any, idx: number) => {
                          const isSelected = effectiveVehicleId === tier.vehicleTypeId && pax >= tier.minPax && pax <= tier.maxPax;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleTierClick(tier.vehicleTypeId, tier.minPax)}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${
                                isSelected 
                                  ? "bg-primary-50 ring-1 ring-inset ring-primary-200" 
                                  : "bg-white hover:bg-slate-50"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <p className={`text-xs font-bold ${isSelected ? "text-primary-700" : "text-slate-700"}`}>
                                  {tier.minPax === tier.maxPax ? `${tier.minPax} Pax` : `${tier.minPax} - ${tier.maxPax} Pax`}
                                </p>
                                {isSelected && <p className="text-[9px] text-primary-500 font-medium">Paket Terpilih</p>}
                              </div>
                              <div className="text-right">
                                {tier.originalPrice && Number(tier.originalPrice) > 0 && (
                                  <p className="text-[9px] text-slate-400 line-through leading-none">
                                    {formatPrice(Number(tier.originalPrice))}
                                  </p>
                                )}
                                <p className={`text-sm font-black ${isSelected ? "text-primary-600" : "text-slate-900"}`}>
                                  {formatPrice(Number(tier.price))}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selector Kendaraan — tampil hanya jika ada lebih dari 1 pilihan */}
            {haVehicleChoice && displayedVehicleTypes.length > 1 && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Pilih Kendaraan
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {displayedVehicleTypes.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicleTypeId(v.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                        effectiveVehicleId === v.id
                          ? "border-primary-500 bg-primary-50 shadow-sm shadow-primary-500/15"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        effectiveVehicleId === v.id ? "bg-primary-100" : "bg-slate-100"
                      }`}>
                        <Bus className={`w-4 h-4 ${
                          effectiveVehicleId === v.id ? "text-primary-600" : "text-slate-400"
                        }`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold leading-tight ${
                          effectiveVehicleId === v.id ? "text-primary-700" : "text-slate-700"
                        }`}>{v.name}</p>
                        {effectiveVehicleId === v.id && (
                          <p className="text-[10px] text-primary-500 mt-0.5">Dipilih</p>
                        )}
                      </div>
                      {effectiveVehicleId === v.id && (
                        <CheckCircle className="w-4 h-4 text-primary-500 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tanggal & Quota */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-600">
                {t.departureDate}
              </Label>
              <Input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20"
              />
              {/* Real-time quota feedback */}
              {quotaBadge()}
            </div>

            {/* Jumlah Peserta */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-600">
                  {t.paxCount}
                </Label>
                {quotaInfo && quotaInfo.available > 0 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {t.maxForDate.replace("{count}", quotaInfo.available)}
                  </span>
                )}
              </div>
              <Input
                type="number"
                min={1}
                max={quotaInfo?.available ?? packageData.capacity}
                value={pax}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  const max = quotaInfo?.available ?? packageData.capacity;
                  setPax(Math.min(Math.max(1, val), max));
                }}
                className={`h-11 rounded-xl border-slate-200 focus:border-primary-400 focus:ring-primary-400/20 ${
                  quotaInfo && pax > quotaInfo.available
                    ? "border-red-400 focus:border-red-400"
                    : ""
                }`}
              />
              {/* Tier pricing hint */}
              {packageData.priceTiers.length > 1 && (
                <div className="flex items-start gap-1.5 mt-1">
                  <Info className="w-3 h-3 text-primary-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400">
                    {t.tieredPricingHint}
                  </p>
                </div>
              )}
            </div>

            {/* Payment type selector */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-slate-600">
                {t.paymentMethod}
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

        {/* Error message */}
        {errorMsg && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* ── RIGHT: Summary Card ── */}
      <div className="md:col-span-2 space-y-6">
        <div className="sticky top-24 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-900/10">
          {/* Dark header */}
          <div className="relative bg-slate-900 px-6 py-5 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/15">
                <CreditCard className="w-4 h-4 text-primary-400" />
              </span>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  {t.costSummary}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                  {t.transactionDetail}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white p-6 space-y-5">
            {/* Package name */}
            <div className="pb-3 border-b border-dashed border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.packageLabel}</p>
              <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">
                {(packageData.title as any)?.[locale] || (packageData.title as any)?.id || t.packageLabel}
              </p>
            </div>

            {/* Tier info row */}
            <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-700">{t.pricePerPerson}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.tierLabel.replace("{count}", pax)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">
                  {formatPrice(unitPrice)}
                </p>
                <p className="text-[10px] text-slate-400">{t.perPerson}</p>
              </div>
            </div>

            {/* Pax row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{t.paxLabel}</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                {pax}x
              </span>
            </div>

            {/* Savings badge */}
            {savings > 0 && (
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-green-50 border border-green-100">
                <span className="text-green-600 text-xs">🎉</span>
                <p className="text-[11px] font-bold text-green-700">
                  {t.savingsLabel.replace("{amount}", formatPrice(savings))}
                </p>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                {t.subtotal}
              </span>
              <p className="text-xl font-black text-primary-600">
                {formatPrice(totalPrice)}
              </p>
            </div>

            {/* Payment split box */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.methodLabel}
                </span>
                <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {paymentType === "FULL" ? "LUNAS 100%" : paymentType === "HALF" ? "50%" : "DP 30%"}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-600">{t.payNowLabel}</span>
                <span className="text-xl font-black text-slate-900">
                  {formatPrice(amountToPay)}
                </span>
              </div>
              {paymentType !== "FULL" && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>{t.remainingBill}</span>
                  <span className="font-bold">
                    {formatPrice(totalPrice - amountToPay)}
                  </span>
                </div>
              )}
            </div>

            {/* Quota summary in sidebar */}
            {quotaInfo && date && (
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.availabilityLabel}</p>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      quotaInfo.available === 0 ? "bg-red-500" :
                      quotaInfo.available <= 5 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.max(5, (quotaInfo.booked / quotaInfo.capacity) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-slate-500">{t.registered.replace("{count}", quotaInfo.booked)}</span>
                  <span className="text-[10px] font-bold text-slate-600">{t.remaining.replace("{count}", quotaInfo.available)}</span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Button
              className="w-full h-13 text-sm font-bold gap-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              onClick={handleBooking}
              disabled={isSubmitDisabled}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.processing}
                </>
              ) : isCheckingQuota ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.checkingQuota}
                </>
              ) : quotaInfo?.available === 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  {t.quotaFull}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t.confirmAndPay}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                </>
              )}
            </Button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Shield className="w-3 h-3 text-green-500" />
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                {t.trustBadge}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
      </section>
    </>
  );
}