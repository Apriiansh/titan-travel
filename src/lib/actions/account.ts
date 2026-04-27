"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string, email: string) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Sesi tidak valid. Silakan login ulang." };
  }

  if (!name.trim() || !email.trim()) {
    return { success: false, error: "Nama dan email wajib diisi." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Format email tidak valid." };
  }

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: session.id as string } },
  });
  if (existing) {
    return { success: false, error: "Email sudah digunakan oleh akun lain." };
  }

  await prisma.user.update({
    where: { id: session.id as string },
    data: { name: name.trim(), email: email.trim() },
  });

  revalidatePath("/admin/account");
  revalidatePath("/manager/account");
  revalidatePath("/dashboard/account");

  return { success: true };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Sesi tidak valid. Silakan login ulang." };
  }

  if (!currentPassword || !newPassword) {
    return { success: false, error: "Semua field password wajib diisi." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Password baru minimal 6 karakter." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { password: true },
  });

  if (!user) {
    return { success: false, error: "User tidak ditemukan." };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { success: false, error: "Password lama tidak sesuai." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.id as string },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function getAccountData() {
  const session = await getSession();
  if (!session?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.id as string },
    select: { id: true, name: true, email: true, role: true },
  });
}
