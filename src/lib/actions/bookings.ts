"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBookings() {
  return prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id } });
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

  // Logic Harga Bertingkat (Tiered Pricing)
  let unitPrice = 0;
  
  // Cari tier yang cocok dengan jumlah pax (pax masuk dalam rentang minPax dan maxPax)
  const applicableTier = pkg.priceTiers.find(tier => 
    data.pax >= tier.minPax && data.pax <= tier.maxPax
  );

  if (applicableTier) {
    unitPrice = Number(applicableTier.price);
  } else {
    // Jika tidak ada tier yang cocok, kita ambil harga terendah sebagai fallback
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
    // DP 30% sesuai standar UI
    amountPaid = totalPrice * 0.3;
  }

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

  revalidatePath("/admin/bookings");
  return booking;
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
