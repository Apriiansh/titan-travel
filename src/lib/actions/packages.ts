"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function serializePackage(pkg: any) {
  if (!pkg) return null;
  const tiers = (pkg.priceTiers || []).map((t: any) => ({
    ...t,
    price: Number(t.price),
    originalPrice: t.originalPrice ? Number(t.originalPrice) : null
  }));

  // Cari tier dengan harga promo terendah sebagai perwakilan "Harga Mulai Dari"
  const minTier = tiers.length > 0 
    ? tiers.reduce((min: any, p: any) => p.price < min.price ? p : min, tiers[0]) 
    : null;

  return {
    ...pkg,
    price: minTier ? minTier.price : 0,
    originalPrice: minTier ? minTier.originalPrice : null,
    priceTiers: tiers
  };
}

export async function getPackages() {
  const pkgs = await prisma.tourPackage.findMany({
    include: { 
      priceTiers: { orderBy: { minPax: 'asc' } } 
    },
    orderBy: { createdAt: "desc" },
  });
  return pkgs.map(serializePackage);
}

export async function getPackageById(id: string) {
  const pkg = await prisma.tourPackage.findUnique({ 
    where: { id },
    include: { 
      priceTiers: { orderBy: { minPax: 'asc' } } 
    }
  });
  return serializePackage(pkg);
}

export async function getPackageBySlug(slug: string) {
  const pkg = await prisma.tourPackage.findUnique({ 
    where: { slug },
    include: { 
      priceTiers: { orderBy: { minPax: 'asc' } } 
    }
  });
  return serializePackage(pkg);
}

interface PackagePayload {
  titleId: string;
  titleEn: string;
  titleMs: string;
  descId?: string;
  descEn?: string;
  descMs?: string;
  locationId: string;
  locationEn: string;
  locationMs: string;
  durationId: string;
  durationEn: string;
  durationMs: string;
  capacity: number;
  facilityScore: number;
  departureScore: number;
  durationDays: number;
  images: string[];
  isPublished: boolean;
  priceTiers: { minPax: number; maxPax: number; price: number; originalPrice?: number }[];
}

function buildSlug(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") +
    "-" +
    Date.now()
  );
}

export async function createPackage(data: PackagePayload) {
  await prisma.tourPackage.create({
    data: {
      slug: buildSlug(data.titleEn || data.titleId), // Prefer EN for slug
      title: { id: data.titleId, en: data.titleEn, ms: data.titleMs },
      description: data.descId
        ? { id: data.descId, en: data.descEn ?? data.descId, ms: data.descMs ?? data.descId }
        : undefined,
      location: { id: data.locationId, en: data.locationEn, ms: data.locationMs },
      duration: { id: data.durationId, en: data.durationEn, ms: data.durationMs },
      capacity: data.capacity,
      facilityScore: data.facilityScore,
      departureScore: data.departureScore,
      durationDays: data.durationDays,
      images: data.images,
      isPublished: data.isPublished,
      priceTiers: {
        create: data.priceTiers
      }
    },
  });
  revalidatePath("/admin/packages");
  revalidatePath("/");
}

export async function updatePackage(id: string, data: PackagePayload) {
  await prisma.tourPackage.update({
    where: { id },
    data: {
      title: { id: data.titleId, en: data.titleEn, ms: data.titleMs },
      description: data.descId
        ? { id: data.descId, en: data.descEn ?? data.descId, ms: data.descMs ?? data.descId }
        : undefined,
      location: { id: data.locationId, en: data.locationEn, ms: data.locationMs },
      duration: { id: data.durationId, en: data.durationEn, ms: data.durationMs },
      capacity: data.capacity,
      facilityScore: data.facilityScore,
      departureScore: data.departureScore,
      durationDays: data.durationDays,
      images: data.images,
      isPublished: data.isPublished,
      priceTiers: {
        deleteMany: {},
        create: data.priceTiers
      }
    },
  });
  revalidatePath("/admin/packages");
  revalidatePath("/");
}

export async function togglePackagePublish(id: string, isPublished: boolean) {
  await prisma.tourPackage.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/packages");
  revalidatePath("/");
}

export async function deletePackage(id: string) {
  await prisma.tourPackage.delete({ where: { id } });
  revalidatePath("/admin/packages");
  revalidatePath("/");
}
