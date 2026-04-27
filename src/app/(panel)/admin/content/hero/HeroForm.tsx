"use client";

import { PageHeader } from "@/components/panel/PageHeader";
import { SaveButton } from "@/components/panel/SaveButton";
import { LocaleTabs } from "@/components/panel/LocaleTabs";
import { FormCard } from "@/components/panel/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/panel/ImageUpload";
import { upsertSetting } from "@/lib/actions/settings";
import { translateToAll, translateText } from "@/lib/actions/translate";
import { useCmsForm } from "@/hooks/useCmsForm";
import { Languages, Plus, Trash2 } from "lucide-react";
import type { Locale } from "@/lib/types/cms";

interface StatItem {
  label: string;
  value: string;
}

interface LocaleHero {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  stats: StatItem[];
}

interface HeroFormProps {
  initial: {
    imageUrl: string;
    id: LocaleHero;
    en: LocaleHero;
    ms: LocaleHero;
  };
}

const HERO_TEXT_FIELDS = ["badge", "title1", "title2", "subtitle", "cta1", "cta2"] as const;

export function HeroForm({ initial }: HeroFormProps) {
  const { form, setForm, isPending, isTranslating, startTranslating, saved, save, updateLocale } =
    useCmsForm(initial);

  function handleSave() {
    save(async (data) => {
      await upsertSetting("hero", {
        id: { ...data.id, imageUrl: data.imageUrl },
        en: { ...data.en, imageUrl: data.imageUrl },
        ms: { ...data.ms, imageUrl: data.imageUrl },
      });
    });
  }

  function handleAutoTranslate() {
    const source = form.en;
    if (!source.title1 && !source.subtitle) return;

    startTranslating(async () => {
      const newId = { ...form.id };
      const newMs = { ...form.ms };

      for (const field of HERO_TEXT_FIELDS) {
        if (source[field]) {
          const trans = await translateToAll(source[field]);
          newId[field] = trans.id;
          newMs[field] = trans.ms;
        }
      }

      // Translate stat labels only (values like "500+" stay the same)
      if (source.stats.length > 0) {
        newId.stats = await Promise.all(
          source.stats.map(async (s) => ({
            value: s.value,
            label: s.label ? await translateText(s.label, "id") : "",
          }))
        );
        newMs.stats = await Promise.all(
          source.stats.map(async (s) => ({
            value: s.value,
            label: s.label ? await translateText(s.label, "ms") : "",
          }))
        );
      }

      setForm((prev) => ({ ...prev, id: newId, ms: newMs }));
    });
  }

  const updateStat = (lang: Locale, index: number, field: keyof StatItem, val: string) => {
    setForm((prev) => {
      const stats = [...prev[lang].stats];
      stats[index] = { ...stats[index], [field]: val };
      return { ...prev, [lang]: { ...prev[lang], stats } };
    });
  };

  const addStat = (lang: Locale) => {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], stats: [...prev[lang].stats, { label: "", value: "" }] },
    }));
  };

  const removeStat = (lang: Locale, index: number) => {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], stats: prev[lang].stats.filter((_, i) => i !== index) },
    }));
  };

  return (
    <>
      <PageHeader
        title="Hero Banner"
        description="Atur tampilan utama halaman beranda dan statistik pencapaian"
        action={<SaveButton isPending={isPending} saved={saved} onClick={handleSave} />}
      />

      <div className="space-y-6">
        <FormCard title="Media & Pengaturan Utama" icon={Languages}>
          <ImageUpload
            label="Gambar Latar Belakang (Hero)"
            helperText="Rasio 21:9 atau 16:9 direkomendasikan."
            aspectRatio={21 / 9}
            value={form.imageUrl}
            onChange={(url) =>
              setForm((prev) => ({ ...prev, imageUrl: Array.isArray(url) ? url[0] : url }))
            }
          />
        </FormCard>

        <LocaleTabs
          onTranslate={handleAutoTranslate}
          isTranslating={isTranslating}
          canTranslate={!!(form.en.title1 || form.en.subtitle)}
        >
          {(lang: Locale) => (
            <>
              <FormCard className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-4 h-4 text-primary-500" />
                  <h3 className="font-semibold text-sm">Teks Konten ({lang.toUpperCase()})</h3>
                </div>

                <div className="space-y-1.5">
                  <Label>Badge Text ({lang.toUpperCase()})</Label>
                  <Input
                    value={form[lang].badge}
                    onChange={(e) => updateLocale(lang, "badge", e.target.value)}
                    placeholder="⭐ Layanan Wisata Terpercaya #1"
                    className="rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Judul Bagian 1 ({lang.toUpperCase()})</Label>
                    <Input
                      value={form[lang].title1}
                      onChange={(e) => updateLocale(lang, "title1", e.target.value)}
                      placeholder="Jelajahi Dunia"
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Judul Bagian 2 ({lang.toUpperCase()})</Label>
                    <Input
                      value={form[lang].title2}
                      onChange={(e) => updateLocale(lang, "title2", e.target.value)}
                      placeholder="Bersama Titan Travel"
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Subjudul ({lang.toUpperCase()})</Label>
                  <Textarea
                    rows={3}
                    value={form[lang].subtitle}
                    onChange={(e) => updateLocale(lang, "subtitle", e.target.value)}
                    placeholder="Temukan pengalaman perjalanan yang tak terlupakan..."
                    className="rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tombol CTA 1 ({lang.toUpperCase()})</Label>
                    <Input
                      value={form[lang].cta1}
                      onChange={(e) => updateLocale(lang, "cta1", e.target.value)}
                      placeholder="Lihat Paket Wisata"
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tombol CTA 2 ({lang.toUpperCase()})</Label>
                    <Input
                      value={form[lang].cta2}
                      onChange={(e) => updateLocale(lang, "cta2", e.target.value)}
                      placeholder="Hubungi Kami"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </FormCard>

              {/* Stats */}
              <FormCard className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Statistik Pencapaian ({lang.toUpperCase()})</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Tampil di bagian bawah hero banner. Nilai angka sama di semua bahasa, hanya label yang diterjemahkan.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addStat(lang)}
                    className="gap-1.5 rounded-md h-8 text-[11px] shrink-0"
                  >
                    <Plus className="w-3 h-3" /> Tambah
                  </Button>
                </div>

                <div className="space-y-3">
                  {form[lang].stats.map((stat, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-3 border border-dashed border-card-border rounded-md hover:border-primary-200 transition-colors"
                    >
                      <div className="sm:col-span-3 space-y-1.5">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                          Nilai
                        </Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStat(lang, i, "value", e.target.value)}
                          placeholder="500+"
                          className="h-9 rounded-md"
                        />
                      </div>
                      <div className="sm:col-span-8 space-y-1.5">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                          Label
                        </Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(lang, i, "label", e.target.value)}
                          placeholder="Pelanggan Puas"
                          className="h-9 rounded-md"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md"
                          onClick={() => removeStat(lang, i)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {form[lang].stats.length === 0 && (
                    <p className="text-center text-xs text-foreground-secondary py-6 italic">
                      Belum ada statistik. Klik &quot;Tambah&quot; untuk menambahkan.
                    </p>
                  )}
                </div>
              </FormCard>
            </>
          )}
        </LocaleTabs>
      </div>
    </>
  );
}
