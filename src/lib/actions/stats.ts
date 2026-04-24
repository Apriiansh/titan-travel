"use server";

import { prisma } from "@/lib/prisma";
import { startOfYear, endOfYear, format, eachMonthOfInterval } from "date-fns";
import { id } from "date-fns/locale";

export async function getAdminStats() {
  const now = new Date();
  const startYear = startOfYear(now);
  const endYear = endOfYear(now);

  // 1. Ambil Semua Booking untuk Analisis
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startYear,
        lte: endYear,
      },
    },
    include: {
      package: true,
    },
  });

  // 2. Hitung Ringkasan (Summary)
  const totalRevenue = bookings
    .filter(b => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + Number(b.amountPaid), 0);
  
  const totalPendingRevenue = bookings
    .filter(b => b.status === "PENDING")
    .reduce((sum, b) => sum + (Number(b.totalPrice) - Number(b.amountPaid)), 0);

  const totalBookings = bookings.length;
  const totalPax = bookings.reduce((sum, b) => sum + b.pax, 0);

  // 3. Data Grafik Bulanan (Revenue per Month)
  const months = eachMonthOfInterval({ start: startYear, end: endYear });
  const monthlyData = months.map(month => {
    const monthStr = format(month, "MMM", { locale: id });
    const revenue = bookings
      .filter(b => 
        b.status !== "CANCELLED" && 
        format(b.createdAt, "MM") === format(month, "MM")
      )
      .reduce((sum, b) => sum + Number(b.amountPaid), 0);
    
    return { name: monthStr, revenue };
  });

  // 4. Distribusi Paket Terlaris (Top Packages)
  const packageMap = new Map();
  bookings.forEach(b => {
    const pkgId = b.packageId;
    const pkgTitle = (b.package?.title as any)?.id || "Unknown";
    const current = packageMap.get(pkgId) || { name: pkgTitle, value: 0 };
    packageMap.set(pkgId, { ...current, value: current.value + b.pax });
  });
  const topPackages = Array.from(packageMap.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 5. Statistik Status
  const statusStats = {
    PENDING: bookings.filter(b => b.status === "PENDING").length,
    CONFIRMED: bookings.filter(b => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter(b => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
  };

  return {
    summary: {
      totalRevenue,
      totalPendingRevenue,
      totalBookings,
      totalPax,
    },
    monthlyData,
    topPackages,
    statusStats,
  };
}
