# Development Best Practices

Panduan praktis untuk alur kerja harian dan standar pengembangan aplikasi Titan Travel.

## 1. Pengembangan Komponen UI
*   **Komposisi**: Pecah komponen besar menjadi komponen kecil yang dapat digunakan kembali (reusable) di folder `src/components/ui` atau `src/components/panel`.
*   **Lucide Icons**: Gunakan library `lucide-react` untuk semua ikon demi konsistensi visual.
*   **Accessibility (a11y)**: Selalu tambahkan atribut `aria-label` pada tombol ikon dan pastikan kontras warna memenuhi standar WCAG (terbantu dengan penggunaan tema variabel).

## 2. Manajemen State
*   **Server State First**: Utamakan penggunaan Server Components dan URL Search Params untuk filter/pagination sebelum menggunakan `useState`.
*   **Form Handling**: Gunakan Server Actions untuk pengiriman formulir guna mendapatkan fitur *progressive enhancement* dan keamanan otomatis.
*   **Validation**: Gunakan library validasi (seperti Zod jika tersedia) untuk memastikan data dari form aman sebelum masuk ke Database.

## 3. Dokumentasi & Knowledge
*   **Folder `goodtoknow/`**: Selalu simpan riset, analisis skripsi, atau hasil simulasi algoritma di folder ini.
*   **Comment Policy**: Berikan komentar pada blok kode yang kompleks (seperti kalkulasi TOPSIS) untuk menjelaskan *mengapa* logika tersebut digunakan, bukan hanya *apa* yang dilakukan.

## 4. Keamanan & Rahasia
*   **Environment Variables**: Jangan pernah melakukan *hardcode* kunci API atau rahasia database. Gunakan file `.env`.
*   **Authorization**: Selalu lakukan pengecekan role (`ADMIN`/`MANAGER`) di level Page (Server Side) dan level API Route untuk mencegah akses tidak sah.

## 5. Optimasi Media
*   **Next.js Image**: Gunakan komponen `next/image` untuk semua gambar publik agar mendapatkan optimasi ukuran file secara otomatis.
*   **Lazy Loading**: Gunakan dynamic imports untuk komponen berat yang tidak diperlukan saat load pertama (seperti Chart yang berada di bawah lipatan layar).
