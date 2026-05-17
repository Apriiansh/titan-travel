# 🧠 Sistem Logika TOPSIS & Server Actions

Setelah menguasai Client, Server, dan Prisma, sekarang saatnya kita merangkai semuanya menjadi sebuah fitur cerdas: **Rekomendasi Paket Wisata (TOPSIS)**.

Di Titan Travel, alur pengerjaan logika SPK ini dibagi menjadi dua file agar rapi:
1. **File Mesin Matematika** (`src/lib/topsis.ts`) -> Hanya berisi rumus hitung-hitungan mentah.
2. **File Penghubung / Server Action** (`src/lib/actions/recommendation.ts`) -> Menghubungkan Prisma, mengatur bobot berdasar pilihan pengguna, lalu melemparnya ke File Mesin.

## Tahap 1: Server Action Menerima Input

Ketika pengunjung di browser memilih opsi *"Saya mau paket wisata yang mengutamakan Harga!"*, formulir *Client Component* akan memanggil Server Action ini:

```tsx
// File: src/lib/actions/recommendation.ts
"use server"; // Menandakan bahwa ini adalah Endpoint API tersembunyi

import { prisma } from "@/lib/prisma";
import { calculateTopsis } from "@/lib/topsis";

// 1. Menerima prioritas dari pengguna
export async function getPersonalizedRecommendations(pref: { priority: string }) {
  
  // 2. Ambil data mentah paket wisata dari Prisma
  const packages = await prisma.tourPackage.findMany({ 
    where: { isPublished: true }, 
    include: { priceTiers: true } 
  });

  // 3. Logika "Tweak" Bobot (Sangat Dinamis)
  // Bobot Normal (Seimbang)
  let weights = { c1_harga: 0.35, c2_fasilitas: 0.25, c3_waktu: 0.20, c4_durasi: 0.20 };
  
  // Jika User memilih "Harga", kita ubah matriks bobotnya secara instan!
  if (pref.priority === "price") {
    weights = { c1_harga: 0.55, c2_fasilitas: 0.15, c3_waktu: 0.15, c4_durasi: 0.15 }; 
  }
  
  // ... lanjut ke format data
}
```

## Tahap 2: Menyesuaikan Data untuk Mesin (Mapping)

Tabel `TourPackage` berisi ratusan detail (gambar, deskripsi, dll). Padahal Mesin TOPSIS hanya butuh Angka Harga, Skor Fasilitas, dan Durasi. Maka kita wajib memfilter datanya (Mapping).

```tsx
  // Di dalam fungsi yang sama...
  const alternatives = packages.map(pkg => {
    // Cari harga paling murah dari daftar tingkatan harga (Tier)
    const minPrice = pkg.priceTiers.length > 0 
      ? Math.min(...pkg.priceTiers.map(t => Number(t.price))) 
      : 0;

    return {
      id: pkg.id, // Kita butuh ID untuk menyatukannya lagi nanti
      c1_price: minPrice,
      c2_facilities: pkg.facilityScore, // Skala 1-5
      c3_departure: pkg.departureScore, 
      c4_duration: pkg.durationDays,
    };
  });
```

## Tahap 3: Mesin TOPSIS Bekerja

Setelah data siap, kita lemparkan ke fungsi `calculateTopsis()` yang berada di file terpisah (`src/lib/topsis.ts`). File ini berisi puluhan baris kalkulasi matriks *Euclidean* (yang tidak perlu kita bahas kerumitannya di sini).

```tsx
  // Kirim data yang sudah di-mapping beserta konfigurasi bobot (weights)
  const results = calculateTopsis(alternatives, weights);
```

Hasil return dari fungsi ini adalah urutan objek (Array) yang sudah memiliki nilai **`score` (0.00 - 1.00)** dan **`ranking` (Juara 1, 2, 3..)**.

## Tahap 4: Mengembalikan Data Penuh ke Client

Mesin TOPSIS hanya mengembalikan ID dan Skor. Browser butuh Judul Paket dan Gambar.
Sistem lalu menggabungkan kembali (Join) ID yang menang (Juara) dengan data objek mentah aslinya.

```tsx
  // 5. Kembalikan data lengkap paket yang sudah diranking ke Browser
  return results.map(res => {
    // Cari paket asli yang punya ID yang sama
    const pkg = packages.find(p => p.id === res.id);
    
    return {
      ...pkg, // Masukkan properti gambar, judul, deskripsi...
      topsisScore: res.score, // Masukkan properti tambahan skor
      ranking: res.ranking,   // Masukkan properti juara
    };
  });
```

Sampai tahap ini, data JSON sempurna sudah ditangkap oleh Browser, siap untuk di-render menggunakan UI Component (Shadcn)! Lanjut ke modul 05!


---
<div align="center">

[⬅️ Sebelumnya: Database & Prisma](./03_DATABASE_PRISMA.md) | [🏠 Indeks Utama](./00_CODING_INDEX.md) | [Selanjutnya: Komponen UI Shadcn ➡️](./05_KOMPONEN_UI_SHADCN.md)

</div>
