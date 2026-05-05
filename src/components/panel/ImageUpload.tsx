"use client";

import { useState, useRef, useCallback } from "react";
import SafeImage from "@/components/ui/safe-image";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCroppedImg } from "@/lib/utils/crop";
import { uploadFile } from "@/lib/actions/upload";
import { X, Upload, Image as ImageIcon, Loader2, Plus, Info, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  aspectRatio?: number;
  label?: string;
  helperText?: string;
  maxSizeMB?: number;
  maxDimension?: number;
  quality?: number;
}

export function ImageUpload({
  value = "",
  onChange,
  multiple = false,
  aspectRatio = 16 / 9,
  label,
  helperText,
  maxSizeMB = 5,
  maxDimension = 2400,
  quality = 0.82,
}: ImageUploadProps) {
  const { dObj } = useLocale();
  const t = dObj(translations).adminPanel.common.imageUpload;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string>("");
  const [showUrlPreview, setShowUrlPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const values = Array.isArray(value) ? value : value ? [value] : [];

  const resetCropper = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsCropping(false);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(
        t?.errors?.fileTooLarge
          ?.replace("{size}", (file.size / 1024 / 1024).toFixed(1))
          ?.replace("{max}", maxSizeMB.toString()) || 
        `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${maxSizeMB} MB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPreviewUrl(reader.result?.toString() ?? null);
      setIsCropping(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!previewUrl || !croppedAreaPixels) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const blob = await getCroppedImg(previewUrl, croppedAreaPixels, 0, quality, maxDimension);
      if (!blob) throw new Error(t?.errors?.processFailed || "Gagal memproses gambar. Coba lagi.");

      // Use the original file extension but keep JPEG MIME type since canvas always outputs JPEG
      const ext = selectedFile?.name.split(".").pop() ?? "jpg";
      const filename = selectedFile?.name.replace(/\.[^.]+$/, `.${ext}`) ?? `image.${ext}`;
      const file = new File([blob], filename, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadFile(formData);

      if (result.success && result.url) {
        onChange(multiple ? [...values, result.url] : result.url);
        resetCropper();
      } else {
        setUploadError(result.error ?? (t?.errors?.uploadFailed || "Gagal mengupload gambar. Coba lagi."));
        setIsUploading(false);
      }
    } catch (err) {
      console.error("[ImageUpload] Upload error:", err);
      setUploadError(err instanceof Error ? err.message : (t?.errors?.genericError || "Terjadi kesalahan saat mengolah gambar."));
      setIsUploading(false);
    }
  };

  const removeImage = (url: string) => {
    onChange(multiple ? values.filter((v) => v !== url) : "");
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        {label && <Label className="text-sm font-semibold">{label}</Label>}
        {helperText && (
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <Info className="w-3.5 h-3.5" />
            {helperText}
          </div>
        )}
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {values.map((url, i) => (
          <div
            key={i}
            className="group relative aspect-video rounded-md border border-card-border overflow-hidden bg-muted"
          >
            <SafeImage
              src={url}
              alt={`Uploaded image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {(multiple || values.length === 0) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex flex-col items-center justify-center gap-2 aspect-video rounded-md border-2 border-dashed border-card-border hover:border-primary-500 hover:bg-primary-500/5 transition-all text-foreground-secondary hover:text-primary-500",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <div className="p-2 rounded-full bg-muted">
                  {multiple ? <Plus className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {multiple ? (t?.addBtn || "Tambah Foto") : (t?.uploadBtn || "Upload Gambar")}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
      />

      {/* Inline error — shown for pre-upload validation (e.g. file too large) */}
      {uploadError && !isCropping && (
        <div className="flex items-center gap-2 text-red-500 text-xs p-3 bg-red-50 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* URL Input with Preview */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-4 w-4 text-foreground-secondary" />
            </div>
            <Input
              placeholder={t?.urlPlaceholder || "Atau masukkan URL gambar langsung..."}
              className="pl-9 h-9 text-xs"
              value={pendingUrl}
              onChange={(e) => {
                setPendingUrl(e.target.value);
                setShowUrlPreview(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (pendingUrl.trim()) setShowUrlPreview(true);
                }
              }}
            />
          </div>
          {pendingUrl.trim() && !showUrlPreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs shrink-0"
              onClick={() => setShowUrlPreview(true)}
            >
              {t?.previewBtn || "Preview"}
            </Button>
          )}
        </div>
        <div className="text-[10px] text-foreground-secondary/70 space-y-0.5 px-1">
          <p>{t?.urlHint || "Gunakan link langsung ke gambar (bukan link halaman web). URL harus diakhiri ekstensi gambar atau berupa direct image link."}</p>
        </div>

        {showUrlPreview && pendingUrl.trim() && (
          <div className="rounded-md border border-card-border bg-muted/30 p-3 space-y-3 animate-in fade-in-50 duration-200">
            <div className="relative aspect-video rounded-md overflow-hidden bg-muted border border-card-border">
              <img
                src={pendingUrl.trim()}
                alt="Preview URL"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  setUploadError(t?.errors?.loadFailed || "Gambar tidak bisa dimuat. Pastikan URL valid dan berupa link langsung ke gambar.");
                }}
                onLoad={() => setUploadError(null)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-foreground-secondary truncate max-w-[60%]">{pendingUrl.trim()}</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-foreground-secondary"
                  onClick={() => { setPendingUrl(""); setShowUrlPreview(false); setUploadError(null); }}
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  {t?.cancelBtn || "Batal"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 px-3 text-xs bg-primary-500 hover:bg-primary-600 text-white gap-1.5"
                  onClick={() => {
                    const url = pendingUrl.trim();
                    onChange(multiple ? [...values, url] : url);
                    setPendingUrl("");
                    setShowUrlPreview(false);
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                  {t?.useUrlBtn || "Gunakan URL"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Crop Modal — full responsive */}
      <Dialog open={isCropping} onOpenChange={(open) => { if (!open && !isUploading) resetCropper(); }}>
        <DialogContent
          className="w-[calc(100vw-2rem)] sm:max-w-5xl p-0 overflow-hidden bg-neutral-950 gap-0 rounded-xl"
          showCloseButton={false}
        >
          <DialogHeader className="px-5 py-3.5 bg-background border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-sm font-semibold">
                {t?.cropTitle || "Sesuaikan Tampilan Gambar"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetCropper}
                disabled={isUploading}
                className="h-7 px-2 text-xs rounded-md text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>
          </DialogHeader>

          {/* Cropper Area — responsive height */}
          <div className="relative w-full h-[40vh] sm:h-[55vh] min-h-65">
            {previewUrl && (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-background border-t border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {uploadError ? (
              <div className="flex items-center gap-2 text-red-500 text-xs flex-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-3">
                <span className="text-xs text-muted-foreground shrink-0 font-medium">
                  {t?.zoomLabel || "Zoom"}
                </span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{zoom.toFixed(1)}×</span>
              </div>
            )}

            <div className="flex gap-2 shrink-0 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCropper}
                disabled={isUploading}
                className="rounded-md h-9 px-4"
              >
                {t?.cancelBtn || "Batal"}
              </Button>
              <Button
                size="sm"
                onClick={handleApplyCrop}
                disabled={isUploading}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-md gap-2 h-9 px-4"
              >
                {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isUploading ? (t?.uploadingBtn || "Mengupload...") : (t?.cropAndUploadBtn || "Pangkas & Upload")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
