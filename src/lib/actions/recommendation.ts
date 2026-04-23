"use server";

import { prisma } from "@/lib/prisma";
import { calculateTopsis, TopsisAlternative, TopsisConfig, getTopsisBadge } from "@/lib/topsis";

export type UserPreference = {
  priority: "price" | "facility" | "time" | "balanced";
  prefTime: number; // 1: Pagi, 2: Siang, 3: Malam
};

export async function getPersonalizedRecommendations(pref: UserPreference) {
  // 1. Ambil data paket asli (sertakan priceTiers karena kolom price sudah dihapus)
  const packages = await prisma.tourPackage.findMany({
    where: { isPublished: true },
    include: { priceTiers: true }
  });

  if (packages.length === 0) return [];

  // 2. Tentukan Bobot (Weights) berdasarkan Prioritas User
  let weights = { c1: 0.35, c2: 0.25, c3: 0.20, c4: 0.20 };

  if (pref.priority === "price") {
    weights = { c1: 0.55, c2: 0.15, c3: 0.15, c4: 0.15 };
  } else if (pref.priority === "facility") {
    weights = { c1: 0.20, c2: 0.50, c3: 0.15, c4: 0.15 };
  } else if (pref.priority === "time") {
    weights = { c1: 0.20, c2: 0.15, c3: 0.50, c4: 0.15 };
  }

  const config: TopsisConfig = {
    c1: { weight: weights.c1, type: "COST" },    
    c2: { weight: weights.c2, type: "BENEFIT" }, 
    c3: { weight: weights.c3, type: "COST" },    
    c4: { weight: weights.c4, type: "COST" },    
  };

  // 3. Map Alternatif
  const alternatives: TopsisAlternative[] = packages.map(pkg => {
    // Cari harga terendah dari tier untuk kriteria C1 TOPSIS
    const minPrice = pkg.priceTiers.length > 0 
      ? Math.min(...pkg.priceTiers.map(t => Number(t.price))) 
      : 0;

    let adjustedDepartureScore = pkg.departureScore;
    if (pkg.departureScore !== pref.prefTime) {
      adjustedDepartureScore = 1 + Math.abs(pkg.departureScore - pref.prefTime) * 2;
    } else {
      adjustedDepartureScore = 1; 
    }

    return {
      id: pkg.id,
      name: (pkg.title as any).id || (pkg.title as any).en || "Untitled",
      c1_price: minPrice,
      c2_facilities: pkg.facilityScore,
      c3_departure: adjustedDepartureScore, 
      c4_duration: pkg.durationDays,
    };
  });

  // 4. Jalankan TOPSIS
  const results = calculateTopsis(alternatives, config);

  // 5. Kembalikan data lengkap paket yang sudah diranking
  return results.map(res => {
    const pkg = packages.find(p => p.id === res.id);
    const tiers = (pkg?.priceTiers || []).map(t => ({
      ...t,
      price: Number(t.price),
      originalPrice: t.originalPrice ? Number(t.originalPrice) : null
    }));
    
    // Hitung harga terendah untuk tampilan UI "Mulai dari"
    const minTier = tiers.length > 0 
      ? tiers.reduce((min: any, p: any) => p.price < min.price ? p : min, tiers[0]) 
      : null;

    // Tambahkan Badge Otomatis dari TOPSIS
    const badge = getTopsisBadge(res.score, res.ranking);

    return {
      ...pkg,
      price: minTier ? minTier.price : 0,
      originalPrice: minTier ? minTier.originalPrice : null,
      priceTiers: tiers,
      topsisScore: res.score,
      ranking: res.ranking,
      badge
    };
  });
}
