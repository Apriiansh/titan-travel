"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVehicleTypes() {
  return prisma.vehicleType.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function getActiveVehicleTypes() {
  return prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createVehicleType(name: string) {
  await prisma.vehicleType.create({ data: { name } });
  revalidatePath("/admin/vehicles");
}

export async function updateVehicleType(
  id: string,
  data: { name?: string; isActive?: boolean }
) {
  await prisma.vehicleType.update({ where: { id }, data });
  revalidatePath("/admin/vehicles");
}

export async function deleteVehicleType(id: string) {
  await prisma.vehicleType.delete({ where: { id } });
  revalidatePath("/admin/vehicles");
}
