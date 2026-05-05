"use client";

import { useState, useTransition } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createTestimonial,
  deleteTestimonial,
  toggleTestimonialPublish,
  updateTestimonial,
} from "@/lib/actions/testimonials";
import { translateToAll } from "@/lib/actions/translate";
import { Plus, Pencil, Trash2, Star, Loader2, Quote, UserCircle, CheckCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/panel/ImageUpload";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

interface TestimonialContent {
  id: string;
  en: string;
  ms: string;
}

type Testimonial = {
  id: string;
  name: string;
  role: TestimonialContent;
  text: TestimonialContent;
  avatar?: string | null;
  rating: number;
  isPublished: boolean;
  createdAt: Date;
};

const emptyForm = {
  name: "",
  roleId: "",
  roleEn: "",
  roleMs: "",
  textId: "",
  textEn: "",
  textMs: "",
  avatar: "",
  rating: 5,
  isPublished: false,
};

interface TestimonialsClientProps {
  initialData: Testimonial[];
}

export function TestimonialsClient({ initialData }: TestimonialsClientProps) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, setIsTranslating] = useState(false);
  const router = useRouter();
  const { dObj, locale, dt } = useLocale();
  const t = dObj(translations).adminPanel.content.testimonials;

  const refresh = () => router.refresh();
  const f = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: Testimonial) {
    setEditing(item);
    setForm({
      name: item.name,
      roleId: item.role.id,
      roleEn: item.role.en,
      roleMs: item.role.ms,
      textId: item.text.id,
      textEn: item.text.en,
      textMs: item.text.ms,
      avatar: item.avatar ?? "",
      rating: item.rating,
      isPublished: item.isPublished,
    });
    setOpen(true);
  }

  async function handleAutoTranslate() {
    if (!form.roleEn && !form.textEn) return;
    
    setIsTranslating(true);
    try {
      const [roleTrans, textTrans] = await Promise.all([
        form.roleEn ? translateToAll(form.roleEn) : Promise.resolve({ id: "", ms: "" }),
        form.textEn ? translateToAll(form.textEn) : Promise.resolve({ id: "", ms: "" })
      ]);

      setForm(prev => ({
        ...prev,
        roleId: roleTrans.id || prev.roleId,
        roleMs: roleTrans.ms || prev.roleMs,
        textId: textTrans.id || prev.textId,
        textMs: textTrans.ms || prev.textMs,
      }));
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      const payload = {
        name: form.name,
        roleId: form.roleId,
        roleEn: form.roleEn,
        roleMs: form.roleMs,
        textId: form.textId,
        textEn: form.textEn,
        textMs: form.textMs,
        avatar: form.avatar || undefined,
        rating: form.rating,
        isPublished: form.isPublished,
      };

      if (editing) {
        await updateTestimonial(editing.id, payload);
        // Patch in-place immediately
        setData((prev) =>
          prev.map((t) =>
            t.id === editing.id
              ? {
                  ...t,
                  name: form.name,
                  avatar: form.avatar || t.avatar,
                  rating: form.rating,
                  isPublished: form.isPublished,
                  role: { id: form.roleId, en: form.roleEn, ms: form.roleMs },
                  text: { id: form.textId, en: form.textEn, ms: form.textMs },
                }
              : t
          )
        );
      } else {
        const created = await createTestimonial(payload);
        // Prepend new testimonial immediately
        setData((prev) => [
          {
            id: created.id,
            name: created.name,
            avatar: created.avatar ?? null,
            rating: created.rating,
            isPublished: created.isPublished,
            createdAt: created.createdAt,
            role: { id: form.roleId, en: form.roleEn, ms: form.roleMs },
            text: { id: form.textId, en: form.textEn, ms: form.textMs },
          },
          ...prev,
        ]);
      }
      setOpen(false);
      refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTestimonial(id);
      setData((prev) => prev.filter((t) => t.id !== id));
      refresh();
    });
  }

  function handleToggle(id: string, current: boolean) {
    const next = !current;
    // Optimistically flip the toggle in local state immediately
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPublished: next } : t))
    );
    startTransition(async () => {
      await toggleTestimonialPublish(id, next);
      refresh();
    });
  }

  return (
    <>
      <PageHeader
        title={t?.title || "Testimoni"}
        description={t?.description || "Kelola ulasan pelanggan dalam tiga bahasa utama"}
        action={
          <Button
            onClick={openCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white gap-2 rounded-md shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t?.addBtn || "Tambah Testimoni"}
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.length === 0 ? (
          <div className="col-span-full rounded-md border border-card-border bg-card-bg flex flex-col items-center justify-center py-24 text-foreground-secondary space-y-4">
            <Quote className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-sm font-medium">{t?.empty || "Belum ada testimoni. Tambahkan yang pertama!"}</p>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-md border border-card-border bg-card-bg p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-primary-500/10"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-foreground-secondary font-medium uppercase tracking-wider truncate">
                      {dt(item.role) || "Guest"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(item.id, item.isPublished)}
                  className="shrink-0"
                >
                  <Badge 
                    variant={item.isPublished ? "default" : "secondary"}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] ${item.isPublished ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : ""}`}
                  >
                    {item.isPublished ? (t?.public || "Public") : (t?.draft || "Draft")}
                  </Badge>
                </button>
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < item.rating ? "text-accent-500 fill-accent-500" : "text-muted-foreground/20"}`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-foreground-secondary italic line-clamp-4 leading-relaxed">
                  &ldquo;{dt(item.text)}&rdquo;
                </p>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Badge variant="outline" className="text-[9px] py-0 px-1 rounded-sm border-primary-500/20 text-primary-600">{t?.cardId || "ID"}</Badge>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 rounded-sm border-blue-500/20 text-blue-600">{t?.cardEn || "EN"}</Badge>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 rounded-sm border-green-500/20 text-green-600">{t?.cardMs || "MS"}</Badge>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-card-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary-500 hover:bg-primary-50 rounded-md"
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  }
                  onConfirm={() => handleDelete(item.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-4xl p-0 overflow-hidden border-none rounded-xl">
          <DialogHeader className="px-6 py-4 bg-muted/30 border-b border-card-border">
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <UserCircle className="w-4 h-4 text-primary-500" />
              {editing ? (t?.form?.editTitle || "Edit Testimoni") : (t?.form?.addTitle || "Tambah Testimoni Baru")}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t?.form?.customerName || "Nama Pelanggan"}
                  </Label>
                  <Input 
                    value={form.name} 
                    onChange={(e) => f("name", e.target.value)} 
                    placeholder={t?.form?.customerName || "Nama Pelanggan"} 
                    className="rounded-md"
                  />
                </div>

                <ImageUpload
                  label={t?.form?.profilePhoto || "Foto Profil"}
                  helperText={t?.form?.photoHelper || "Rasio 1:1 direkomendasikan."}
                  aspectRatio={1}
                  value={form.avatar}
                  onChange={(url) => f("avatar", Array.isArray(url) ? url[0] : (url as string))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t?.form?.rating || "Rating"}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={form.rating}
                        onChange={(e) => f("rating", parseInt(e.target.value))}
                        className="rounded-md h-9"
                      />
                      <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                       {t?.form?.status || "Status"}
                     </Label>
                     <div className="flex items-center gap-2 h-9 px-3 border border-input rounded-md bg-background">
                        <Switch
                          checked={form.isPublished}
                          onCheckedChange={(val) => f("isPublished", val)}
                        />
                        <span className="text-[10px] font-medium uppercase">
                          {form.isPublished ? (t?.public || "Public") : (t?.draft || "Draft")}
                        </span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Translation Group */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t?.form?.localization || "Lokalisasi Konten"}
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAutoTranslate}
                    disabled={isTranslating || !form.roleEn && !form.textEn}
                    className="h-6 text-[10px] gap-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  >
                    {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Auto-Translate
                  </Button>
                </div>
                
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-9 p-1 bg-muted/30 rounded-md">
                    <TabsTrigger value="en" className="text-[10px] rounded-sm uppercase font-bold">EN (Source)</TabsTrigger>
                    <TabsTrigger value="id" className="text-[10px] rounded-sm uppercase font-bold">ID</TabsTrigger>
                    <TabsTrigger value="ms" className="text-[10px] rounded-sm uppercase font-bold">MS</TabsTrigger>
                  </TabsList>

                  {(['en', 'id', 'ms'] as const).map((lang) => {
                    const roleKey = `role${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof typeof form;
                    const textKey = `text${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof typeof form;
                    
                    return (
                      <TabsContent key={lang} value={lang} className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                            {t?.form?.roleLabel?.replace("{lang}", lang.toUpperCase()) || `Jabatan (${lang.toUpperCase()})`}
                          </Label>
                          <Input 
                            value={form[roleKey] as string} 
                            onChange={(e) => f(roleKey, e.target.value)} 
                            placeholder={t?.form?.rolePlaceholder || "Contoh: Wisatawan Family"}
                            className={`rounded-md ${lang === 'en' ? 'border-primary-200 bg-primary-50/10' : ''}`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                            {t?.form?.textLabel?.replace("{lang}", lang.toUpperCase()) || `Ulasan (${lang.toUpperCase()})`}
                          </Label>
                          <Textarea 
                            rows={6} 
                            value={form[textKey] as string} 
                            onChange={(e) => f(textKey, e.target.value)} 
                            placeholder={t?.form?.textPlaceholder || "Tulis ulasan pelanggan di sini..."} 
                            className={`rounded-md resize-none text-xs leading-relaxed ${lang === 'en' ? 'border-primary-200 bg-primary-50/10' : ''}`}
                          />
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 bg-muted/30 border-t border-card-border">
            <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-md text-xs h-9">
              {locale === "id" ? "Batal" : locale === "ms" ? "Batal" : "Cancel"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary-500 hover:bg-primary-600 text-white min-w-25 rounded-md shadow-sm text-xs h-9"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 mr-2" />
              )}
              {editing ? (t?.actions?.save || "Simpan Perubahan") : (t?.form?.saveBtn || "Simpan Testimoni")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
