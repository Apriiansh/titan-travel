# Antigravity Core Standards

Aturan dasar untuk memastikan kode berkualitas tinggi, aman, dan mudah dipelihara.

## 1. Type Safety & TypeScript
*   **Dilarang Keras menggunakan `any`**. Gunakan `interface`, `type`, atau `unknown`.
*   Semua fungsi harus memiliki tipe kembalian (Return Type) yang eksplisit.
*   Tangani error di blok `catch` dengan tipe `unknown` dan validasi menggunakan `instanceof Error`.

## 2. Pembersihan Kode (Clean Code)
*   Gunakan penamaan variabel yang deskriptif dan dalam bahasa Inggris (untuk konsistensi teknis).
*   Fungsi yang lebih dari 50 baris harus dipecah menjadi sub-fungsi atau modular.
*   Hapus komentar yang sudah tidak relevan atau "dead code" (kode yang di-comment).

## 3. Penanganan Error
*   Selalu gunakan blok `try-catch` untuk operasi database dan API.
*   Error message untuk user harus ramah, namun log teknis tetap harus detail.

## 4. Performa
*   Lakukan operasi database secara paralel menggunakan `Promise.all()` jika memungkinkan.
*   Hanya ambil kolom yang diperlukan dari database (gunakan `select` di Prisma).
