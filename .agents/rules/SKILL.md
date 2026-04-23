---
trigger: always_on
---

# SKILL — Titan Travel Development Workflow
> Dokumen ini adalah "otak domain" agent. Baca setelah AGENT.md.

---

## 🎯 PRIORITAS PENGERJAAN (dari PROGRESS.md)

| Prioritas | Fitur | Status Saat Ini |
|-----------|-------|-----------------|
| 🔴 HIGH | Implementasi `src/lib/topsis.ts` | ✅ DONE |
| 🔴 HIGH | Form edit paket (+ input skor fasilitas & waktu) | Pending |
| 🟡 MED | Refaktor `/admin/bookings` ke SSR pattern | Pending |
| 🟢 LOW | Download laporan PDF/Excel | Backlog |

---

## 🔄 ALUR KERJA FITUR BARU (SOP)

### A. Fitur yang menyentuh database

```
1. Edit prisma/schema.prisma
   ↓
2. npx prisma migrate dev --name <nama_fitur>
   ↓
3. npx prisma generate
   ↓
4. Buat/edit query di src/lib/queries/<domain>.ts
   ↓
5. Buat Server Action di src/app/.../actions.ts
   ↓
6. Buat/edit UI component
   ↓
7. Sambungkan di page.tsx (Server Component)
   ↓
8. npx tsc --noEmit  ← WAJIB sebelum selesai
```

### B. Fitur UI-only (tidak ada perubahan DB)

```
1. Buat komponen di src/components/<domain>/
   ↓
2. Import di page.tsx yang relevan
   ↓
3. Styling dengan Tailwind CSS
   ↓
4. Cek responsive (sm: md: lg:)
```

---

## 💡 PATTERN YANG SUDAH TERBUKTI (COPY PASTE INI)

### Pattern 1: Server Component dengan Suspense

```tsx
// src/app/(public)/paket/page.tsx
import { Suspense } from 'react'
import { PaketList } from '@/components/paket/PaketList'
import { getPaketWithTopsis } from '@/lib/queries/paket'
import { PaketSkeleton } from '@/components/paket/PaketSkeleton'

// Pisahkan async component agar Suspense bisa bekerja
async function PaketContent() {
  const paket = await getPaketWithTopsis()
  return <PaketList data={paket} />
}

export default function PaketPage() {
  return (
    <main>
      <h1>Paket Wisata Tersedia</h1>
      <Suspense fallback={<PaketSkeleton />}>
        <PaketContent />
      </Suspense>
    </main>
  )
}
```

### Pattern 2: Server Action dengan validasi

```typescript
// src/app/(user)/booking/actions.ts
'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createBookingAction(formData: FormData) {
  // 1. Cek autentikasi
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  // 2. Ekstrak & validasi input
  const paketId = formData.get('paketId') as string
  const jumlahPeserta = Number(formData.get('jumlahPeserta'))
  const tanggalRaw = formData.get('tanggalBerangkat') as string

  if (!paketId || !jumlahPeserta || jumlahPeserta < 1) {
    throw new Error('Data tidak lengkap atau tidak valid')
  }

  // 3. Cek ketersediaan paket
  const paket = await prisma.paketWisata.findUnique({
    where: { id: paketId, isAktif: true }
  })
  if (!paket) throw new Error('Paket tidak ditemukan atau tidak aktif')

  // 4. Hitung total harga
  const totalHarga = Number(paket.harga) * jumlahPeserta

  // 5. Simpan ke DB
  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      paketId,
      jumlahPeserta,
      totalHarga,
      tanggalBerangkat: new Date(tanggalRaw),
      status: 'PENDING',
    }
  })

  // 6. Invalidate cache
  revalidatePath('/dashboard')
  revalidatePath('/admin/booking')

  return { success: true, kodeBooking: booking.kodeBooking }
}
```

### Pattern 3: Admin stats dengan $queryRaw

```typescript
// src/lib/queries/stats.ts
import { prisma } from '@/lib/prisma'

export interface AdminStats {
  totalBooking: number
  totalPendapatan: number
  bookingPending: number
  bookingConfirmed: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const [countResult, revenueResult] = await Promise.all([
    prisma.$queryRaw<Array<{
      total: bigint
      pending: bigint
      confirmed: bigint
    }>>`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed
      FROM Booking
    `,
    prisma.$queryRaw<Array<{ revenue: string | null }>>`
      SELECT SUM(totalHarga) as revenue
      FROM Booking
      WHERE status = 'CONFIRMED'
    `
  ])

  const row = countResult[0]
  return {
    totalBooking: Number(row?.total ?? 0),
    bookingPending: Number(row?.pending ?? 0),
    bookingConfirmed: Number(row?.confirmed ?? 0),
    totalPendapatan: parseFloat(revenueResult[0]?.revenue ?? '0'),
  }
}
```

### Pattern 4: Upload bukti transfer

```typescript
// src/app/api/booking/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('bukti') as File
  const bookingId = formData.get('bookingId') as string

  if (!file || file.size > 5 * 1024 * 1024) { // max 5MB
    return NextResponse.json({ error: 'File tidak valid atau terlalu besar' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `bukti_${bookingId}_${Date.now()}.${ext}`
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  // Update booking
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      buktiTransfer: `/uploads/${fileName}`,
      status: 'MENUNGGU_PEMBAYARAN',
    }
  })

  return NextResponse.json({ success: true, path: `/uploads/${fileName}` })
}
```

### Pattern 5: Paket list dengan badge TOPSIS

```tsx
// src/components/paket/PaketCard.tsx
import { TopsisResult, formatTopsisScore } from '@/lib/topsis'
import { labelWaktuKeberangkatan } from '@/lib/topsis'

interface PaketCardProps {
  paket: TopsisResult
  showRanking?: boolean
}

const WARNA_CLASS = {
  green:  'bg-green-100 text-green-800 border-green-200',
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red:    'bg-red-100 text-red-800 border-red-200',
}

export function PaketCard({ paket, showRanking = true }: PaketCardProps) {
  const { persen, warna } = formatTopsisScore(paket.topsisScore)

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {showRanking && paket.ranking === 1 && (
        <div className="mb-2 inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-1 rounded-full">
          ⭐ Rekomendasi Terbaik
        </div>
      )}

      <h3 className="font-semibold text-lg">{paket.nama}</h3>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <span>💰 Rp {paket.harga.toLocaleString('id-ID')}</span>
        <span>⭐ Fasilitas: {paket.skorFasilitas}/5</span>
        <span>🕐 {labelWaktuKeberangkatan(paket.skorWaktu)}</span>
        <span>📅 {paket.durasiHari} hari</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${WARNA_CLASS[warna]}`}>
          {paket.label} ({persen})
        </span>
        <span className="text-xs text-gray-400">Ranking #{paket.ranking}</span>
      </div>
    </div>
  )
}
```

---

## 🐛 TROUBLESHOOTING UMUM

### Prisma: "Can't reach database server"
```bash
# Pastikan Laragon berjalan, lalu cek koneksi:
# DATABASE_URL="mysql://root:@localhost:3306/titan_travel"
# Password kosong untuk Laragon default

# Test koneksi:
npx prisma db pull
```

### Prisma v7: "PrismaClient is not a constructor"
```bash
# Regenerate client:
npx prisma generate

# Kalau masih error, cek apakah ada konflik versi:
npm list @prisma/client prisma
```

### Next.js: "Event handlers cannot be passed to Client Component props"
```
Artinya kamu passing function dari Server Component ke Client Component.
Solusi: jadikan component tersebut 'use client', atau gunakan Server Action.
```

### Bigint dari $queryRaw tidak bisa di-JSON.stringify
```typescript
// Error: Do not know how to serialize a BigInt
// Solusi: konversi dulu
const result = rows.map(r => ({
  ...r,
  count: Number(r.count), // bigint → number
}))
```

### TOPSIS menghasilkan NaN
```
Kemungkinan:
1. Ada paket dengan harga 0 — validasi di form admin
2. Semua nilai kriteria sama — edge case yang valid (TOPSIS tetap jalan)
3. Array paket kosong — cek filter isAktif

Debug: console.log intermediate values di _normalized, _weighted
```

---

## 📊 ALUR TOPSIS DI SISTEM

```
[Admin input paket + nilai kriteria]
            ↓
[Database: PaketWisata.skorFasilitas, .skorWaktu, .durasiHari, .harga]
            ↓
[Server Component: getPaketWithTopsis()]
            ↓
[lib/topsis.ts: calculateTopsis(paketList)]
            ↓
  Step 1: Normalisasi (r_ij = x_ij / √Σx²)
  Step 2: Pembobotan (y_ij = w_j × r_ij)
  Step 3: Ideal A+ dan A-
  Step 4: Jarak Euclidean D+ dan D-
  Step 5: Vi = D- / (D+ + D-)
  Step 6: Sort descending → Ranking
            ↓
[UI: PaketCard dengan badge ranking dan label]
```

---

## 🎨 DESIGN TOKENS TAILWIND

```
Warna utama brand Titan Travel:
- Primary: blue-600
- Secondary: amber-500 (aksen premium)
- Success: green-600
- Warning: orange-500
- Danger: red-600
- Neutral: slate-*

Font: Inter (sudah di Next.js default) atau Geist

Card pattern:
  bg-white dark:bg-slate-800
  border border-slate-200 dark:border-slate-700
  rounded-xl shadow-sm

Badge TOPSIS:
  - Sangat Direkomendasikan: green
  - Direkomendasikan: blue
  - Cukup: yellow
  - Kurang: orange
  - Tidak: red
```

---

## 📁 FILE YANG WAJIB ADA DI ROOT

```
.env                    ← jangan di-commit
.env.example            ← template tanpa nilai sensitif
.gitignore              ← include .env, node_modules, .next
AGENT.md                ← rules file ini
PROGRESS.md             ← tracking status pengerjaan
prisma/schema.prisma
```

---

## 🔐 ENVIRONMENT VARIABLES LENGKAP

```env
# .env.example (aman untuk di-commit)

# Database — Laragon default
DATABASE_URL="mysql://root:@localhost:3306/titan_travel"

# NextAuth
NEXTAUTH_SECRET="ganti-dengan-random-string-32-karakter"
NEXTAUTH_URL="http://localhost:3000"

# Upload (opsional jika pakai cloud storage)
# UPLOAD_DIR="public/uploads"
# MAX_FILE_SIZE="5242880"   # 5MB dalam bytes
```