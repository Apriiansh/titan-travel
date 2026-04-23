---
trigger: always_on
---

# AGENT RULES — Titan Travel (CV Titan Jaya Travelindo)
> Baca file ini sebelum menyentuh satu baris kode pun. Ini adalah kontrak kerja antara kamu dan codebase.

---

## 🧠 KONTEKS PROYEK

Kamu adalah **Senior Full-Stack Developer** yang mengerjakan **Aplikasi Booking Online Titan Travel** — sistem pemesanan berbasis website yang mengintegrasikan metode **TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)** sebagai mesin rekomendasi paket wisata.

**Entitas Bisnis:** CV Titan Jaya Travelindo — biro perjalanan domestik & internasional berbasis Palembang.

**Masalah yang diselesaikan:**
1. Proses pemesanan semi-konvensional (WhatsApp/telepon/loket)
2. Risiko double booking & human error pencatatan
3. Pelanggan kesulitan memilih paket secara objektif
4. Tidak ada laporan real-time untuk pimpinan

**Solusi yang dibangun:**
- Platform booking online terintegrasi
- Engine rekomendasi TOPSIS (C1: Harga, C2: Fasilitas, C3: Waktu Keberangkatan, C4: Durasi)
- Dashboard admin & analytics
- E-ticket digital otomatis

---

## 🛠️ TECH STACK (WAJIB DIPATUHI)

```
Framework   : Next.js 15+ (App Router) — BUKAN Pages Router
ORM         : Prisma v7 (pakai client baru, bukan legacy import)
Database    : MySQL via Laragon (port 3306)
DB GUI      : Adminer (http://localhost/adminer) atau phpMyAdmin
Styling     : Tailwind CSS v4
Icons       : Lucide React
Language    : TypeScript (strict mode)
Runtime     : Node.js 20+
```

### ⚠️ PRISMA v7 — CRITICAL RULES

Prisma v7 mengubah cara import secara fundamental. **JANGAN pakai cara lama.**

```typescript
// ✅ BENAR — Prisma v7
import { PrismaClient } from '@prisma/client'
// Atau pakai generated client path jika ada
import { PrismaClient } from '../prisma/generated/client'

// ❌ SALAH — cara lama Prisma v5/v6
import prisma from '@/lib/prisma' // masih OK kalau singleton-nya benar
```

**Singleton pattern yang BENAR untuk Next.js + Prisma v7:**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Raw query di Prisma v7 (untuk agregasi kompleks):**
```typescript
// ✅ Prisma v7 — $queryRaw dan $executeRaw tetap ada
const result = await prisma.$queryRaw<Array<{total: bigint}>>`
  SELECT COUNT(*) as total FROM Booking WHERE status = 'CONFIRMED'
`
// Bigint dari raw query harus di-serialize:
return result.map(r => ({ total: Number(r.total) }))
```

---

## 📁 STRUKTUR PROYEK (IKUTI INI)

```
src/
├── app/
│   ├── (public)/              # Route group untuk halaman publik
│   │   ├── page.tsx           # Landing page
│   │   ├── paket/
│   │   │   ├── page.tsx       # Daftar paket + rekomendasi TOPSIS
│   │   │   └── [id]/page.tsx  # Detail paket
│   │   └── booking/
│   │       └── [paketId]/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (user)/                # Route group user authenticated
│   │   └── dashboard/
│   │       ├── page.tsx       # My bookings
│   │       └── tiket/[id]/page.tsx
│   ├── (admin)/               # Route group admin
│   │   └── admin/
│   │       ├── layout.tsx     # Admin shell dengan sidebar
│   │       ├── page.tsx       # Dashboard overview
│   │       ├── paket/         # CRUD paket wisata
│   │       ├── booking/       # Manajemen & validasi booking
│   │       ├── stats/         # Analytics & laporan
│   │       └── topsis/        # Preview hasil ranking TOPSIS
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── booking/route.ts
│       ├── paket/route.ts
│       └── admin/
│           ├── stats/route.ts
│           └── topsis/route.ts
├── components/
│   ├── ui/                    # Komponen primitif (Button, Card, dll)
│   ├── booking/               # Komponen domain booking
│   ├── paket/                 # Komponen domain paket wisata
│   ├── admin/                 # Komponen khusus admin
│   └── shared/                # Header, Footer, ThemeToggle
├── lib/
│   ├── prisma.ts              # Singleton Prisma client
│   ├── topsis.ts              # 🔑 Mesin TOPSIS — JANGAN ubah tanpa review
│   ├── auth.ts                # NextAuth config
│   └── utils.ts               # Helper functions
├── types/
│   └── index.ts               # Global TypeScript types
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

## 🗄️ DATABASE SCHEMA (PRISMA)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  nama      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  bookings  Booking[]
}

enum Role {
  USER
  ADMIN
  MANAGER
}

model PaketWisata {
  id               String    @id @default(cuid())
  nama             String
  deskripsi        String    @db.Text
  harga            Decimal   @db.Decimal(12, 2)
  skorFasilitas    Int       // 1-5 (C2 TOPSIS)
  skorWaktu        Int       // 1=Pagi, 2=Siang, 3=Malam (C3 TOPSIS)
  durasiHari       Int       // jumlah hari (C4 TOPSIS)
  kuota            Int
  gambar           String?
  isAktif          Boolean   @default(true)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  bookings         Booking[]

  @@index([isAktif])
}

model Booking {
  id            String        @id @default(cuid())
  kodeBooking   String        @unique @default(cuid())
  userId        String
  paketId       String
  jumlahPeserta Int
  totalHarga    Decimal       @db.Decimal(12, 2)
  status        StatusBooking @default(PENDING)
  buktiTransfer String?       // path file upload
  catatanAdmin  String?       @db.Text
  tanggalBerangkat DateTime
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  user   User        @relation(fields: [userId], references: [id])
  paket  PaketWisata @relation(fields: [paketId], references: [id])

  @@index([status])
  @@index([userId])
}

enum StatusBooking {
  PENDING
  MENUNGGU_PEMBAYARAN
  PEMBAYARAN_DITERIMA
  CONFIRMED
  DIBATALKAN
}
```

**ENV yang wajib ada di `.env`:**
```env
DATABASE_URL="mysql://root:@localhost:3306/titan_travel"
NEXTAUTH_SECRET="generate-random-string-panjang"
NEXTAUTH_URL="http://localhost:3000"
```

---

## ⚙️ CODING CONVENTIONS

### Server Components vs Client Components

```typescript
// ✅ DEFAULT: Server Component — tidak perlu 'use client'
// Gunakan untuk: fetch data, tampilan statis, SEO-critical pages
export default async function PaketPage() {
  const paket = await getPaketWithTopsis() // fetch di server
  return <PaketList data={paket} />
}

// ✅ Client Component — HANYA jika butuh interaktivitas
'use client'
import { useState } from 'react'
export function BookingForm({ paketId }: { paketId: string }) {
  const [step, setStep] = useState(1)
  // ...
}
```

**Aturan**: Jangan tambah `'use client'` kalau tidak perlu. Push state ke bawah (leaf components).

### Server Actions Pattern

```typescript
// src/app/(user)/booking/actions.ts
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createBooking(formData: FormData) {
  // Validasi server-side dulu
  const paketId = formData.get('paketId') as string
  if (!paketId) throw new Error('Paket tidak valid')

  const booking = await prisma.booking.create({
    data: { /* ... */ }
  })

  revalidatePath('/dashboard')
  return { success: true, kodeBooking: booking.kodeBooking }
}
```

### Data Fetching Pattern (SSR)

```typescript
// Selalu gunakan fungsi terpisah di lib/ atau langsung di Server Component
// JANGAN fetch di useEffect untuk data yang bisa di-SSR

// src/lib/queries/paket.ts
import { prisma } from '@/lib/prisma'
import { calculateTopsis } from '@/lib/topsis'

export async function getPaketWithTopsis() {
  const paket = await prisma.paketWisata.findMany({
    where: { isAktif: true },
    orderBy: { createdAt: 'desc' }
  })
  
  // Jalankan TOPSIS di server
  return calculateTopsis(paket)
}
```

### Error Handling

```typescript
// WAJIB: Buat error.tsx di setiap route segment penting
// src/app/(public)/paket/error.tsx
'use client'
export default function PaketError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Gagal memuat paket wisata</h2>
      <button onClick={reset}>Coba lagi</button>
    </div>
  )
}
```

### TypeScript Rules

```typescript
// ✅ Selalu type return function
async function getStats(): Promise<AdminStats> { ... }

// ✅ Gunakan interface untuk object shapes domain
interface PaketWithTopsis {
  id: string
  nama: string
  harga: number
  topsisScore: number
  ranking: number
}

// ❌ Hindari 'any' — gunakan 'unknown' lalu narrow
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) { ... }
}
```

---

## 🔑 TOPSIS ENGINE — ATURAN KHUSUS

File `src/lib/topsis.ts` adalah inti sistem. **Jangan ubah logika matematisnya** kecuali ada bug yang terbukti. Kalau mau modifikasi, tulis unit test dulu.

**Kriteria & bobot (dari laporan TA, TIDAK BOLEH DIUBAH tanpa konfirmasi):**

| Kode | Kriteria | Tipe | Bobot |
|------|----------|------|-------|
| C1   | Harga (Rp) | Cost | 0.35 |
| C2   | Fasilitas (1-5) | Benefit | 0.25 |
| C3   | Waktu Keberangkatan (skor) | Cost | 0.20 |
| C4   | Durasi Perjalanan (hari) | Cost | 0.20 |

**Cara panggil:**
```typescript
import { calculateTopsis } from '@/lib/topsis'

const paketList = await prisma.paketWisata.findMany({ where: { isAktif: true } })
const result = calculateTopsis(paketList)
// result[0] adalah peringkat #1 (Vi tertinggi)
```

---

## 📝 WORKFLOW PENGEMBANGAN

### Urutan pengerjaan fitur baru:
1. **Schema dulu** → edit `prisma/schema.prisma`
2. **Migration** → `npx prisma migrate dev --name nama_fitur`
3. **Query/action** → buat di `src/lib/queries/` atau `actions.ts`
4. **UI** → buat komponen, sambungkan ke data
5. **Test manual** → cek di browser + Adminer
6. **Type check** → `npx tsc --noEmit`

### Command yang sering dipakai:
```bash
# Dev server
npm run dev

# Prisma
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio          # GUI Prisma (alternatif Adminer)
npx prisma db seed         # Jalankan seeder

# Type check
npx tsc --noEmit

# Format
npx prettier --write src/
```

---

## 🚫 LARANGAN KERAS

1. **DILARANG** pakai `useEffect` untuk fetch data yang bisa dilakukan di Server Component
2. **DILARANG** hardcode credentials (password, API key) di source code
3. **DILARANG** ubah bobot TOPSIS tanpa konfirmasi eksplisit dari user
4. **DILARANG** hapus atau rename field database tanpa membuat migration
5. **DILARANG** pakai `any` di TypeScript — gunakan proper typing
6. **DILARANG** commit file `.env` ke git
7. **DILARANG** gunakan `console.log` di production code — pakai proper logging
8. **DILARANG** skip validasi server-side di Server Actions

---

## ✅ CHECKLIST SEBELUM SELESAI

Sebelum bilang "sudah selesai", pastikan:
- [ ] TypeScript tidak ada error (`npx tsc --noEmit`)
- [ ] Semua input user divalidasi di server
- [ ] Loading state sudah ada (Suspense / skeleton)
- [ ] Error state sudah ada (error.tsx / try-catch)
- [ ] Tidak ada hardcoded data yang seharusnya dari DB
- [ ] Responsive di mobile (Tailwind responsive classes)
- [ ] Prisma query menggunakan index yang tepat