"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGalleryImages() {
  return prisma.galeryImage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createGalleryImage(data: {
  imageUrl: string;
  titleId: string;
  titleEn: string;
  titleMs: string;
  categoryId: string;
  categoryEn: string;
  categoryMs: string;
}) {
  const record = await prisma.galeryImage.create({
    data: {
      imageUrl: data.imageUrl,
      title: { id: data.titleId, en: data.titleEn, ms: data.titleMs },
      category: { id: data.categoryId, en: data.categoryEn, ms: data.categoryMs },
    },
  });
  revalidatePath("/admin/content/gallery");
  revalidatePath("/");
  return record;
}

export async function updateGalleryImage(
  id: string,
  data: {
    imageUrl: string;
    titleId: string;
    titleEn: string;
    titleMs: string;
    categoryId: string;
    categoryEn: string;
    categoryMs: string;
  }
) {
  const record = await prisma.galeryImage.update({
    where: { id },
    data: {
      imageUrl: data.imageUrl,
      title: { id: data.titleId, en: data.titleEn, ms: data.titleMs },
      category: { id: data.categoryId, en: data.categoryEn, ms: data.categoryMs },
    },
  });
  revalidatePath("/admin/content/gallery");
  revalidatePath("/");
  return record;
}

export async function deleteGalleryImage(id: string) {
  await prisma.galeryImage.delete({ where: { id } });
  revalidatePath("/admin/content/gallery");
  revalidatePath("/");
}
