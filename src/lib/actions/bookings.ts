"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { snap } from "@/lib/midtrans";

function serializeBooking(b: any) {
  if (!b) return null;
  return {
    ...b,
    totalPrice: Number(b.totalPrice),
    amountPaid: Number(b.amountPaid),
  };
}

export async function getBookings() {
  const bookings = await prisma.booking.findMany({
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });
  return bookings.map(serializeBooking);
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  return serializeBooking(booking);
}

export async function getBookingsByUser(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });
  return bookings.map(serializeBooking);
}

export async function getAvailableQuota(packageId: string, tourDate: string) {
  const pkg = await prisma.tourPackage.findUnique({
    where: { id: packageId },
    select: { capacity: true },
  });

  if (!pkg) return { available: 0, capacity: 0, booked: 0 };

  const existingBookings = await prisma.booking.findMany({
    where: {
      packageId,
      tourDate: new Date(tourDate),
      status: { not: "CANCELLED" },
    },
    select: { pax: true },
  });

  const totalBooked = existingBookings.reduce((sum, b) => sum + b.pax, 0);
  const available = pkg.capacity - totalBooked;

  return {
    capacity: pkg.capacity,
    booked: totalBooked,
    available: Math.max(0, available),
  };
}

export async function createBooking(data: {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  packageId: string;
  tourDate: Date;
  pax: number;
  paymentType: "DP" | "HALF" | "FULL";
  notes?: string;
}) {
  const pkg = await prisma.tourPackage.findUnique({ 
    where: { id: data.packageId },
    include: { priceTiers: { orderBy: { minPax: 'desc' } } }
  });

  if (!pkg) throw new Error("Package not found");

  // 1. Cek Sisa Kuota di Tanggal Tersebut (Anti-Overbooking)
  const existingBookings = await prisma.booking.findMany({
    where: {
      packageId: data.packageId,
      tourDate: data.tourDate,
      status: { not: "CANCELLED" } // Jangan hitung yang sudah dibatalkan
    },
    select: { pax: true }
  });

  const totalBookedPax = existingBookings.reduce((sum, b) => sum + b.pax, 0);
  const remainingQuota = pkg.capacity - totalBookedPax;

  if (data.pax > remainingQuota) {
    throw new Error(`Sisa kuota untuk tanggal ini hanya ${remainingQuota} pax. Mohon kurangi jumlah peserta.`);
  }

  // 2. Logic Harga Bertingkat (Tiered Pricing)
  let unitPrice = 0;
  
  const applicableTier = pkg.priceTiers.find(tier => 
    data.pax >= tier.minPax && data.pax <= tier.maxPax
  );

  if (applicableTier) {
    unitPrice = Number(applicableTier.price);
  } else {
    const sortedTiers = [...pkg.priceTiers].sort((a, b) => Number(a.price) - Number(b.price));
    unitPrice = sortedTiers.length > 0 ? Number(sortedTiers[0].price) : 0;
  }

  const totalPrice = unitPrice * data.pax;
  let amountPaid = 0;

  if (data.paymentType === "FULL") {
    amountPaid = totalPrice;
  } else if (data.paymentType === "HALF") {
    amountPaid = totalPrice * 0.5;
  } else if (data.paymentType === "DP") {
    amountPaid = totalPrice * 0.3;
  }

  // 1. Simpan ke database
  const booking = await prisma.booking.create({
    data: {
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      packageId: data.packageId,
      tourDate: data.tourDate,
      pax: data.pax,
      paymentType: data.paymentType,
      totalPrice,
      amountPaid,
      status: "PENDING",
      notes: data.notes,
    },
  });

  // 2. Request Token ke Midtrans
  let snapToken = "";
  try {
    const parameter = {
      transaction_details: {
        order_id: booking.id,
        gross_amount: Math.round(amountPaid),
      },
      customer_details: {
        first_name: data.name,
        email: data.email,
        phone: data.phone,
      },
      item_details: [{
        id: pkg.id,
        price: Math.round(amountPaid),
        quantity: 1,
        name: `${(pkg.title as any).id || "Paket Wisata"} (${data.paymentType})`,
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    snapToken = transaction.token;

    // Simpan token ke booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { snapToken }
    });
  } catch (error) {
    console.error("Midtrans Error:", error);
  }

  revalidatePath("/admin/bookings");
  
  return serializeBooking({ ...booking, snapToken });
}

export async function updateBookingStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
) {
  await prisma.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin/bookings");
}

export async function deleteBooking(id: string) {
  await prisma.booking.delete({ where: { id } });
  revalidatePath("/admin/bookings");
}
