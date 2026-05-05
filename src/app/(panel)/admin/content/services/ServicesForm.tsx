"use client";

import { useState } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { SaveButton } from "@/components/panel/SaveButton";
import { TranslateButton } from "@/components/panel/TranslateButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertSetting } from "@/lib/actions/settings";
import { translateToAll } from "@/lib/actions/translate";
import { useCmsForm } from "@/hooks/useCmsForm";
import { LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

type Service = {
  iconName: string;
  titleId: string;
  titleEn: string;
  titleMs: string;
  descId: string;
  descEn: string;
  descMs: string;
};

interface ServicesFormProps {
  initial: { services: Service[] };
}

const newService = (): Service => ({
  iconName: "MapPin",
  titleId: "",
  titleEn: "",
  titleMs: "",
  descId: "",
  descEn: "",
  descMs: "",
});

export function ServicesForm({ initial }: ServicesFormProps) {
  // Services form is list-based, not locale-based, so we use a simpler local state
  const [services, setServices] = useState<Service[]>(initial.services);
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);
  // Reuse only the save part of useCmsForm
  const { isPending, saved, save } = useCmsForm(initial);
  const { dObj } = useLocale();
  const t = dObj(translations).adminPanel.content.services;

  function update(index: number, key: keyof Service, val: string) {
    setServices((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [key]: val };
      return arr;
    });
  }

  async function handleTranslate(index: number) {
    const svc = services[index];
    if (!svc.titleEn && !svc.descEn) return;

    setTranslatingIndex(index);
    try {
      const [titleTrans, descTrans] = await Promise.all([
        svc.titleEn ? translateToAll(svc.titleEn) : Promise.resolve({ id: "", ms: "" }),
        svc.descEn ? translateToAll(svc.descEn) : Promise.resolve({ id: "", ms: "" }),
      ]);

      setServices((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          titleId: titleTrans.id || arr[index].titleId,
          titleMs: titleTrans.ms || arr[index].titleMs,
          descId: descTrans.id || arr[index].descId,
          descMs: descTrans.ms || arr[index].descMs,
        };
        return arr;
      });
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslatingIndex(null);
    }
  }

  function handleSave() {
    save(async () => {
      await upsertSetting("services", {
        id: { items: services.map((s) => ({ iconName: s.iconName, title: s.titleId, desc: s.descId })) },
        en: { items: services.map((s) => ({ iconName: s.iconName, title: s.titleEn, desc: s.descEn })) },
        ms: { items: services.map((s) => ({ iconName: s.iconName, title: s.titleMs, desc: s.descMs })) },
      });
    });
  }

  return (
    <>
      <PageHeader
        title={t?.title || "Layanan Wisata"}
        description={t?.description || "Kelola daftar layanan untuk seluruh bahasa (ID, EN, MS)"}
        action={<SaveButton isPending={isPending} saved={saved} onClick={handleSave} />}
      />

      <div className="space-y-6">
        {services.map((svc, i) => (
          <div
            key={i}
            className="rounded-md border border-card-border bg-card-bg shadow-sm p-6 space-y-6 animate-in slide-in-from-bottom-2 duration-300"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-500/10 rounded-md">
                  <LayoutGrid className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {t?.cardTitle?.replace("{index}", (i + 1).toString()) || `Layanan #${i + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TranslateButton
                  isTranslating={translatingIndex === i}
                  onClick={() => handleTranslate(i)}
                  disabled={!svc.titleEn && !svc.descEn}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                  onClick={() => setServices((p) => p.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                  {t?.iconLabel || "Icon Name (Lucide)"}
                </Label>
                <Input
                  value={svc.iconName}
                  onChange={(e) => update(i, "iconName", e.target.value)}
                  placeholder="MapPin, Shield, Star..."
                  className="h-9 rounded-md"
                />
              </div>

              <div className="md:col-span-3 space-y-4">
                {/* EN Source */}
                <div className="space-y-3 p-3 bg-blue-50/30 rounded-md border border-blue-100">
                  <Label className="text-[10px] uppercase tracking-wider font-bold text-blue-600">
                    {t?.sourceTitle || "English (Source Content)"}
                  </Label>
                  <Input
                    value={svc.titleEn}
                    onChange={(e) => update(i, "titleEn", e.target.value)}
                    placeholder="Title (EN)"
                    className="h-9 rounded-md bg-white border-blue-100"
                  />
                  <Textarea
                    rows={2}
                    value={svc.descEn}
                    onChange={(e) => update(i, "descEn", e.target.value)}
                    placeholder="Description (EN)"
                    className="text-xs rounded-md bg-white border-blue-100"
                  />
                </div>

                {/* ID + MS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      { lang: "Bahasa Indonesia", color: "text-primary-600", titleKey: "titleId", descKey: "descId", titlePH: "Judul (ID)", descPH: "Deskripsi (ID)" },
                      { lang: "Malay (MS)", color: "text-emerald-600", titleKey: "titleMs", descKey: "descMs", titlePH: "Tajuk (MS)", descPH: "Keterangan (MS)" },
                    ] as const
                  ).map(({ lang, color, titleKey, descKey, titlePH, descPH }) => (
                    <div key={lang} className="space-y-3 p-3 bg-muted/30 rounded-md border border-card-border">
                      <Label className={`text-[10px] uppercase tracking-wider font-bold ${color}`}>{lang}</Label>
                      <Input
                        value={svc[titleKey]}
                        onChange={(e) => update(i, titleKey, e.target.value)}
                        placeholder={titlePH}
                        className="h-9 rounded-md bg-white"
                      />
                      <Textarea
                        rows={2}
                        value={svc[descKey]}
                        onChange={(e) => update(i, descKey, e.target.value)}
                        placeholder={descPH}
                        className="text-xs rounded-md bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full h-12 gap-2 border-dashed border-2 hover:border-primary-500 hover:text-primary-500 transition-all rounded-md"
          onClick={() => setServices((p) => [...p, newService()])}
        >
          <Plus className="w-4 h-4" />
          {t?.addBtn || "Tambah Layanan Baru"}
        </Button>
      </div>
    </>
  );
}
