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

export async function getManagerDashboardStats(period: string = "6months") {
  const [completedBookings, totalRevenueResult, packages] = await Promise.all([
    prisma.booking.count({
      where: { status: "COMPLETED" },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      _sum: {
        amountPaid: true,
      },
    }),
    prisma.tourPackage.findMany({
      include: {
        bookings: {
          where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
          select: { amountPaid: true },
        },
        priceTiers: true,
      },
    }),
  ]);

  // Map Top Packages
  const topPackages = packages
    .map((pkg) => ({
      id: pkg.id,
      title: (pkg.title as any).id || (pkg.title as any).en || "Untitled",
      totalRevenue: pkg.bookings.reduce((sum, b) => sum + Number(b.amountPaid), 0),
      bookingCount: pkg.bookings.length,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);

  // Generate Chart Data based on period
  const chartData = [];
  const now = new Date();
  let iterations = 6;
  
  if (period === "year") iterations = 12;
  else if (period === "all") iterations = 24; // Limit to 2 years for "all" to prevent excessive queries

  for (let i = iterations - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString("id-ID", { month: "short" });
    const yearSuffix = period !== "6months" ? ` '${d.getFullYear().toString().slice(-2)}` : "";
    
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const monthlyRevenue = await prisma.booking.aggregate({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amountPaid: true,
      },
    });

    chartData.push({
      name: `${monthName}${yearSuffix}`,
      revenue: Number(monthlyRevenue._sum.amountPaid || 0),
    });
  }

  return {
    totalRevenue: Number(totalRevenueResult._sum.amountPaid || 0),
    completedBookings,
    topPackages,
    chartData,
  };
}
