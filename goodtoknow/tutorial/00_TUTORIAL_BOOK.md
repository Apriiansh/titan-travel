# 📚 Tutorial Book: Konsep & Arsitektur Titan Travel

Selamat datang di **Tutorial Book Titan Travel**! Folder ini berisi pemahaman konseptual dan arsitektur dari sistem aplikasi yang sedang dibangun. Jika Anda ingin memahami *mengapa* sistem dibangun seperti ini dan *bagaimana* logika bisnisnya berjalan sebelum terjun ke dalam kode, ini adalah tempat yang tepat.

Buku ini terbagi menjadi beberapa bab konseptual:

## 📑 Daftar Isi Tutorial

1. **[01_ARSITEKTUR_NEXTJS_APP_ROUTER.md](./01_ARSITEKTUR_NEXTJS_APP_ROUTER.md)**
   Membahas arsitektur fundamental aplikasi, pemisahan Server vs Client Components, dan alur pergerakan data dari database hingga ke layar browser menggunakan Server Actions.

2. **[02_KONSEP_SISTEM_REKOMENDASI_TOPSIS.md](./02_KONSEP_SISTEM_REKOMENDASI_TOPSIS.md)**
   Menjelaskan konsep bisnis *Sistem Pendukung Keputusan (SPK)* untuk merekomendasikan paket wisata kepada pelanggan berdasarkan preferensi (harga, waktu, atau fasilitas) secara objektif.

3. **[03_ALGORITMA_TOPSIS_DETAIL.md](./03_ALGORITMA_TOPSIS_DETAIL.md)**
   Pembedahan matematis algoritma TOPSIS *(Technique for Order Preference by Similarity to Ideal Solution)*. Penjelasan matriks ternormalisasi, perhitungan solusi ideal (positif/negatif), dan kalkulasi skor akhir.

4. **[04_DATABASE_SCHEMA_PRISMA.md](./04_DATABASE_SCHEMA_PRISMA.md)**
   Penjelasan struktur dan relasi database menggunakan Prisma ORM. Membahas entitas utama seperti `TourPackage`, `Booking`, `User`, `TopsisCriterion`, dan `PriceTier`.

5. **[05_UI_UX_TAILWIND_SHADCN.md](./05_UI_UX_TAILWIND_SHADCN.md)**
   Panduan konsep antarmuka pengguna, penggunaan Tailwind CSS untuk keindahan desain *responsive*, dan integrasi *accessible components* menggunakan Shadcn UI.

---

> **💡 Tips Senior Developer:**
> "Arsitektur yang baik adalah yang mudah dipahami oleh programmer berikutnya. Pahami konsep arsitektur Next.js dan logika sistem pendukung keputusannya di sini, lalu berpindahlah ke folder `coding` untuk melihat implementasi nyatanya."
