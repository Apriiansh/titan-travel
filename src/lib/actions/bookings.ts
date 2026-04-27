"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/actions/notifications";

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

  const paymentDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
      paymentDeadline,
    },
  });

  const pkgTitle = pkg ? ((pkg.title as any)?.id || "Paket Wisata") : "Paket Wisata";
  await createNotification({
    role: "ADMIN",
    type: "BOOKING_NEW",
    title: "Booking Baru",
    message: `${data.name} memesan ${pkgTitle} untuk ${data.pax} orang (${data.paymentType}). Total: Rp ${amountPaid.toLocaleString("id-ID")}`,
    linkUrl: "/admin/bookings",
  });

  revalidatePath("/admin/bookings");

  return serializeBooking(booking);
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

export async function uploadPaymentProof(bookingId: string, imageUrl: string) {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentProof: imageUrl },
    select: { id: true, name: true },
  });

  await createNotification({
    role: "ADMIN",
    type: "PAYMENT_PROOF",
    title: "Bukti Pembayaran Diunggah",
    message: `${booking.name} telah mengunggah bukti pembayaran. Silakan verifikasi.`,
    linkUrl: "/admin/bookings",
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard");
}

export async function verifyPayment(bookingId: string) {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
    select: { id: true, userId: true, name: true },
  });

  if (booking.userId) {
    await createNotification({
      userId: booking.userId,
      type: "PAYMENT_VERIFIED",
      title: "Pembayaran Terverifikasi ✅",
      message: `Halo ${booking.name}, pembayaran Anda telah diverifikasi. Terima kasih!`,
      linkUrl: "/dashboard",
    });
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard");
}
