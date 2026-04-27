"use server";

import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "node:crypto";

const isVercel = process.env.VERCEL === "1";

/**
 * Uploads a file.
 * - Production (Vercel): Uses Vercel Blob storage
 * - Development (local): Uses public/uploads directory
 */
export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran file terlalu besar (Maksimal 5MB).");
    }

    if (isVercel) {
      const blob = await put(file.name, file, { access: "public" });
      return { success: true, url: blob.url };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengupload file.",
    };
  }
}
