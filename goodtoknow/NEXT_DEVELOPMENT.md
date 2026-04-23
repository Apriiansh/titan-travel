# 🚀 Deep Dive: Next.js & Titan Travel Architecture Guide

Dokumen ini adalah panduan lengkap untuk memahami teknologi di balik Titan Travel.

---

## 1. Strategi Rendering (Rendering Strategies)

Dalam pengembangan web modern dengan Next.js, ada tiga cara utama bagaimana halaman "dimasak" dan dikirim ke pengguna:

### A. SSR (Server-Side Rendering)
- **Apa itu?** Halaman dibuat di server **setiap kali ada request** dari pengguna.
- **Kelebihan**: Data selalu paling baru, bagus untuk SEO, dan browser tidak perlu kerja keras.
- **Kapan dipakai?** Halaman Dashboard Admin, Keranjang Belanja, atau halaman yang datanya sering berubah.
- **Di Next.js 15**: Kita menggunakan Server Components secara default untuk mencapai ini.

### B. CSR (Client-Side Rendering)
- **Apa itu?** Browser menerima halaman kosong/kerangka, lalu JavaScript "mengisi" kontennya di laptop pengguna.
- **Kelebihan**: Interaksi sangat mulus (seperti aplikasi HP), tidak perlu reload halaman.
- **Kapan dipakai?** Form input yang kompleks, filter harga yang interaktif, atau chat.
- **Ciri khas**: Menggunakan `'use client'`.

### C. SSG (Static Site Generation)
- **Apa itu?** Halaman dibuat **sekali saja saat proses build** (sebelum di-deploy). Browser menerima file HTML yang sudah jadi.
- **Kelebihan**: Sangat cepat (secepat kilat ⚡).
- **Kapan dipakai?** Halaman Blog, About Us, atau FAQ yang jarang berubah.

---

## 2. Revolusi Server vs Client Components

Di Next.js App Router, kita menggabungkan keunggulan SSR dan CSR dalam satu halaman:

- **Server Component**: Menangani "Heavy Lifting" (ambil data dari database via Prisma). Ini berjalan di server.
- **Client Component**: Menangani "User Interaction" (klik tombol, buka modal). Ini berjalan di browser.

**Rule of Thumb**: 
> Masak bahan makanan (Ambil Data) di Dapur (Server), dan biarkan pengguna Menyuap (Klik/Ketik) di Meja Makan (Client).

---

## 3. Membedah Struktur Folder Titan Travel

Next.js 15 menggunakan sistem routing berbasis folder. Mari kita bedah isi `src/app/`:

### A. Route Groups: `(folder)`
Folder dengan tanda kurung `()` **tidak akan muncul di URL**. Ini digunakan untuk merapikan kode.
- `src/app/(public)/`: Semua halaman untuk pengunjung (Landing page, List paket).
- `src/app/(panel)/`: Semua halaman dashboard (Admin, Manager).

### B. Dynamic Routes: `[slug]`
Folder dengan tanda kurung siku `[]` berarti bagian URL tersebut bersifat dinamis.
- `src/app/paket/[slug]/`: Menangani URL seperti `/paket/bali-trip` atau `/paket/eropa-tour`. `[slug]` akan menangkap nama paketnya.

### C. Folder Khusus Lainnya
- `layout.tsx`: Kerangka halaman (Header/Footer) yang tetap ada saat pindah halaman.
- `page.tsx`: Konten utama dari sebuah URL.
- `loading.tsx`: Tampilan loading otomatis saat data sedang diambil (Skeleton).
- `error.tsx`: Tampilan "Halaman Error" jika terjadi masalah di server.

---

## 4. Alur Data Titan Travel (The Gold Standard)

Sistem kita menggunakan pola **Server Actions**, ini adalah cara modern untuk menghubungkan UI ke Database:

1.  **Schema (`prisma/schema.prisma`)**: Kita definisikan bentuk tabel (TourPackage, Booking, User).
2.  **Database Handler (`src/lib/prisma.ts`)**: File tunggal untuk koneksi ke MySQL (Laragon).
3.  **Actions (`src/lib/actions/`)**: Fungsi sakti yang berjalan di server. 
    - *Contoh*: `createPackage(data)` akan menjalankan perintah `prisma.tourPackage.create()`.
4.  **UI Components**:
    - `page.tsx` (Server): Ambil data list paket → Kirim ke Client.
    - `PackagesClient.tsx` (Client): Menampilkan tabel → Klik tombol simpan → Panggil Action.

---

## 5. Keamanan & Best Practices

1.  **Environment Variables (`.env`)**: Jangan pernah simpan password database atau kunci rahasia di dalam kode. Selalu simpan di `.env`.
2.  **Validasi Server-Side**: Jangan percaya input dari browser. Selalu cek kembali data di dalam Server Action sebelum disimpan ke database.
3.  **Type Safety (TypeScript)**: Selalu gunakan interface/type untuk object data. Ini mencegah error "undefined" yang bikin aplikasi crash.
4.  **Optimasi Gambar**: Gunakan komponen `<Image />` dari Next.js. Ini akan mengecilkan ukuran gambar secara otomatis agar web tidak lemot.

---

## 6. Tips Menjadi Developer Senior

- **KISS (Keep It Simple, Stupid)**: Jangan buat kode yang terlalu ribet jika bisa dibuat sederhana.
- **DRY (Don't Repeat Yourself)**: Jika kamu menulis kode yang sama 3 kali, jadikan itu sebuah komponen atau fungsi terpisah.
- **Modularitas**: Seperti yang kita lakukan pada `PackagesClient`, memecah file besar menjadi file kecil akan menyelamatkanmu dari pusing saat debug di masa depan.

---

*Dokumen ini diperbarui secara berkala seiring perkembangan proyek Titan Travel. Semangat belajarnya!* 🚀
