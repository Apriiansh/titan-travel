# 🧱 Fundamental Next.js 15: Server vs Client di Titan Travel

Bagi pemula yang baru pindah dari React versi lama (Vite/CRA), Next.js 15 App Router menggunakan pendekatan mental yang berbeda. Mari kita bedah langsung menggunakan kode di Titan Travel.

## 1. Apa itu Server Component?

Di Next.js 15, **semua file secara default adalah Server Component**. 
Artinya, kode tersebut dieksekusi di Server (Terminal/Backend), bukan di Browser Chrome/Safari pengguna.

### Kapan menggunakannya?
Gunakan *Server Component* untuk melakukan tugas "Berat" dan "Rahasia":
- Mengambil data dari Database (Prisma).
- Membaca rahasia di `.env` (seperti API Keys).
- Merender layout kerangka utama halaman.

### Contoh di Titan Travel (`src/app/page.tsx`):
```tsx
import { prisma } from "@/lib/prisma";
import PackagesSection from "@/components/PackagesSection";

// Ini adalah Server Component! 
// Tidak ada useState, tidak ada onClick.
export default async function HomePage() {
  // Query DB langsung di dalam komponen! Ini sangat aman.
  const packages = await prisma.tourPackage.findMany({
    where: { isPublished: true }
  });

  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">Jelajahi Dunia Bersama Titan</h1>
      {/* Kita kirim data mentah hasil DB ke dalam Komponen lain */}
      <PackagesSection initialData={packages} />
    </main>
  );
}
```

## 2. Apa itu Client Component?

Client Component dikirimkan ke Browser pengguna, dan barulah Javascript berjalan di sana. Ciri utamanya adalah wajib memiliki baris `"use client";` di paling atas file.

### Kapan menggunakannya?
- Jika Anda butuh `onClick`, `onChange`, `onSubmit`.
- Jika Anda butuh *Hooks* React seperti `useState`, `useEffect`.
- Jika Anda menggunakan elemen interaktif (Dropdown, Modal, Accordion).

### Contoh di Titan Travel (`src/components/panel/TopsisAnalysisClient.tsx`):
```tsx
"use client"; // INI WAJIB! Menandakan ini dieksekusi di browser

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TopsisAnalysisClient({ initialData }) {
  // Boleh pakai State
  const [isLoading, setIsLoading] = useState(false);

  // Boleh pakai event handler
  const handleKlik = () => {
    setIsLoading(true);
    alert("Menjalankan Analisis TOPSIS...");
  };

  return (
    <div>
      <Button onClick={handleKlik} disabled={isLoading}>
        {isLoading ? "Memproses..." : "Mulai Analisis"}
      </Button>
    </div>
  );
}
```

## 3. Kombinasi Keduanya (Aturan Emas)

Agar web sangat cepat: **"Kirim struktur HTML mentah dari Server Component, dan tempelkan Client Component di ujungnya hanya jika ada tombol/interaksi"**.

Contoh yang SALAH ❌:
Membuat seluruh halaman `src/app/page.tsx` menjadi `"use client";` hanya karena butuh satu tombol *Like*. Ini akan membuat seluruh halaman dirender secara lambat di HP pengguna.

Contoh yang BENAR ✅ (Gaya Titan Travel):
Halaman `page.tsx` biarkan sebagai *Server Component*, buat file baru `LikeButton.tsx` yang diberi `"use client";`, lalu pasang `<LikeButton />` di dalam `page.tsx`.


---
<div align="center">

[🏠 Indeks Utama](./00_CODING_INDEX.md) | [Selanjutnya: Struktur Direktori & Fungsi ➡️](./02_STRUKTUR_DIREKTORI_FUNGSI.md)

</div>
