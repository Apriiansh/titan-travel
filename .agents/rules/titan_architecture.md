# Titan Travel Architecture Rules

Panduan struktur dan pola pengembangan khusus untuk aplikasi Titan Travel.

## 1. Pola Data Fetching (Next.js 15+)
*   **Server Component (Default)**: Gunakan Server Components untuk halaman (`page.tsx`) dan ambil data langsung menggunakan fungsi library di server.
*   **Client Component**: Gunakan hanya untuk interaktivitas (form, chart, modal). Simpan di `src/components/panel/` atau `src/components/ui/`.
*   **API Routes**: Gunakan `src/app/api/...` untuk data yang perlu di-refresh secara dinamis di sisi klien tanpa refresh halaman (seperti tombol sinkronisasi).

## 2. Struktur Backend & Database
*   **Business Logic**: Semua logika database yang kompleks diletakkan di `src/lib/actions/*.ts`.
*   **Prisma Usage**: Gunakan metode standar Prisma untuk operasi CRUD. Gunakan `$queryRaw` **HANYA** untuk agregasi antar-tabel yang kompleks (seperti statistik TOPSIS).
*   **Seed Data**: Selalu update `prisma/seed.ts` jika ada perubahan struktur data dasar agar lingkungan pengembangan tetap sinkron.

## 3. Desain & Tema (UI/UX)
*   **Theme Tokens**: Dilarang menggunakan warna Hex hardcoded (seperti `#1E293B`). Selalu gunakan class Tailwind yang merujuk ke variabel CSS (`bg-background`, `text-foreground`, `border-card-border`).
*   **Responsive**: Semua komponen panel harus mendukung tampilan Mobile hingga Desktop.
*   **Theme Support**: Pastikan setiap komponen baru terlihat bagus di **Light** dan **Dark Mode**.
