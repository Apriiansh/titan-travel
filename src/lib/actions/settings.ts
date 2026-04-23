"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function upsertSetting(key: string, value: unknown) {
  await prisma.setting.upsert({
    where: { key },
    update: { value: value as never },
    create: { key, value: value as never },
  });
  revalidatePath("/");
  revalidatePath("/admin/content/hero");
  revalidatePath("/admin/content/about");
  revalidatePath("/admin/content/services");
  revalidatePath("/admin/settings/contact");
  revalidatePath("/admin/settings");
}

export async function getAllSettings() {
  const settings = await prisma.setting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}
