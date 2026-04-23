"use client";
import NextImage from "next/image";

import { useState, useTransition, useEffect } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { ConfirmDialog } from "@/components/panel/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createPackage,
  deletePackage,
  togglePackagePublish,
  updatePackage,
} from "@/lib/actions/packages";
import { translateToAll } from "@/lib/actions/translate";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Clock,
  Users,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  Sparkles,
  Scale,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/panel/ImageUpload";

type PackageContent = {
  id: string;
  en: string;
  ms: string;
};

type Package = {
  id: string;
  slug: string;
  title: PackageContent;
  description?: PackageContent | null;
  location: PackageContent;
  duration: PackageContent;
  capacity: PackageContent;
  price: number;
  originalPrice?: number | null;
  facilityScore: number;
  departureScore: number;
  durationDays: number;
  images: string[];
  isPublished: boolean;
  priceTiers: {
    minPax: number;
    maxPax: number;
    price: number | string;
    originalPrice?: number | string | null;
  }[];
  createdAt: Date;
};

const emptyForm = {
  titleId: "",
  titleEn: "",
  titleMs: "",
  descId: "",
  descEn: "",
  descMs: "",
  locationId: "",
  locationEn: "",
  locationMs: "",
  durationId: "",
  durationEn: "",
  durationMs: "",
  capacityId: "",
  capacityEn: "",
  capacityMs: "",
  facilityScore: 3,
  departureScore: 1,
  durationDays: 1,
  images: [] as string[],
  isPublished: false,
  priceTiers: [] as {
    minPax: number;
    maxPax: number;
    price: string;
    originalPrice: string;
  }[],
};

interface PackagesClientProps {
  initialPackages: Package[];
}

export function PackagesClient({ initialPackages }: PackagesClientProps) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, setIsTranslating] = useState(false);
  const router = useRouter();

  // Sinkronisasi state saat data dari server berubah
  useEffect(() => {
    setPackages(initialPackages);
  }, [initialPackages]);

  const refresh = () => router.refresh();

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(pkg: Package) {
    setEditing(pkg);
    const desc = pkg.description;
    setForm({
      titleId: pkg.title.id,
      titleEn: pkg.title.en,
      titleMs: pkg.title.ms || pkg.title.en,
      descId: desc?.id ?? "",
      descEn: desc?.en ?? "",
      descMs: desc?.ms ?? desc?.en ?? "",
      locationId: pkg.location.id,
      locationEn: pkg.location.en,
      locationMs: pkg.location.ms || pkg.location.en,
      durationId: pkg.duration.id,
      durationEn: pkg.duration.en,
      durationMs: pkg.duration.ms || pkg.duration.en,
      capacityId: pkg.capacity.id,
      capacityEn: pkg.capacity.en,
      capacityMs: pkg.capacity.ms || pkg.capacity.en,
      facilityScore: pkg.facilityScore,
      departureScore: pkg.departureScore,
      durationDays: pkg.durationDays,
      images: pkg.images || [],
      isPublished: pkg.isPublished,
      priceTiers: (pkg.priceTiers || []).map((t) => ({
        minPax: t.minPax,
        maxPax: t.maxPax,
        price: String(t.price),
        originalPrice: t.originalPrice ? String(t.originalPrice) : "",
      })),
    });
    setOpen(true);
  }

  async function handleAutoTranslate() {
    if (!form.titleEn) return;

    setIsTranslating(true);
    try {
      const [
        titleTrans,
        locationTrans,
        durationTrans,
        capacityTrans,
        descTrans,
      ] = await Promise.all([
        form.titleEn
          ? translateToAll(form.titleEn)
          : Promise.resolve({ id: "", ms: "" }),
        form.locationEn
          ? translateToAll(form.locationEn)
          : Promise.resolve({ id: "", ms: "" }),
        form.durationEn
          ? translateToAll(form.durationEn)
          : Promise.resolve({ id: "", ms: "" }),
        form.capacityEn
          ? translateToAll(form.capacityEn)
          : Promise.resolve({ id: "", ms: "" }),
        form.descEn
          ? translateToAll(form.descEn)
          : Promise.resolve({ id: "", ms: "" }),
      ]);

      setForm((prev) => ({
        ...prev,
        titleId: titleTrans.id || prev.titleId,
        titleMs: titleTrans.ms || prev.titleMs,
        locationId: locationTrans.id || prev.locationId,
        locationMs: locationTrans.ms || prev.locationMs,
        durationId: durationTrans.id || prev.durationId,
        durationMs: durationTrans.ms || prev.durationMs,
        capacityId: capacityTrans.id || prev.capacityId,
        capacityMs: capacityTrans.ms || prev.capacityMs,
        descId: descTrans.id || prev.descId,
        descMs: descTrans.ms || prev.descMs,
      }));
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  }

  function handleSubmit() {
    const payload = {
      titleId: form.titleId,
      titleEn: form.titleEn,
      titleMs: form.titleMs,
      descId: form.descId,
      descEn: form.descEn,
      descMs: form.descMs,
      locationId: form.locationId,
      locationEn: form.locationEn,
      locationMs: form.locationMs,
      durationId: form.durationId,
      durationEn: form.durationEn,
      durationMs: form.durationMs,
      capacityId: form.capacityId,
      capacityEn: form.capacityEn,
      capacityMs: form.capacityMs,
      facilityScore: form.facilityScore,
      departureScore: form.departureScore,
      durationDays: form.durationDays,
      images: form.images,
      isPublished: form.isPublished,
      priceTiers: form.priceTiers.map((t) => ({
        minPax: Number(t.minPax),
        maxPax: Number(t.maxPax),
        price: Number(t.price),
        originalPrice: t.originalPrice ? Number(t.originalPrice) : undefined,
      })),
    };

    startTransition(async () => {
      if (editing) {
        await updatePackage(editing.id, payload);
      } else {
        await createPackage(payload);
      }
      setOpen(false);
      refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      refresh();
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await togglePackagePublish(id, !current);
      refresh();
    });
  }

  const f = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function addTier() {
    f("priceTiers", [
      ...form.priceTiers,
      { minPax: 1, maxPax: 99, price: "", originalPrice: "" },
    ]);
  }

  function removeTier(index: number) {
    f(
      "priceTiers",
      form.priceTiers.filter((_, i) => i !== index),
    );
  }

  function updateTier(index: number, field: string, value: string) {
    const newTiers = [...form.priceTiers];
    const tier = { ...newTiers[index], [field]: value };

    // Logika Smart Discount: Jika input di kolom 'price' diawali dengan '%'
    if (field === "price" && value.startsWith("%")) {
      const originalPrice = Number(tier.originalPrice);
      if (originalPrice > 0) {
        const percent = parseFloat(value.replace("%", ""));
        if (!isNaN(percent)) {
          const discountedPrice = Math.round(
            originalPrice - (originalPrice * percent) / 100,
          );
          tier.price = discountedPrice.toString();
        }
      }
    }

    newTiers[index] = tier;
    f("priceTiers", newTiers);
  }

  return (
    <>
      <PageHeader
        title="Paket Wisata"
        description="Kelola paket perjalanan dengan rincian dalam 3 bahasa (ID, EN, MS)"
        action={
          <Button
            onClick={openCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white gap-2 rounded-md shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Paket
          </Button>
        }
      />

      {/* Table Section */}
      <div className="rounded-md border border-card-border bg-card-bg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-foreground-secondary space-y-4">
            <Tag className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-sm font-medium">
              Belum ada paket wisata. Tambahkan yang pertama!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                    Paket
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px] hidden md:table-cell">
                    Lokasi
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px] hidden lg:table-cell">
                    Durasi
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                    Harga
                  </th>
                  <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                    Status
                  </th>
                  <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {packages.map((pkg) => {
                  const title = pkg.title;
                  const location = pkg.location;
                  const duration = pkg.duration;
                  return (
                    <tr
                      key={pkg.id}
                      className="group hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0 relative">
                            {pkg.images?.[0] ? (
                              <NextImage
                                src={pkg.images[0]}
                                alt={title.id || "Package"}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 m-3 text-muted-foreground/40" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[200px]">
                              {title.id}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-foreground-secondary truncate max-w-[150px]">
                                {title.en}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground-secondary hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">
                            {location.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground-secondary hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{duration.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-bold text-primary-600">
                            Rp {Number(pkg.price).toLocaleString("id-ID")}
                          </p>
                          {pkg.originalPrice &&
                            Number(pkg.originalPrice) > 0 && (
                              <p className="text-[10px] text-muted-foreground line-through decoration-red-400/50">
                                Rp{" "}
                                {Number(pkg.originalPrice).toLocaleString(
                                  "id-ID",
                                )}
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggle(pkg.id, pkg.isPublished)}
                          disabled={isPending}
                          className="focus:outline-none"
                        >
                          <Badge
                            variant="secondary"
                            className={`rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1 border transition-colors ${
                              pkg.isPublished
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-muted text-muted-foreground border-transparent"
                            }`}
                          >
                            {pkg.isPublished ? (
                              <>
                                <Eye className="w-2.5 h-2.5" /> Publik
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-2.5 h-2.5" /> Draft
                              </>
                            )}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md text-muted-foreground hover:text-primary-500 hover:bg-primary-50"
                            onClick={() => openEdit(pkg)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            }
                            onConfirm={() => handleDelete(pkg.id)}
                          />
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

      {/* Modern Form Drawer/Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-md shadow-2xl flex flex-col max-h-[92vh]">
          <DialogHeader className="p-6 bg-muted/30 border-b border-card-border shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary-500" />
              {editing ? "Edit Detail Paket" : "Buat Paket Wisata Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-0">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* --- KOLOM KIRI: MAIN CONTENT (7/12) --- */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Detail Informasi & Deskripsi
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAutoTranslate}
                      disabled={isTranslating || !form.titleEn}
                      className="h-7 text-[10px] gap-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 border border-primary-100"
                    >
                      {isTranslating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      Auto-Translate
                    </Button>
                  </div>

                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-10 p-1 bg-muted/30 rounded-md mb-6">
                      <TabsTrigger
                        value="en"
                        className="text-[10px] rounded-sm uppercase font-bold"
                      >
                        EN (Source)
                      </TabsTrigger>
                      <TabsTrigger
                        value="id"
                        className="text-[10px] rounded-sm uppercase font-bold"
                      >
                        ID
                      </TabsTrigger>
                      <TabsTrigger
                        value="ms"
                        className="text-[10px] rounded-sm uppercase font-bold"
                      >
                        MS
                      </TabsTrigger>
                    </TabsList>

                    {(["en", "id", "ms"] as const).map((lang) => {
                      const L = lang.charAt(0).toUpperCase() + lang.slice(1);
                      const titleKey = `title${L}` as keyof typeof form;
                      const locationKey = `location${L}` as keyof typeof form;
                      const durationKey = `duration${L}` as keyof typeof form;
                      const capacityKey = `capacity${L}` as keyof typeof form;
                      const descKey = `desc${L}` as keyof typeof form;

                      return (
                        <TabsContent
                          key={lang}
                          value={lang}
                          className="mt-0 space-y-6 animate-in fade-in-50 duration-300"
                        >
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                              Judul Paket ({lang.toUpperCase()})
                            </Label>
                            <Input
                              value={form[titleKey] as string}
                              onChange={(e) => f(titleKey, e.target.value)}
                              placeholder={`Judul paket dalam bahasa ${lang}`}
                              className={`rounded-md font-bold h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-primary-500" />
                                <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                                  Lokasi
                                </Label>
                              </div>
                              <Input
                                value={form[locationKey] as string}
                                onChange={(e) => f(locationKey, e.target.value)}
                                placeholder="Bali, Indonesia"
                                className={`rounded-md h-9 text-xs ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-primary-500" />
                                <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                                  Durasi
                                </Label>
                              </div>
                              <Input
                                value={form[durationKey] as string}
                                onChange={(e) => f(durationKey, e.target.value)}
                                placeholder="3D 2N"
                                className={`rounded-md h-9 text-xs ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3 h-3 text-primary-500" />
                              <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                                Kapasitas
                              </Label>
                            </div>
                            <Input
                              value={form[capacityKey] as string}
                              onChange={(e) => f(capacityKey, e.target.value)}
                              placeholder="Min. 2 Pax / Unlimited"
                              className={`rounded-md h-9 text-xs ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                              Deskripsi Perjalanan ({lang.toUpperCase()})
                            </Label>
                            <Textarea
                              rows={8}
                              value={form[descKey] as string}
                              onChange={(e) => f(descKey, e.target.value)}
                              placeholder={`Jelaskan aktivitas atau keunggulan paket ini dalam bahasa ${lang}...`}
                              className={`rounded-md text-xs resize-none leading-relaxed ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                            />
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Galeri Visual
                    </Label>
                    <ImageUpload
                      label="Foto Paket"
                      helperText="Pilih beberapa foto terbaik."
                      multiple
                      aspectRatio={16 / 9}
                      value={form.images}
                      onChange={(urls) => f("images", urls)}
                    />
                  </div>

                  <div className="p-5 rounded-xl bg-muted/20 border border-card-border space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Status Paket
                    </Label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-card-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={form.isPublished}
                          onCheckedChange={(val) => f("isPublished", val)}
                        />
                        <Label className="text-xs font-medium cursor-pointer">
                          Publikasikan Paket
                        </Label>
                      </div>
                      {form.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 text-[9px]">
                          Live
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-2 py-0.5 text-[9px]">
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- KOLOM KANAN: SIDEBAR (5/12) --- */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Tiered Pricing Section */}
                  <div className="p-5 rounded-xl bg-muted/20 border border-card-border space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary-500" />
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Harga & Diskon
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addTier}
                        className="h-7 text-[9px] gap-1 text-primary-600 px-3 border border-primary-100 bg-primary-50/50"
                      >
                        <Plus className="w-3 h-3" /> Tambah Tier
                      </Button>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <p className="text-[9px] text-amber-700 leading-relaxed italic">
                        <strong>Tips:</strong> Kamu bisa ketik{" "}
                        <code className="bg-amber-100 px-1 rounded text-amber-900 font-bold">
                          %
                        </code>{" "}
                        di kolom Harga Promo (cth:{" "}
                        <code className="bg-amber-100 px-1 rounded text-amber-900 font-bold">
                          %10
                        </code>
                        ) untuk hitung otomatis dari Harga Asli.
                      </p>
                    </div>

                    {form.priceTiers.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                        Belum ada tier harga.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {form.priceTiers.map((tier, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-card-bg border border-card-border shadow-sm space-y-3 relative group/tier"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-[9px] text-muted-foreground">
                                  Min Pax
                                </Label>
                                <Input
                                  type="number"
                                  value={tier.minPax}
                                  onChange={(e) =>
                                    updateTier(idx, "minPax", e.target.value)
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[9px] text-muted-foreground">
                                  Max Pax
                                </Label>
                                <Input
                                  type="number"
                                  value={tier.maxPax}
                                  onChange={(e) =>
                                    updateTier(idx, "maxPax", e.target.value)
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-[9px] text-muted-foreground">
                                  Harga Asli (Coret)
                                </Label>
                                <Input
                                  type="number"
                                  value={tier.originalPrice as string}
                                  onChange={(e) =>
                                    updateTier(
                                      idx,
                                      "originalPrice",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-xs"
                                  placeholder="Cth: 1000000"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[9px] text-muted-foreground">
                                  Harga Promo / %
                                </Label>
                                <Input
                                  type="text"
                                  value={tier.price}
                                  onChange={(e) =>
                                    updateTier(idx, "price", e.target.value)
                                  }
                                  className="h-8 text-xs border-primary-200"
                                  placeholder="% atau Rp"
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTier(idx)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md border border-red-100 text-red-500 hover:bg-red-50"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-xl bg-primary-500/5 border border-primary-500/20 space-y-5">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary-500" />
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                        Skor Rekomendasi TOPSIS
                      </Label>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-tighter">
                            Kualitas Fasilitas
                          </Label>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-500 text-white">
                            {form.facilityScore} / 5
                          </span>
                        </div>
                        <Input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={form.facilityScore}
                          onChange={(e) =>
                            f("facilityScore", parseInt(e.target.value))
                          }
                          className="h-6 cursor-pointer accent-primary-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-tighter">
                          Waktu Keberangkatan
                        </Label>
                        <select
                          value={form.departureScore}
                          onChange={(e) =>
                            f("departureScore", parseInt(e.target.value))
                          }
                          className="w-full bg-white border border-card-border rounded-md h-9 px-3 text-xs outline-none focus:border-primary-500 shadow-sm"
                        >
                          <option value={1}>Pagi (Optimalkan Cepat)</option>
                          <option value={2}>Siang (Standar)</option>
                          <option value={3}>Malam (Santai)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-tighter">
                          Durasi Perjalanan (Hari)
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="1"
                            value={form.durationDays}
                            onChange={(e) =>
                              f("durationDays", parseInt(e.target.value))
                            }
                            className="rounded-md h-9 pl-9"
                          />
                          <Clock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex justify-end gap-3 p-6 bg-muted/30 border-t border-card-border">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-md text-xs tracking-wider uppercase font-bold px-6 h-10"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary-500 hover:bg-primary-600 text-white min-w-[150px] rounded-md shadow-md text-xs tracking-wider uppercase font-bold h-10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {editing ? "Simpan Perubahan" : "Buat Paket"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
