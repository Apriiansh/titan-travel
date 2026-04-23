/**
 * TITAN TRAVEL - TOPSIS ENGINE
 * 
 * Modul ini mengimplementasikan metode Technique for Order Preference by Similarity to Ideal Solution (TOPSIS).
 * Digunakan untuk meranking paket wisata secara objektif berdasarkan 4 kriteria utama.
 */

export interface TopsisAlternative {
  id: string;
  name: string;
  c1_price: number;       // Cost
  c2_facilities: number;  // Benefit (1-5)
  c3_departure: number;   // Cost (1: Pagi, 2: Siang, 3: Malam)
  c4_duration: number;    // Cost (Hari)
}

export interface TopsisResult extends TopsisAlternative {
  score: number;
  ranking: number;
}

export interface TopsisConfig {
  c1: { weight: number; type: "COST" | "BENEFIT" };
  c2: { weight: number; type: "COST" | "BENEFIT" };
  c3: { weight: number; type: "COST" | "BENEFIT" };
  c4: { weight: number; type: "COST" | "BENEFIT" };
}

/**
 * Fungsi Utama Kalkulasi TOPSIS (Dynamic)
 * @param alternatives Daftar paket wisata yang akan diranking
 * @param config Konfigurasi bobot dan tipe kriteria dari database
 * @returns Daftar paket wisata yang sudah dilengkapi skor Vi dan ranking
 */
export function calculateTopsis(
  alternatives: TopsisAlternative[],
  config: TopsisConfig
): TopsisResult[] {
  if (alternatives.length === 0) return [];

  // --- LANGKAH 1: Normalisasi Matriks (R) ---
  // Menghitung pembagi (akar jumlah kuadrat) per kriteria
  const sums = { c1: 0, c2: 0, c3: 0, c4: 0 };
  alternatives.forEach(alt => {
    sums.c1 += Math.pow(alt.c1_price, 2);
    sums.c2 += Math.pow(alt.c2_facilities, 2);
    sums.c3 += Math.pow(alt.c3_departure, 2);
    sums.c4 += Math.pow(alt.c4_duration, 2);
  });

  const divisors = {
    c1: Math.sqrt(sums.c1),
    c2: Math.sqrt(sums.c2),
    c3: Math.sqrt(sums.c3),
    c4: Math.sqrt(sums.c4),
  };

  // --- LANGKAH 2 & 3: Matriks Ternormalisasi Terbobot (Y) ---
  const weightedMatrix = alternatives.map(alt => ({
    id: alt.id,
    y1: (alt.c1_price / (divisors.c1 || 1)) * config.c1.weight,
    y2: (alt.c2_facilities / (divisors.c2 || 1)) * config.c2.weight,
    y3: (alt.c3_departure / (divisors.c3 || 1)) * config.c3.weight,
    y4: (alt.c4_duration / (divisors.c4 || 1)) * config.c4.weight,
  }));

  // --- LANGKAH 4: Menentukan Solusi Ideal Positif (A+) dan Negatif (A-) ---
  const aPlus = {
    y1: config.c1.type === "COST" ? Math.min(...weightedMatrix.map(m => m.y1)) : Math.max(...weightedMatrix.map(m => m.y1)),
    y2: config.c2.type === "COST" ? Math.min(...weightedMatrix.map(m => m.y2)) : Math.max(...weightedMatrix.map(m => m.y2)),
    y3: config.c3.type === "COST" ? Math.min(...weightedMatrix.map(m => m.y3)) : Math.max(...weightedMatrix.map(m => m.y3)),
    y4: config.c4.type === "COST" ? Math.min(...weightedMatrix.map(m => m.y4)) : Math.max(...weightedMatrix.map(m => m.y4)),
  };

  const aMinus = {
    y1: config.c1.type === "COST" ? Math.max(...weightedMatrix.map(m => m.y1)) : Math.min(...weightedMatrix.map(m => m.y1)),
    y2: config.c2.type === "COST" ? Math.max(...weightedMatrix.map(m => m.y2)) : Math.min(...weightedMatrix.map(m => m.y2)),
    y3: config.c3.type === "COST" ? Math.max(...weightedMatrix.map(m => m.y3)) : Math.min(...weightedMatrix.map(m => m.y3)),
    y4: config.c4.type === "COST" ? Math.max(...weightedMatrix.map(m => m.y4)) : Math.min(...weightedMatrix.map(m => m.y4)),
  };

  // --- LANGKAH 5: Menghitung Jarak Euclidean (D+ dan D-) ---
  const results = weightedMatrix.map((m, index) => {
    const dPlus = Math.sqrt(
      Math.pow(m.y1 - aPlus.y1, 2) +
      Math.pow(m.y2 - aPlus.y2, 2) +
      Math.pow(m.y3 - aPlus.y3, 2) +
      Math.pow(m.y4 - aPlus.y4, 2)
    );

    const dMinus = Math.sqrt(
      Math.pow(m.y1 - aMinus.y1, 2) +
      Math.pow(m.y2 - aMinus.y2, 2) +
      Math.pow(m.y3 - aMinus.y3, 2) +
      Math.pow(m.y4 - aMinus.y4, 2)
    );

    // --- LANGKAH 6: Menghitung Nilai Preferensi (Vi) ---
    const score = dMinus / (dPlus + dMinus) || 0;

    return {
      ...alternatives[index],
      score: Number(score.toFixed(4)),
    };
  });

  // --- LANGKAH 7: Perankingan (Sorting Descending) ---
  return results
    .sort((a, b) => b.score - a.score)
    .map((res, index) => ({
      ...res,
      ranking: index + 1,
    }));
}

/**
 * Helper untuk mendapatkan Label Badge otomatis berdasarkan skor Vi TOPSIS
 */
export function getTopsisBadge(score: number, ranking: number) {
  if (ranking === 1) {
    return {
      label: "Sangat Direkomendasikan",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: "Sparkles",
    };
  }

  if (score >= 0.75) {
    return {
      label: "Direkomendasikan",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "ThumbsUp",
    };
  }

  if (score >= 0.5) {
    return {
      label: "Cukup Sesuai",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "Check",
    };
  }

  return {
    label: "Pilihan Alternatif",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: "Info",
  };
}
