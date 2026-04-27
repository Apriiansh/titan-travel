"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNotification(data: {
  userId?: string;
  role?: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
}) {
  return prisma.notification.create({ data });
}

export async function getUnreadNotifications(userId: string, role?: string) {
  const notifications = await prisma.notification.findMany({
    where: {
      isRead: false,
      OR: [
        { userId },
        ...(role ? [{ role }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return notifications;
}

export async function getNotifications(userId: string, role?: string) {
  return prisma.notification.findMany({
    where: {
      OR: [
        { userId },
        ...(role ? [{ role }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markAsRead(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string, role?: string) {
  await prisma.notification.updateMany({
    where: {
      isRead: false,
      OR: [
        { userId },
        ...(role ? [{ role }] : []),
      ],
    },
    data: { isRead: true },
  });
  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard");
}
