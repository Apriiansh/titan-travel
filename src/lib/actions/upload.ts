"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "node:crypto";

/**
 * Uploads a file to the local public/uploads directory.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    // Basic validation
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran file terlalu besar (Maksimal 5MB).");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    // Return the public URL
    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengupload file.",
    };
  }
}
