"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [packages, users, gallery, testimonials, bookings, pendingBookings] =
    await Promise.all([
      prisma.tourPackage.count(),
      prisma.user.count(),
      prisma.galeryImage.count(),
      prisma.testimonial.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
    ]);

  const publishedPackages = await prisma.tourPackage.count({
    where: { isPublished: true },
  });

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      pax: true,
      createdAt: true,
    },
  });

  return {
    packages,
    publishedPackages,
    users,
    gallery,
    testimonials,
    bookings,
    pendingBookings,
    recentBookings,
  };
}
