'use server'

import { prisma } from '@/lib/prisma'

// Mendefinisikan tipe kembalian query SQL agar tidak ada error "any"
type RevenueResult = {
  totalRevenue: number | string | bigint | null;
}

type RawChartRow = {
  monthNum: number | string | bigint;
  yearNum: number | string | bigint;
  pemesanan: number | string | bigint;
  pendapatan: number | string | bigint | null;
}

export async function getAdminStats() {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. Hitung data atas secara paralel
    const [
      totalUsers,
      totalBookings,
      monthlyBookings,
      publishedPackages
    ] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.tourPackage.count({ where: { isPublished: true } })
    ])

    // 2. Hitung Total Pendapatan
    const revenueResult = await prisma.$queryRaw<RevenueResult[]>`
      SELECT COALESCE(SUM(tp.price * b.pax), 0) as totalRevenue
      FROM bookings b
      LEFT JOIN tour_packages tp ON b.packageId = tp.id
      WHERE b.status IN ('CONFIRMED', 'COMPLETED')
    `
    const totalRevenue = Number((revenueResult[0]?.totalRevenue || 0).toString())

    // 3. Tarik data Grafik 6 Bulan Terakhir
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const rawChartData = await prisma.$queryRaw<RawChartRow[]>`
      SELECT 
        MONTH(b.createdAt) as monthNum,
        YEAR(b.createdAt) as yearNum,
        COUNT(b.id) as pemesanan,
        COALESCE(SUM(b.pax * tp.price), 0) as pendapatan
      FROM bookings b
      LEFT JOIN tour_packages tp ON b.packageId = tp.id
      WHERE b.createdAt >= ${sixMonthsAgo}
        AND b.status IN ('CONFIRMED', 'COMPLETED')
      GROUP BY YEAR(b.createdAt), MONTH(b.createdAt)
      ORDER BY YEAR(b.createdAt) ASC, MONTH(b.createdAt) ASC
    `;

    // 4. Susun ulang data grafik
    const chartData = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleDateString('id-ID', { month: 'short' }); 
      
      const foundData = rawChartData.find(
        (row) => Number(row.monthNum) === d.getMonth() + 1 && Number(row.yearNum) === d.getFullYear()
      );

      chartData.push({
        name: monthName,
        pemesanan: foundData ? Number(foundData.pemesanan.toString()) : 0,
        pendapatan: foundData ? Number((foundData.pendapatan || 0).toString()) / 1000000 : 0 
      });
    }

    // Hanya return SATU KALI di akhir blok try
    return {
      totalUsers,
      monthlyBookings,
      totalRevenue,
      publishedPackages,
      totalBookings,
      chartData
    };

  } catch (error: unknown) {
    console.error("Error getAdminStats:", error);
    // Hanya throw SATU KALI di blok catch
    throw new Error("Gagal mengambil data statistik untuk dashboard");
  }
  
  // PASTIKAN TIDAK ADA KODE APA PUN DI BARIS INI (DI BAWAH CATCH)
}