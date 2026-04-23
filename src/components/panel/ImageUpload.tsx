"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
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
import { X, Upload, Image as ImageIcon, Loader2, Plus, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  aspectRatio?: number;
  label?: string;
  helperText?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  multiple = false,
  aspectRatio = 16 / 9,
  label,
  helperText,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const MAX_FILE_SIZE_MB = 5;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Client-side guard before even opening cropper
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${MAX_FILE_SIZE_MB} MB.`);
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
      const blob = await getCroppedImg(previewUrl, croppedAreaPixels);
      if (!blob) throw new Error("Gagal memproses gambar. Coba lagi.");

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
        setUploadError(result.error ?? "Gagal mengupload gambar. Coba lagi.");
        setIsUploading(false);
      }
    } catch (err) {
      console.error("[ImageUpload] Upload error:", err);
      setUploadError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengolah gambar.");
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
            <Image
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
                  {multiple ? "Tambah Foto" : "Upload Gambar"}
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

      {/* URL Fallback Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ImageIcon className="h-4 w-4 text-foreground-secondary" />
        </div>
        <Input
          placeholder="Atau masukkan URL gambar langsung..."
          className="pl-9 h-9 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const url = (e.target as HTMLInputElement).value.trim();
              if (url) {
                onChange(multiple ? [...values, url] : url);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
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
                Sesuaikan Tampilan Gambar
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
          <div className="relative w-full h-[40vh] sm:h-[55vh] min-h-[260px]">
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
                <span className="text-xs text-muted-foreground shrink-0 font-medium">Zoom</span>
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
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleApplyCrop}
                disabled={isUploading}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-md gap-2 h-9 px-4"
              >
                {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isUploading ? "Mengupload..." : "Pangkas & Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
