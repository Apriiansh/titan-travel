"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTestimonial(data: {
  name: string;
  roleId: string;
  roleEn: string;
  roleMs: string;
  textId: string;
  textEn: string;
  textMs: string;
  avatar?: string;
  rating: number;
  isPublished: boolean;
}) {
  const record = await prisma.testimonial.create({
    data: {
      name: data.name,
      role: { id: data.roleId, en: data.roleEn, ms: data.roleMs },
      text: { id: data.textId, en: data.textEn, ms: data.textMs },
      avatar: data.avatar,
      rating: data.rating,
      isPublished: data.isPublished,
    },
  });
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return record;
}

export async function updateTestimonial(
  id: string,
  data: {
    name: string;
    roleId: string;
    roleEn: string;
    roleMs: string;
    textId: string;
    textEn: string;
    textMs: string;
    avatar?: string;
    rating: number;
    isPublished: boolean;
  }
) {
  const record = await prisma.testimonial.update({
    where: { id },
    data: {
      name: data.name,
      role: { id: data.roleId, en: data.roleEn, ms: data.roleMs },
      text: { id: data.textId, en: data.textEn, ms: data.textMs },
      avatar: data.avatar,
      rating: data.rating,
      isPublished: data.isPublished,
    },
  });
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return record;
}

export async function toggleTestimonialPublish(
  id: string,
  isPublished: boolean
) {
  const record = await prisma.testimonial.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return record;
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
}
