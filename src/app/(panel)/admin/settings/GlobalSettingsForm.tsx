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
import { Settings, Globe } from "lucide-react";
import type { Locale } from "@/lib/types/cms";

interface LocaleGlobal {
  siteTagline: string;
  metaDesc: string;
}

interface GlobalSettingsFormProps {
  initial: {
    siteName: string;
    logoUrl: string;
    faviconUrl: string;
    id: LocaleGlobal;
    en: LocaleGlobal;
    ms: LocaleGlobal;
  };
}

export function GlobalSettingsForm({ initial }: GlobalSettingsFormProps) {
  const { form, setForm, isPending, isTranslating, startTranslating, saved, save, updateLocale } =
    useCmsForm(initial);

  function handleSave() {
    save(async (data) => {
      await upsertSetting("global", {
        id: { ...data.id, siteName: data.siteName, logoUrl: data.logoUrl, faviconUrl: data.faviconUrl },
        en: { ...data.en, siteName: data.siteName, logoUrl: data.logoUrl, faviconUrl: data.faviconUrl },
        ms: { ...data.ms, siteName: data.siteName, logoUrl: data.logoUrl, faviconUrl: data.faviconUrl },
      });
    });
  }

  function handleAutoTranslate() {
    if (!form.en.siteTagline && !form.en.metaDesc) return;

    startTranslating(async () => {
      const [tagTrans, descTrans] = await Promise.all([
        form.en.siteTagline
          ? translateToAll(form.en.siteTagline)
          : Promise.resolve({ id: "", ms: "" }),
        form.en.metaDesc
          ? translateToAll(form.en.metaDesc)
          : Promise.resolve({ id: "", ms: "" }),
      ]);

      setForm((prev) => ({
        ...prev,
        id: {
          ...prev.id,
          siteTagline: tagTrans.id || prev.id.siteTagline,
          metaDesc: descTrans.id || prev.id.metaDesc,
        },
        ms: {
          ...prev.ms,
          siteTagline: tagTrans.ms || prev.ms.siteTagline,
          metaDesc: descTrans.ms || prev.ms.metaDesc,
        },
      }));
    });
  }

  return (
    <>
      <PageHeader
        title="Pengaturan Global"
        description="Konfigurasi informasi dasar website dan SEO untuk seluruh bahasa"
        action={<SaveButton isPending={isPending} saved={saved} onClick={handleSave} />}
      />

      <div className="space-y-6">
        <FormCard title="Konfigurasi Dasar" icon={Settings}>
          <div className="space-y-1.5">
            <Label>Nama Website</Label>
            <Input
              value={form.siteName}
              onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
              placeholder="Titan Travel"
              className="rounded-md h-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUpload
              label="Logo Website"
              helperText="Format PNG atau SVG transparan direkomendasikan."
              value={form.logoUrl}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, logoUrl: Array.isArray(url) ? url[0] : url }))
              }
            />
            <ImageUpload
              label="Favicon"
              helperText="Format ICO atau PNG (32x32px)."
              value={form.faviconUrl}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, faviconUrl: Array.isArray(url) ? url[0] : url }))
              }
            />
          </div>
        </FormCard>

        <FormCard title="Lokalisasi & SEO" icon={Globe}>
          <LocaleTabs
            onTranslate={handleAutoTranslate}
            isTranslating={isTranslating}
            canTranslate={!!(form.en.siteTagline || form.en.metaDesc)}
          >
            {(lang: Locale) => (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                    Tagline Website ({lang.toUpperCase()})
                  </Label>
                  <Input
                    value={form[lang].siteTagline}
                    onChange={(e) => updateLocale(lang, "siteTagline", e.target.value)}
                    placeholder="Jelajahi Dunia Bersama Kami"
                    className={`rounded-md h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                    Meta Description SEO ({lang.toUpperCase()})
                  </Label>
                  <Textarea
                    rows={4}
                    value={form[lang].metaDesc}
                    onChange={(e) => updateLocale(lang, "metaDesc", e.target.value)}
                    placeholder="Deskripsi singkat website untuk hasil pencarian Google..."
                    className={`rounded-md resize-none text-xs leading-relaxed ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                  />
                  <div className="flex justify-between items-center text-[10px] text-foreground-secondary italic pt-1">
                    <p>Direkomendasikan 150–160 karakter untuk hasil optimal.</p>
                    <p className={form[lang].metaDesc.length > 160 ? "text-red-500 font-extrabold" : "font-medium"}>
                      {form[lang].metaDesc.length} Karakter
                    </p>
                  </div>
                </div>
              </div>
            )}
          </LocaleTabs>
        </FormCard>
      </div>
    </>
  );
}
