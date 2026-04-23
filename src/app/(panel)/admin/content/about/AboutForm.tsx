"use client";

import { PageHeader } from "@/components/panel/PageHeader";
import { SaveButton } from "@/components/panel/SaveButton";
import { LocaleTabs } from "@/components/panel/LocaleTabs";
import { FormCard } from "@/components/panel/FormCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/panel/ImageUpload";
import { upsertSetting } from "@/lib/actions/settings";
import { translateToAll } from "@/lib/actions/translate";
import { useCmsForm } from "@/hooks/useCmsForm";
import { Info, Languages } from "lucide-react";
import type { Locale } from "@/lib/types/cms";

interface LocaleAbout {
  badge: string;
  title1: string;
  title2: string;
  desc1: string;
  desc2: string;
  yearsCard: string;
}

interface AboutFormProps {
  initial: {
    imageUrl: string;
    id: LocaleAbout;
    en: LocaleAbout;
    ms: LocaleAbout;
  };
}

const ABOUT_TEXT_FIELDS = ["badge", "title1", "title2", "desc1", "desc2", "yearsCard"] as const;

export function AboutForm({ initial }: AboutFormProps) {
  const { form, setForm, isPending, isTranslating, startTranslating, saved, save, updateLocale } =
    useCmsForm(initial);

  function handleSave() {
    save(async (data) => {
      await upsertSetting("about", {
        id: { ...data.id, imageUrl: data.imageUrl },
        en: { ...data.en, imageUrl: data.imageUrl },
        ms: { ...data.ms, imageUrl: data.imageUrl },
      });
    });
  }

  function handleAutoTranslate() {
    const source = form.en;
    if (!source.title1 && !source.desc1) return;

    startTranslating(async () => {
      const newId = { ...form.id };
      const newMs = { ...form.ms };

      for (const field of ABOUT_TEXT_FIELDS) {
        if (source[field]) {
          const trans = await translateToAll(source[field]);
          newId[field] = trans.id;
          newMs[field] = trans.ms;
        }
      }

      setForm((prev) => ({ ...prev, id: newId, ms: newMs }));
    });
  }

  return (
    <>
      <PageHeader
        title="Tentang Kami"
        description="Atur konten halaman tentang untuk seluruh bahasa"
        action={<SaveButton isPending={isPending} saved={saved} onClick={handleSave} />}
      />

      <div className="space-y-6">
        <FormCard title="Media Utama" icon={Info}>
          <ImageUpload
            label="Foto Utama Tentang Kami"
            helperText="Rasio 4:3 direkomendasikan."
            aspectRatio={4 / 3}
            value={form.imageUrl}
            onChange={(url) =>
              setForm((prev) => ({ ...prev, imageUrl: Array.isArray(url) ? url[0] : url }))
            }
          />
        </FormCard>

        <LocaleTabs
          onTranslate={handleAutoTranslate}
          isTranslating={isTranslating}
          canTranslate={!!(form.en.title1 || form.en.desc1)}
        >
          {(lang: Locale) => (
            <FormCard>
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-sm">Informasi Dasar ({lang.toUpperCase()})</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Badge Text</Label>
                    <Input
                      value={form[lang].badge}
                      onChange={(e) => updateLocale(lang, "badge", e.target.value)}
                      placeholder="Tentang Kami"
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Years Greeting</Label>
                    <Input
                      value={form[lang].yearsCard}
                      onChange={(e) => updateLocale(lang, "yearsCard", e.target.value)}
                      placeholder="Tahun Melayani Wisatawan"
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Judul Baris 1</Label>
                    <Input
                      value={form[lang].title1}
                      onChange={(e) => updateLocale(lang, "title1", e.target.value)}
                      placeholder="CV Titan Jaya"
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Judul Baris 2</Label>
                    <Input
                      value={form[lang].title2}
                      onChange={(e) => updateLocale(lang, "title2", e.target.value)}
                      placeholder="Travelindo"
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Deskripsi Paragraf 1</Label>
                  <Textarea
                    rows={3}
                    value={form[lang].desc1}
                    onChange={(e) => updateLocale(lang, "desc1", e.target.value)}
                    className="rounded-md"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Deskripsi Paragraf 2</Label>
                  <Textarea
                    rows={3}
                    value={form[lang].desc2}
                    onChange={(e) => updateLocale(lang, "desc2", e.target.value)}
                    className="rounded-md"
                  />
                </div>
              </div>
            </FormCard>
          )}
        </LocaleTabs>
      </div>
    </>
  );
}
