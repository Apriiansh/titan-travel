"use server";

import { prisma } from "@/lib/prisma";
import { calculateTopsis, TopsisAlternative, TopsisConfig } from "@/lib/topsis";

export async function getTopsisAnalysis() {
  // 1. Ambil kriteria dari database
  const criteria = await prisma.topsisCriterion.findMany({
    orderBy: { code: 'asc' }
  });

  // 2. Ambil paket wisata yang dipublish
  const packages = await prisma.tourPackage.findMany({
    where: { isPublished: true },
    include: { priceTiers: true }
  });

  if (packages.length === 0 || criteria.length < 4) {
    return {
      results: [],
      criteria: criteria
    };
  }

  // 3. Map kriteria ke TopsisConfig
  const config: TopsisConfig = {
    c1: { 
      weight: criteria.find(c => c.code === 'C1')?.weight || 0.35, 
      type: (criteria.find(c => c.code === 'C1')?.type as any) || "COST" 
    },
    c2: { 
      weight: criteria.find(c => c.code === 'C2')?.weight || 0.25, 
      type: (criteria.find(c => c.code === 'C2')?.type as any) || "BENEFIT" 
    },
    c3: { 
      weight: criteria.find(c => c.code === 'C3')?.weight || 0.20, 
      type: (criteria.find(c => c.code === 'C3')?.type as any) || "COST" 
    },
    c4: { 
      weight: criteria.find(c => c.code === 'C4')?.weight || 0.20, 
      type: (criteria.find(c => c.code === 'C4')?.type as any) || "COST" 
    },
  };

  // 4. Map paket ke TopsisAlternative
  const alternatives: TopsisAlternative[] = packages.map(pkg => {
    // Ambil harga terendah dari tier untuk C1
    const minPrice = pkg.priceTiers.length > 0 
      ? Math.min(...pkg.priceTiers.map(t => Number(t.price))) 
      : 0;

    return {
      id: pkg.id,
      name: (pkg.title as any).id || (pkg.title as any).en || "Untitled",
      c1_price: minPrice,
      c2_facilities: pkg.facilityScore,
      c3_departure: pkg.departureScore,
      c4_duration: pkg.durationDays,
    };
  });

  // 5. Hitung TOPSIS
  const results = calculateTopsis(alternatives, config);

  return {
    results,
    criteria
  };
}

export async function updateTopsisCriteria(data: { id: string; weight: number; type: string }[]) {
  try {
    const updates = data.map(item => 
      prisma.topsisCriterion.update({
        where: { id: item.id },
        data: { 
          weight: item.weight,
          type: item.type
        }
      })
    );

    await prisma.$transaction(updates);
    return { success: true };
  } catch (error) {
    console.error("Failed to update criteria", error);
    return { success: false, error: "Gagal memperbarui kriteria" };
  }
}
