# Analisis Sistem & Metode TOPSIS - Titan Travel

Dokumen ini merangkum inti dari Laporan Tugas Akhir "Aplikasi Booking Online Berbasis Website Menggunakan Metode Technique for Order Preference by Similarity to Ideal Solution (TOPSIS) pada CV Titan Jaya Travelindo".

## 1. Permasalahan Utama (The "Why")
*   **Proses Semi-Konvensional**: Pemesanan masih melalui WhatsApp, telepon, atau loket fisik.
*   **Human Error**: Risiko kesalahan pencatatan oleh admin dan penumpukan data pemesanan.
*   **Informasi Tidak Real-Time**: Pelanggan sulit mengetahui ketersediaan kursi atau paket secara langsung.
*   **Subjektivitas Pemilihan**: Pelanggan sering bingung memilih paket wisata yang paling sesuai dengan anggaran dan preferensi mereka dari sekian banyak pilihan.

## 2. Solusi & Inti Aplikasi
Membangun platform **Booking Online Terintegrasi** yang tidak hanya berfungsi sebagai alat transaksi, tetapi juga sebagai **Asisten Cerdas** yang memberikan rekomendasi paket perjalanan terbaik secara objektif menggunakan algoritma **TOPSIS**.

## 3. Metode TOPSIS (Logic & Formula)
Prinsip utama TOPSIS adalah: **Alternatif yang dipilih harus memiliki jarak terpendek dari solusi ideal positif dan jarak terjauh dari solusi ideal negatif.**

### A. Variabel & Kriteria (Weights)
Sistem menggunakan 4 kriteria utama untuk menentukan peringkat paket wisata:

| Kode | Kriteria | Sifat (Type) | Bobot ($w_j$) |
| :--- | :--- | :--- | :--- |
| **C1** | Harga Tiket/Paket | *Cost* (Makin murah makin baik) | 0.35 |
| **C2** | Fasilitas (Skor 1-5) | *Benefit* (Makin lengkap makin baik) | 0.25 |
| **C3** | Waktu Keberangkatan | *Cost* (Makin pagi/awal makin baik) | 0.20 |
| **C4** | Durasi Perjalanan | *Cost* (Makin singkat/efisien makin baik) | 0.20 |

### B. Tahapan Perhitungan Matematis
1.  **Matriks Keputusan ($X$)**: Mengumpulkan data mentah setiap paket berdasarkan kriteria di atas.
2.  **Normalisasi Matriks ($R$)**: Mengubah nilai kriteria yang satuannya berbeda menjadi skala yang bisa dibandingkan.
    *   Rumus: $r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{i=1}^{m} x_{ij}^2}}$
3.  **Matriks Normalisasi Terbobot ($Y$)**: Mengalikan matriks $R$ dengan bobot kriteria ($w_j$).
    *   Rumus: $y_{ij} = w_j \times r_{ij}$
4.  **Solusi Ideal Positif ($A^+$) & Negatif ($A^-$)**: Mencari nilai terbaik dan terburuk untuk setiap kriteria.
5.  **Jarak Euclidean ($D^+$ & $D^-$)**: Menghitung seberapa jauh sebuah paket dari titik ideal.
6.  **Nilai Preferensi ($V_i$)**: Menghitung skor akhir antara 0 - 1.
    *   Rumus: $V_i = \frac{D_i^-}{D_i^- + D_i^+}$
7.  **Ranking**: Paket dengan nilai $V_i$ tertinggi akan tampil sebagai "Rekomendasi Utama".

## 4. Workflow Utama (Architecture)

### Alur Kerja User (Customer)
1.  **Akses & Login**: User masuk ke website Titan Travel.
2.  **Cari Paket**: User melihat daftar paket wisata secara real-time.
3.  **Sistem Rekomendasi**: Di latar belakang, sistem menjalankan algoritma TOPSIS dan menampilkan paket-paket dengan label "Terbaik untuk Anda".
4.  **Booking**: User mengisi formulir pemesanan online.
5.  **Pembayaran**: User melakukan transfer dan mengunggah bukti pembayaran di sistem.
6.  **E-Ticket**: Setelah divalidasi admin, sistem otomatis menerbitkan tiket digital.

### Alur Kerja Admin/Manager
1.  **Dashboard**: Memantau statistik booking dan pendapatan secara real-time.
2.  **Manajemen Data**: Mengelola (CRUD) paket wisata, jadwal, dan galeri.
3.  **Validasi**: Memverifikasi bukti transfer pelanggan.
4.  **Laporan**: Sistem menghasilkan laporan otomatis untuk pimpinan tanpa rekap manual.

## 5. Ekspektasi Hasil (Expected Outcomes)
*   **Efisiensi**: Mengurangi beban kerja admin hingga 70% karena proses otomatis.
*   **Akurasi**: Tidak ada lagi pemesanan ganda (*double booking*) karena validasi database MySQL.
*   **Kepuasan Pelanggan**: User merasa terbantu dengan fitur rekomendasi yang objektif.
*   **Skalabilitas**: Aplikasi siap menangani rute internasional dengan fitur multi-bahasa dan kurs mata uang.

---
**Teknologi yang Digunakan:**
*   **Framework**: Next.js 15+ (App Router)
*   **Database**: MySQL dengan Prisma ORM
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
