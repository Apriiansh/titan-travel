# 🏆 Best Practices - Titan Travel Architecture

Dokumen ini berisi standar koding wajib untuk menjaga kualitas dan performa aplikasi.

## 1. Component Architecture
- **Avoid God Components**: Jangan biarkan file Client Component melebihi 300-400 baris. Pecah menjadi sub-komponen di folder `components/` lokal.
- **Server-First Pattern**: Lakukan data fetching di Server Components (`page.tsx`) dan teruskan ke Client Components sebagai props.
- **Leaf Components**: Gunakan `'use client'` hanya pada komponen terkecil yang membutuhkan interaksi (tombol, input, modal).

## 2. Data Handling & Backend
- **Server Actions over API**: Gunakan Server Actions (`src/lib/actions/`) untuk mutasi data internal (Create/Update/Delete). Gunakan API Routes hanya untuk integrasi luar atau webhook.
- **Prisma Efficiency**: Selalu gunakan `include` hanya untuk data yang benar-benar dibutuhkan untuk menghindari *over-fetching*.
- **BigInt Serialization**: Pastikan mengonversi BigInt atau Decimal dari database ke `Number` atau `String` sebelum dikirim ke Client Component.

## 3. UI & Styling
- **2-Column Form Layout**: Untuk form yang kompleks (seperti Paket Wisata), gunakan layout 2-kolom (Main vs Sidebar) agar UI seimbang dan tidak kosong di sisi kanan.
- **Smart Discount Logic**: Terapkan deteksi simbol `%` pada input harga untuk menghitung diskon otomatis demi kemudahan admin.
- **Responsive Design**: Gunakan prefix `sm:`, `md:`, `lg:` dari Tailwind secara konsisten.

## 4. Documentation
- **Task Tracking**: Gunakan `task.md` untuk mencatat setiap progres fitur besar.
- **Walkthrough**: Buat `walkthrough.md` setelah fitur selesai untuk menjelaskan apa yang berubah.
