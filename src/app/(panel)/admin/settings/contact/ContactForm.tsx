"use client";

import { PageHeader } from "@/components/panel/PageHeader";
import { SaveButton } from "@/components/panel/SaveButton";
import { LocaleTabs } from "@/components/panel/LocaleTabs";
import { FormCard } from "@/components/panel/FormCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertSetting } from "@/lib/actions/settings";
import { translateToAll } from "@/lib/actions/translate";
import { useCmsForm } from "@/hooks/useCmsForm";
import { Phone, Languages } from "lucide-react";
import type { Locale } from "@/lib/types/cms";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

interface LocaleContact {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  address: string;
  officeHours: string;
}

interface ContactFormProps {
  initial: {
    whatsapp: string;
    email: string;
    mapsEmbed: string;
    id: LocaleContact;
    en: LocaleContact;
    ms: LocaleContact;
  };
}

const CONTACT_FIELDS = ["badge", "title1", "title2", "subtitle", "address", "officeHours"] as const;

export function ContactForm({ initial }: ContactFormProps) {
  const { form, setForm, isPending, isTranslating, startTranslating, saved, save, updateLocale } =
    useCmsForm(initial);
  const { dObj } = useLocale();
  const t = dObj(translations).adminPanel.contactSettings;

  function handleSave() {
    save(async (data) => {
      await upsertSetting("contact", {
        id: { ...data.id, whatsapp: data.whatsapp, email: data.email, mapsEmbed: data.mapsEmbed },
        en: { ...data.en, whatsapp: data.whatsapp, email: data.email, mapsEmbed: data.mapsEmbed },
        ms: { ...data.ms, whatsapp: data.whatsapp, email: data.email, mapsEmbed: data.mapsEmbed },
      });
    });
  }

  function handleAutoTranslate() {
    const en = form.en;
    if (!en.badge && !en.title1) return;

    startTranslating(async () => {
      const newId = { ...form.id };
      const newMs = { ...form.ms };

      for (const field of CONTACT_FIELDS) {
        if (en[field]) {
          const trans = await translateToAll(en[field]);
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
        title={t?.title || "Info Kontak"}
        description={t?.description || "Atur informasi kontak, alamat, dan jam operasional untuk seluruh bahasa"}
        action={<SaveButton isPending={isPending} saved={saved} onClick={handleSave} />}
      />

      <div className="space-y-6">
        <FormCard title={t?.globalSection?.title || "Kontak & Media Sosial Utama"} icon={Phone}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {t?.globalSection?.whatsappLabel || "Nomor WhatsApp (Global)"}
              </Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="62852XXXXXXXX"
                className="rounded-md h-10"
              />
              <p className="text-[10px] text-foreground-secondary italic">
                {t?.globalSection?.whatsappHint || "Gunakan format kode negara (misal 62)"}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {t?.globalSection?.emailLabel || "Email (Global)"}
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="info@titantravel.com"
                className="rounded-md h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t?.globalSection?.mapsLabel || "Google Maps Embed URL (Global)"}
            </Label>
            <Input
              value={form.mapsEmbed}
              onChange={(e) => setForm((prev) => ({ ...prev, mapsEmbed: e.target.value }))}
              placeholder="https://www.google.com/maps/embed?..."
              className="rounded-md h-10"
            />
            <p className="text-[10px] text-foreground-secondary italic">
              {t?.globalSection?.mapsHint || 'Ambil dari menu Share > Embed a map di Google Maps'}
            </p>
          </div>
        </FormCard>

        <FormCard title={t?.localizationSection?.title || "Lokalisasi Konten Kontak"} icon={Languages}>
          <LocaleTabs
            onTranslate={handleAutoTranslate}
            isTranslating={isTranslating}
            canTranslate={!!(form.en.badge || form.en.title1)}
          >
            {(lang: Locale) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                      {t?.localizationSection?.badgeLabel?.replace("{lang}", lang.toUpperCase()) || `Badge Text (${lang.toUpperCase()})`}
                    </Label>
                    <Input
                      value={form[lang].badge}
                      onChange={(e) => updateLocale(lang, "badge", e.target.value)}
                      placeholder={t?.localizationSection?.placeholders?.badge || "Hubungi Kami"}
                      className={`rounded-md h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                        {t?.localizationSection?.title1Label?.replace("{lang}", lang.toUpperCase()) || `Judul Baris 1 (${lang.toUpperCase()})`}
                      </Label>
                      <Input
                        value={form[lang].title1}
                        onChange={(e) => updateLocale(lang, "title1", e.target.value)}
                        className={`rounded-md h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                        {t?.localizationSection?.title2Label?.replace("{lang}", lang.toUpperCase()) || `Judul Baris 2 (${lang.toUpperCase()})`}
                      </Label>
                      <Input
                        value={form[lang].title2}
                        onChange={(e) => updateLocale(lang, "title2", e.target.value)}
                        className={`rounded-md h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                      {t?.localizationSection?.subtitleLabel?.replace("{lang}", lang.toUpperCase()) || `Subjudul (${lang.toUpperCase()})`}
                    </Label>
                    <Textarea
                      rows={2}
                      value={form[lang].subtitle}
                      onChange={(e) => updateLocale(lang, "subtitle", e.target.value)}
                      className={`rounded-md resize-none text-xs ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                      {t?.localizationSection?.addressLabel?.replace("{lang}", lang.toUpperCase()) || `Alamat Lengkap (${lang.toUpperCase()})`}
                    </Label>
                    <Textarea
                      rows={3}
                      value={form[lang].address}
                      onChange={(e) => updateLocale(lang, "address", e.target.value)}
                      className={`rounded-md resize-none text-xs leading-relaxed ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-foreground-secondary">
                      {t?.localizationSection?.hoursLabel?.replace("{lang}", lang.toUpperCase()) || `Jam Operasional (${lang.toUpperCase()})`}
                    </Label>
                    <Input
                      value={form[lang].officeHours}
                      onChange={(e) => updateLocale(lang, "officeHours", e.target.value)}
                      placeholder={t?.localizationSection?.placeholders?.hours || "Senin - Sabtu: 08:00 - 17:00"}
                      className={`rounded-md h-10 ${lang === "en" ? "border-primary-200 bg-primary-50/10" : ""}`}
                    />
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
