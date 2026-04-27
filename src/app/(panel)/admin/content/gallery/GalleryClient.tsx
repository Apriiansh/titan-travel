"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { ConfirmDialog } from "@/components/panel/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/lib/actions/gallery";
import { translateToAll } from "@/lib/actions/translate";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, CheckCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/panel/ImageUpload";
import { Badge } from "@/components/ui/badge";
import SafeImage from "@/components/ui/safe-image";

type GalleryContent = {
  id: string;
  en: string;
  ms: string;
};

type GalleryImage = {
  id: string;
  imageUrl: string;
  title: GalleryContent;
  category: GalleryContent;
  createdAt: Date;
};

const emptyForm = {
  imageUrl: "",
  titleId: "",
  titleEn: "",
  titleMs: "",
  categoryId: "",
  categoryEn: "",
  categoryMs: "",
};

interface GalleryClientProps {
  initialData: GalleryImage[];
}

export function GalleryClient({ initialData }: GalleryClientProps) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, setIsTranslating] = useState(false);
  const router = useRouter();

  const refresh = () => router.refresh();
  const f = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: GalleryImage) {
    setEditing(item);
    setForm({
      imageUrl: item.imageUrl,
      titleId: item.title.id,
      titleEn: item.title.en,
      titleMs: item.title.ms,
      categoryId: item.category.id,
      categoryEn: item.category.en,
      categoryMs: item.category.ms,
    });
    setOpen(true);
  }

  async function handleAutoTranslate() {
    if (!form.titleEn && !form.categoryEn) return;
    
    setIsTranslating(true);
    try {
      const [titleTrans, catTrans] = await Promise.all([
        form.titleEn ? translateToAll(form.titleEn) : Promise.resolve({ id: "", ms: "" }),
        form.categoryEn ? translateToAll(form.categoryEn) : Promise.resolve({ id: "", ms: "" })
      ]);

      setForm(prev => ({
        ...prev,
        titleId: titleTrans.id || prev.titleId,
        titleMs: titleTrans.ms || prev.titleMs,
        categoryId: catTrans.id || prev.categoryId,
        categoryMs: catTrans.ms || prev.categoryMs,
      }));
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      if (editing) {
        await updateGalleryImage(editing.id, form);
        // Patch item in-place immediately
        setData((prev) =>
          prev.map((item) =>
            item.id === editing.id
              ? {
                  ...item,
                  imageUrl: form.imageUrl,
                  title: { id: form.titleId, en: form.titleEn, ms: form.titleMs },
                  category: { id: form.categoryId, en: form.categoryEn, ms: form.categoryMs },
                }
              : item
          )
        );
      } else {
        const created = await createGalleryImage(form);
        // Prepend new item immediately — no page refresh needed
        setData((prev) => [
          {
            id: created.id,
            imageUrl: created.imageUrl as string,
            title: { id: form.titleId, en: form.titleEn, ms: form.titleMs },
            category: { id: form.categoryId, en: form.categoryEn, ms: form.categoryMs },
            createdAt: created.createdAt,
          },
          ...prev,
        ]);
      }
      setOpen(false);
      refresh(); // background cache invalidation for landing page
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteGalleryImage(id);
      setData((prev) => prev.filter((i) => i.id !== id));
      refresh();
    });
  }

  return (
    <>
      <PageHeader
        title="Galeri Foto"
        description="Kelola koleksi foto dalam tiga bahasa (ID, EN, MS)"
        action={
          <Button
            onClick={openCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white gap-2 rounded-md shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Foto
          </Button>
        }
      />

      {data.length === 0 ? (
        <div className="rounded-md border border-card-border bg-card-bg flex flex-col items-center justify-center py-24 text-foreground-secondary space-y-4">
          <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
          <p className="text-sm font-medium">Belum ada foto. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="group rounded-md border border-card-border overflow-hidden bg-card-bg transition-all hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <SafeImage
                  src={item.imageUrl || "/placeholder.jpg"}
                  alt={item.title.id}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-md bg-white/90 hover:bg-white text-primary-600 shadow-sm"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-md bg-white/90 hover:bg-red-50 text-red-500 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      }
                      onConfirm={() => handleDelete(item.id)}
                    />
                </div>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="outline" className="text-[9px] py-0 px-1 rounded-sm border-primary-500/20 text-primary-600 uppercase">ID</Badge>
                  <p className="text-xs font-bold text-foreground truncate">{item.title.id}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[9px] py-0 px-1 rounded-sm border-blue-500/20 text-blue-600 uppercase">EN</Badge>
                  <p className="text-[11px] text-foreground-secondary truncate">{item.title.en}</p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-medium text-muted-foreground uppercase tracking-wider">
                    {item.category.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-4xl p-0 overflow-hidden border-none rounded-xl shadow-2xl">
          <DialogHeader className="px-6 py-4 bg-muted/30 border-b border-card-border">
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon className="w-4 h-4 text-primary-500" />
              {editing ? "Edit Foto Galeri" : "Tambah Foto Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Media Upload */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preview Media</Label>
                <ImageUpload
                   label="Foto Galeri"
                   helperText="Maks 2MB. Rasio 4:3 direkomendasikan."
                   aspectRatio={4 / 3}
                   value={form.imageUrl}
                   onChange={(url) => f("imageUrl", Array.isArray(url) ? url[0] : (url as string))}
                   maxSizeMB={2}
                   maxDimension={1600}
                   quality={0.75}
                />
              </div>

              {/* Translation Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Lokalisasi Informasi</Label>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAutoTranslate}
                    disabled={isTranslating || !form.titleEn && !form.categoryEn}
                    className="h-6 text-[10px] gap-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2"
                  >
                    {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Auto-Translate
                  </Button>
                </div>

                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-9 p-1 bg-muted/50 rounded-md">
                    <TabsTrigger value="en" className="text-[10px] rounded-sm uppercase font-bold">EN (Source)</TabsTrigger>
                    <TabsTrigger value="id" className="text-[10px] rounded-sm uppercase font-bold">ID</TabsTrigger>
                    <TabsTrigger value="ms" className="text-[10px] rounded-sm uppercase font-bold">MS</TabsTrigger>
                  </TabsList>

                  {(['en', 'id', 'ms'] as const).map((lang) => {
                    const titleKey = `title${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof typeof form;
                    const catKey = `category${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof typeof form;
                    
                    return (
                      <TabsContent key={lang} value={lang} className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-foreground-secondary">Judul ({lang.toUpperCase()})</Label>
                          <Input 
                            value={form[titleKey]} 
                            onChange={(e) => f(titleKey, e.target.value)} 
                            placeholder="Contoh: Keindahan Pantai" 
                            className={`rounded-md h-9 ${lang === 'en' ? 'border-primary-200 bg-primary-50/10' : ''}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-foreground-secondary">Kategori ({lang.toUpperCase()})</Label>
                          <Input 
                            value={form[catKey]} 
                            onChange={(e) => f(catKey, e.target.value)} 
                            placeholder="Contoh: Alam, Budaya" 
                            className={`rounded-md h-9 ${lang === 'en' ? 'border-primary-200 bg-primary-50/10' : ''}`}
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
            <Button variant="ghost" onClick={() => setOpen(false)} className="h-9 text-xs rounded-md">Batal</Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary-500 hover:bg-primary-600 text-white min-w-[120px] rounded-md shadow-sm h-9 text-xs"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 mr-2" />
              )}
              {editing ? "Simpan Perubahan" : "Simpan Foto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
