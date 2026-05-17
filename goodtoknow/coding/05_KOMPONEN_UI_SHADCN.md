# 💅 Antarmuka Klien: Shadcn UI & Tailwind

Setelah Server Action mengembalikan data paket wisata yang sudah diranking oleh TOPSIS (dari Modul 04), sekarang giliran *Client Component* untuk memamerkannya ke pengunjung web!

## 1. Menyambut Shadcn UI

Jika Anda membuka folder `src/components/ui`, Anda akan melihat banyak file. Jangan ubah isinya jika tidak terpaksa. 
Ini adalah komponen dari **Shadcn UI**. Shadcn menggunakan Tailwind CSS untuk styling (desain).

Kelebihan utama Shadcn: Kita tinggal "pasang balok lego" dengan sangat mudah.

### Contoh Pemanggilan Shadcn Component:
```tsx
import { Button } from "@/components/ui/button"; // Tombol Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Kartu Shadcn

export default function MyComponent() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tur Bali 3 Hari</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="destructive">Hapus Tur</Button>
      </CardContent>
    </Card>
  )
}
```
*Sangat rapi, mudah dibaca, dan pastinya sangat Accessible (Ramah Disabilitas/Screen Reader).*

## 2. Implementasi Client Component untuk Hasil Rekomendasi

Mari kita buat file `RecommendationResults.tsx` yang bersifat *"use client"* untuk merender hasil dari Server Actions kita:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; 
import { getPersonalizedRecommendations } from "@/lib/actions/recommendation";

export default function RecommendationForm() {
  const [packages, setPackages] = useState([]); // Menampung hasil juara 1, 2, 3..
  const [loading, setLoading] = useState(false);

  // Fungsi yang dipanggil saat user menekan tombol cari
  async function onSubmit() {
    setLoading(true);
    // Memanggil Server Action! Data TOPSIS sedang bekerja di belakang layar...
    const hasil = await getPersonalizedRecommendations({ priority: "price" });
    setPackages(hasil);
    setLoading(false);
  }

  return (
    <div className="p-4">
      {/* Tombol pemicu dari Shadcn */}
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Memproses AI..." : "Cari Paket Terbaik"}
      </Button>

      {/* Looping / Mengulang hasil data menggunakan Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {packages.map((pkg) => (
          <div key={pkg.id} className="rounded-xl border shadow-lg overflow-hidden">
            
            <div className="p-4">
              <h3 className="font-bold text-xl">{pkg.title.en}</h3>
              <p className="text-gray-500">
                Skor Rekomendasi: {(pkg.topsisScore * 100).toFixed(1)}%
              </p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 3. Rahasia Tailwind CSS: Utility First

Perhatikan kode `className="grid grid-cols-1 md:grid-cols-3 gap-6"`.
Itu adalah Tailwind CSS! Artinya:
1. `grid`: Jadikan ini susunan petak.
2. `grid-cols-1`: Untuk HP (Mobile), buat hanya 1 kolom memanjang ke bawah.
3. `md:grid-cols-3`: Untuk Tablet/Laptop (`md:` / medium device), jejerkan ke samping menjadi 3 kolom.
4. `gap-6`: Beri jarak yang lumayan luas antar kotak.

Sangat intuitif bukan? Tidak perlu lagi membuat file `.css` khusus yang bikin bingung saat proyek semakin raksasa!

Selamat! Anda telah memahami siklus lengkap dari Struktur Proyek -> UI Component -> Server Action -> Database -> Mesin TOPSIS -> Kembali ke UI. 🎉


---
<div align="center">

[⬅️ Sebelumnya: Sistem Rekomendasi TOPSIS](./04_SISTEM_REKOMENDASI_TOPSIS.md) | [🏠 Indeks Utama](./00_CODING_INDEX.md)

</div>
