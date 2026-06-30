# Plan: Filter Paket Domestik / Internasional di Halaman Public

**Goal:** Tambah filter "Semua | Domestik | Internasional" di halaman `/paket`.

---

## Opsi 1: Database — Enum `PackageCategory`

Menambahkan field enum di schema Prisma.

### Scope

| Layer | File | Perubahan |
|-------|------|-----------|
| **Schema** | `prisma/schema.prisma` | Tambah `enum PackageCategory { DOMESTIC, INTERNATIONAL }` + field `category` di `TourPackage` |
| **Migration** | `npx prisma migrate dev` | Generate migration |
| **Seed** | `prisma/seed.ts` | Set `category` di semua 15 package (sesuai grouping: 6 DOMESTIC, 5 INTERNATIONAL, sisanya bisa DOMESTIC/null) |
| **Server action** | `src/lib/actions/packages.ts` | Tambah param `category?: PackageCategory` di `getPackages()` + update `createPackage`/`updatePackage` |
| **Admin form** | `admin/packages/components/PackageForm.tsx`, `types.ts`, `PackagesClient.tsx` | Tambah dropdown pilih `category` |
| **Admin table** | `admin/packages/components/PackageTable.tsx` | Opsional: tampilkan label kategori |
| **Public filter UI** | `src/app/paket/CatalogClient.tsx` + component baru | Tab/pill: "Semua | Domestik | Internasional", trigger re-fetch via `getPackages({ category })` |
| **Translasi** | `src/lib/translations.ts` | Tambah key untuk label filter (kalau belum ada yg reusable) |

### Pro ✅
- Type-safe, gak mungkin typo
- Extensible (nanti tambah `CORPORATE`, `FLIGHT_HOTEL`, dll)
- Filter di query langsung (WHERE clause), performa bagus walau data banyak

### Kontra ❌
- Butuh migration DB
- Banyak file yang disentuh
- Admin harus isi field category manual per package

---

## Opsi 2: Tanpa DB — Deteksi dari Title

Tidak ada perubahan DB. Kategori dideteksi dari field `title` paket dengan substring matching case-insensitive.

### Cara kerja
```
title.toLowerCase().includes("domestik")    → DOMESTIC
title.toLowerCase().includes("international") → INTERNATIONAL
title.toLowerCase().includes("internasional") → INTERNATIONAL
title.toLowerCase().includes("antarabangsa")  → INTERNATIONAL
lainnya                                      → null (tampil di "Semua")
```

### Scope

| Layer | File | Perubahan |
|-------|------|-----------|
| **Schema** | — | Tidak ada perubahan |
| **Helper** | `src/lib/package-utils.ts` (baru) atau di file terkait | Fungsi `detectCategory(title: Json): "domestic" \| "international" \| null` |
| **Server action** | `src/lib/actions/packages.ts` | `getPackages()` filter client-side setelah fetch, atau tambah logic di action |
| **Public filter UI** | `src/app/paket/CatalogClient.tsx` + komponen baru | Tab/pill filter, filtering dilakukan di client dari array penuh |
| **Admin** | — | Tidak ada perubahan (tidak perlu dropdown) |
| **Translasi** | `src/lib/translations.ts` | Sama seperti Opsi 1 |

### Pro ✅
- **Tanpa migration DB** — zero database changes
- **Minimal file disentuh** — cuma 2-3 file
- **Otomatis** — admin gak perlu isi field tambahan, cukup pastikan title mengandung kata kunci
- **Cocok untuk data sekarang** — semua 15 package di seed sudah punya title dengan kata kunci yang jelas (Bali, Lombok, Yogyakarta = domestik; Kuala Lumpur, Singapore, Tokyo, Seoul = internasional)

### Kontra ❌
- Kurang presisi — misal "Tour Domestik ke Bali" tapi destination-nya sebenarnya luar negeri? Tapi ini unlikely
- Filter di client-side (fetch semua dulu, baru filter) — performa tetap OK karena data package biasanya < 100
- Kalau title gak mengandung kata kunci, package tidak muncul di filter manapun (fallback bisa di-set ke "Semua" saja)

---

## Rekomendasi

Untuk **MVP / cepat rilis** → **Opsi 2**, karena tanpa migrasi, minim perubahan, dan data seed sudah mendukung.

Untuk **jangka panjang** → **Opsi 1**, kalau nanti butuh kategori lebih rigid (Corporate, Umrah, dll) dan ingin filter server-side yang scalable.
