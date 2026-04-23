# Titan Travel Main Workflow

Dokumen ini merinci alur kerja utama aplikasi Titan Travel, mengintegrasikan proses bisnis dengan logika Sistem Pendukung Keputusan (TOPSIS).

## 1. Alur Manajemen Data (Admin Side)
Proses dimulai dengan persiapan data dasar yang akan menjadi input bagi mesin rekomendasi.
1.  **Input Paket Wisata**: Admin memasukkan data paket melalui dashboard (CRUD).
2.  **Penentuan Nilai Kriteria**: Admin menentukan nilai untuk setiap kriteria:
    *   `Harga` (Rupiah)
    *   `Fasilitas` (Skala 1-5)
    *   `Waktu Keberangkatan` (Skor: 1-Pagi, 2-Siang, 3-Malam)
    *   `Durasi` (Jumlah Hari)
3.  **Publikasi**: Admin mengaktifkan status `isPublished` agar paket masuk ke dalam perhitungan sistem.

## 2. Alur Rekomendasi Cerdas (The TOPSIS Engine)
Sistem menjalankan algoritma ini secara otomatis saat user membuka halaman daftar paket.
1.  **Pengambilan Data ($X$)**: Sistem mengambil semua paket yang aktif.
2.  **Normalisasi ($R$)**: Menghitung pembagi akar kuadrat per kriteria dan membagi setiap nilai.
3.  **Pembobotan ($Y$)**: Mengalikan matriks normalisasi dengan bobot tetap ($W$):
    *   Harga: 35%, Fasilitas: 25%, Waktu: 20%, Durasi: 20%.
4.  **Komputasi Jarak ($D^+$ & $D^-$)**: Mencari titik terjauh dari solusi terburuk (Ideal Negatif) dan titik terdekat dari solusi terbaik (Ideal Positif).
5.  **Pemeringkatan ($V_i$)**: Menghitung rasio preferensi (0-1).
6.  **Sorting**: Sistem mengurutkan paket dari nilai $V_i$ terbesar ke terkecil.

## 3. Alur Pemesanan (Customer Side)
1.  **Eksplorasi**: Pelanggan melihat paket wisata yang sudah diberi label "Rekomendasi Terbaik" berdasarkan hasil ranking TOPSIS.
2.  **Pemesanan**: Pelanggan mengisi formulir booking dan data peserta.
3.  **Pembayaran**: Pelanggan melakukan transfer bank sesuai invoice.
4.  **Konfirmasi**: Pelanggan mengunggah bukti transfer ke sistem.

## 4. Alur Validasi & Pelaporan (Management Side)
1.  **Verifikasi Pembayaran**: Admin memeriksa bukti transfer di Panel Admin.
2.  **Penerbitan Tiket**: Jika valid, admin mengubah status menjadi `CONFIRMED`, dan sistem otomatis mengirim/menampilkan tiket digital.
3.  **Analitik Real-time**: Manager melihat grafik pendapatan dan tren pemesanan di Dashboard Statistik yang mengambil data agregat dari database.

---
*Catatan: Setiap langkah matematis pada poin 2 harus merujuk pada `goodtoknow/simulasi_perhitungan_topsis.md` untuk validasi akurasi.*
