"use server";

import { prisma } from "@/lib/prisma";

export async function getBookingReport(startDate?: string, endDate?: string) {
  const where: any = {
    status: { in: ["CONFIRMED", "COMPLETED"] }
  };
  
  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate + "T23:59:59"),
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      package: true,
      user: true,
      vehicleType: { select: { name: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialisasi data Decimal ke Number agar aman dikirim ke Client Component
  return bookings.map(b => ({
    ...b,
    totalPrice: Number(b.totalPrice),
    amountPaid: Number(b.amountPaid),
  }));
}

export async function getTopsisReport() {
  // Logic to fetch TOPSIS ranking history if we have it, 
  // or just recalculate current ranking
  // For now, let's fetch current active packages with their scores
  const packages = await prisma.tourPackage.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return packages;
}
