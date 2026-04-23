"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "MANAGER" | "ADMIN";
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });
  revalidatePath("/admin/users");
}

export async function updateUser(
  id: string,
  data: {
    name: string;
    email: string;
    role: "USER" | "MANAGER" | "ADMIN";
    password?: string;
  }
) {
  const updateData: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    role: data.role,
  };
  if (data.password && data.password.trim() !== "") {
    updateData.password = await bcrypt.hash(data.password, 12);
  }
  await prisma.user.update({ where: { id }, data: updateData });
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  // Hapus sessions dulu (cascade harusnya handle ini, tapi explicit lebih aman)
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
