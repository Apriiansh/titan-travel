"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/panel/ImageUpload";
import {
  MapPin,
  Clock,
  Users,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import { PackageFormState } from "../types";
import { PriceTierSection } from "./PriceTierSection";
import { TopsisScoreSection } from "./TopsisScoreSection";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

type VehicleType = { id: string; name: string };

interface PackageFormProps {
  form: PackageFormState;
  isTranslating: boolean;
  vehicleTypes: VehicleType[];
  onFieldChange: (field: string, value: any) => void;
  onAutoTranslate: () => void;
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
  onUpdateTier: (index: number, field: string, value: string) => void;
}

export function PackageForm({
  form,
  isTranslating,
  vehicleTypes,
  onFieldChange,
  onAutoTranslate,
  onAddTier,
  onRemoveTier,
  onUpdateTier,
}: PackageFormProps) {
  const { dObj, locale } = useLocale();
  const t = dObj(translations).adminPanel.packages.form;

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- KOLOM KIRI: MAIN CONTENT (7/12) --- */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t?.sections?.info || "Detail Informasi & Deskripsi"}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAutoTranslate}
              disabled={isTranslating || !form.titleEn}
              className="h-7 text-[10px] gap-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 border border-primary-100"
            >
              {isTranslating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {t?.actions?.autoTranslate || "Auto-Translate"}
            </Button>
          </div>

          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-10 p-1 bg-muted/30 rounded-md mb-6">
              <TabsTrigger
                value="en"
                className="text-[10px] rounded-sm uppercase font-bold"
              >
                EN ({locale === "id" ? "Sumber" : locale === "ms" ? "Sumber" : "Source"})
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
              const titleKey = `title${L}` as keyof PackageFormState;
              const locationKey = `location${L}` as keyof PackageFormState;
              const durationKey = `duration${L}` as keyof PackageFormState;
              const descKey = `desc${L}` as keyof PackageFormState;

              return (
                <TabsContent
                  key={lang}
                  value={lang}
                  className="mt-0 space-y-6 animate-in fade-in-50 duration-300"
                >
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                      {t?.fields?.title?.replace("{lang}", lang.toUpperCase()) || `Judul Paket (${lang.toUpperCase()})`}
                    </Label>
                    <Input
                      value={form[titleKey] as string}
                      onChange={(e) => onFieldChange(titleKey, e.target.value)}
                      placeholder={t?.placeholders?.title?.replace("{lang}", lang) || `Judul paket dalam bahasa ${lang}`}
                      className={`rounded-md font-bold h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary-500" />
                        <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                          {t?.fields?.location || "Lokasi"}
                        </Label>
                      </div>
                      <Input
                        value={form[locationKey] as string}
                        onChange={(e) =>
                          onFieldChange(locationKey, e.target.value)
                        }
                        placeholder={t?.placeholders?.location || "Bali, Indonesia"}
                        className={`rounded-md h-9 text-xs ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-primary-500" />
                        <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                          {t?.fields?.duration || "Durasi"}
                        </Label>
                      </div>
                      <Input
                        value={form[durationKey] as string}
                        onChange={(e) =>
                          onFieldChange(durationKey, e.target.value)
                        }
                        placeholder={t?.placeholders?.duration || "3D 2N"}
                        className={`rounded-md h-9 text-xs ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                      {t?.fields?.description?.replace("{lang}", lang.toUpperCase()) || `Deskripsi Perjalanan (${lang.toUpperCase()})`}
                    </Label>
                    <Textarea
                      rows={8}
                      value={form[descKey] as string}
                      onChange={(e) => onFieldChange(descKey, e.target.value)}
                      placeholder={t?.placeholders?.description?.replace("{lang}", lang) || `Jelaskan aktivitas atau keunggulan paket ini dalam bahasa ${lang}...`}
                      className={`rounded-md text-xs resize-none leading-relaxed ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                    />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="p-5 rounded-xl bg-muted/20 border border-card-border space-y-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary-500" />
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                {t?.sections?.capacity || "Kapasitas Peserta (Maksimal)"}
              </Label>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) =>
                  onFieldChange("capacity", parseInt(e.target.value) || 0)
                }
                placeholder={t?.placeholders?.capacity || "Contoh: 10"}
                className="rounded-md font-bold text-lg h-12 w-32 border-primary-100"
              />
              <p className="text-sm text-muted-foreground font-medium">
                {t?.fields?.capacityUnit || "Peserta / Orang"}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground italic leading-tight">
              {t?.notes?.capacity || "*User tidak akan bisa memesan lebih dari kapasitas ini untuk satu tanggal keberangkatan."}
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t?.sections?.visuals || "Galeri Visual"}
            </Label>
            <ImageUpload
              label={t?.fields?.images || "Foto Paket"}
              helperText={t?.fields?.imagesHelper || "Pilih beberapa foto terbaik."}
              multiple
              aspectRatio={16 / 9}
              value={form.images}
              onChange={(urls) => onFieldChange("images", urls)}
            />
          </div>
        </div>

        {/* --- KOLOM KANAN: SIDEBAR (5/12) --- */}
        <div className="lg:col-span-5 space-y-6">
          <PriceTierSection
            priceTiers={form.priceTiers}
            vehicleTypes={vehicleTypes}
            onAddTier={onAddTier}
            onRemoveTier={onRemoveTier}
            onUpdateTier={onUpdateTier}
          />

          <TopsisScoreSection
            facilityScore={form.facilityScore}
            departureScore={form.departureScore}
            durationDays={form.durationDays}
            onChange={onFieldChange}
          />

          {/* --- RATING & REVIEWS --- */}
          <div className="p-5 rounded-2xl bg-white border border-card-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <Label className="text-sm font-bold text-slate-900 block">
                {t?.sections?.social || "Rating & Ulasan (Social Proof)"}
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                  {t?.fields?.rating || "Rating (1-5)"}
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={form.rating ?? 0}
                  onChange={(e) =>
                    onFieldChange("rating", parseFloat(e.target.value) || 0)
                  }
                  placeholder="4.8"
                  className="h-9 text-xs rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                  {t?.fields?.reviews || "Total Ulasan"}
                </Label>
                <Input
                  type="number"
                  value={form.reviews ?? 0}
                  onChange={(e) =>
                    onFieldChange("reviews", parseInt(e.target.value) || 0)
                  }
                  placeholder="120"
                  className="h-9 text-xs rounded-md"
                />
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground italic leading-tight">
              {t?.notes?.social || "* Nilai ini akan tampil sebagai rating bintang di halaman paket."}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-muted/20 border border-card-border space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t?.sections?.status || "Status Paket"}
            </Label>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-card-border shadow-sm">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(val) => onFieldChange("isPublished", val)}
                />
                <Label className="text-xs font-medium cursor-pointer">
                  {t?.fields?.publish || "Publikasikan Paket"}
                </Label>
              </div>
              {form.isPublished ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 text-[9px]">
                  {dObj(translations).adminPanel.packages.status.live || "Live"}
                </Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-2 py-0.5 text-[9px]">
                  {dObj(translations).adminPanel.packages.status.draft || "Draft"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
