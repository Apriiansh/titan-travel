# 🗄️ Komunikasi Database dengan Prisma ORM

Sebagai pengembang pemula, menulis query SQL murni seperti `SELECT * FROM users WHERE id = 1` rentan terhadap kesalahan ketik dan tidak mendukung *Autocomplete* (IntelliSense) di VSCode.

Oleh karena itu, Titan Travel menggunakan **Prisma ORM**.

## 1. Schema: Cetak Biru Database (`prisma/schema.prisma`)

Seluruh struktur database tidak di-*setting* langsung di PhpMyAdmin atau DBeaver, melainkan ditulis di file ini. 

Contoh skema `TopsisCriterion` (Kriteria Penilaian):
```prisma
model TopsisCriterion {
  id     String @id @default(uuid()) // Otomatis buat ID acak unik
  code   String @unique // C1, C2, C3. Tidak boleh kembar (@unique)
  name   String
  weight Float  // Tipe data Desimal
  type   String // COST atau BENEFIT

  updatedAt DateTime @updatedAt // Otomatis catat jam diubah

  @@map("topsis_criteria") // Nama tabel aslinya di SQL
}
```

## 2. Prisma Client: Mengambil Data dengan Elegan

Setelah skema dibuat, Prisma otomatis menghasilkan fungsi-fungsi Typescript (sehingga tidak ada error *typo* kolom database).

Dalam Server Component atau Server Actions, kita mengambil data seperti ini:

```typescript
import { prisma } from "@/lib/prisma";

async function ambilPaketWisata() {
  // Ini sama dengan: SELECT * FROM tour_packages WHERE isPublished = true
  const packages = await prisma.tourPackage.findMany({
    where: { 
      isPublished: true 
    },
    // Mengambil relasi! Sama seperti INNER JOIN pada SQL
    include: { 
      priceTiers: true 
    }
  });

  return packages;
}
```

## 3. Seed: Memasukkan Data Default Otomatis

Bagaimana jika proyek ini ditarik ke komputer lain? Kosong dong datanya? 
Tenang, Titan Travel memiliki `prisma/seed.ts`. File ini berfungsi menyuntikkan data *default* (seperti akun Admin pertama dan data Kriteria TOPSIS) agar sistem bisa langsung berjalan.

Perintah Node.js akan memanggil file tersebut dan menjalankan:
```typescript
  // Memasukkan 4 kriteria TOPSIS default
  await prisma.topsisCriterion.createMany({
    data: [
      { code: 'C1', name: 'Harga Total', weight: 0.35, type: 'COST' },
      { code: 'C2', name: 'Fasilitas & Layanan', weight: 0.25, type: 'BENEFIT' },
      { code: 'C3', name: 'Waktu Keberangkatan', weight: 0.20, type: 'COST' },
      { code: 'C4', name: 'Durasi Liburan', weight: 0.20, type: 'COST' }
    ]
  });
```

**Perintah Terminal Esensial Prisma:**
- `npx prisma db push` : Menyinkronkan bentuk `schema.prisma` langsung ke database SQL Anda.
- `npx prisma db seed` : Menjalankan file `seed.ts` untuk mengisi data awal.
- `npx prisma studio` : Membuka GUI via Browser (mirip PhpMyAdmin) untuk melihat isi data Prisma secara instan.


---
<div align="center">

[⬅️ Sebelumnya: Struktur Direktori](./02_STRUKTUR_DIREKTORI_FUNGSI.md) | [🏠 Indeks Utama](./00_CODING_INDEX.md) | [Selanjutnya: Sistem Rekomendasi TOPSIS ➡️](./04_SISTEM_REKOMENDASI_TOPSIS.md)

</div>
