# Rencana Implementasi Ekspor Excel Laporan Transaksi Manager

Rencana ini bertujuan untuk menambahkan fitur ekspor laporan transaksi ke format Excel (.xlsx) yang profesional menggunakan library `exceljs` dan `file-saver` untuk kebutuhan Pimpinan/Manager.

## 1. Instalasi Dependency
- Menginstal `exceljs` untuk pembuatan file Excel dengan styling (warna, font, border).
- Menginstal `file-saver` untuk mengunduh file secara client-side di browser.

## 2. Pengembangan Fitur Ekspor (Client-Side)
- Memperbarui komponen `@/src/app/(panel)/manager/reports/bookings/ReportBookingsClient.tsx`.
- Menambahkan fungsi `exportToExcel` yang mencakup:
  - **Custom Header**: Baris judul laporan dan periode waktu.
  - **Tabel Profesional**:
    - Kolom: No, Tanggal, Nama Pelanggan, Paket Wisata, Pax, Total Bayar.
    - Styling Header Tabel: Background biru (#0ea5e9), teks putih, font bold.
    - Auto-width: Kolom otomatis menyesuaikan panjang teks.
    - Format Angka: Kolom "Total Bayar" diformat sebagai Currency (IDR) di Excel agar bisa dikalkulasi.
  - **Baris Total**: Menambahkan baris di paling bawah untuk menjumlahkan total pendapatan secara otomatis.

## 3. Integrasi UI
- Menambahkan tombol **"Ekspor Excel"** di sebelah tombol "Cetak Laporan" pada halaman laporan transaksi.
- Menggunakan ikon `FileSpreadsheet` dari Lucide React.
- Menambahkan status loading saat file sedang diproses.

## 4. Keamanan & Performa
- Proses ekspor dilakukan sepenuhnya di sisi klien (browser) untuk menghindari beban server dan batasan timeout Vercel.
- Memastikan data yang diekspor tetap konsisten dengan data yang ditampilkan di layar (hasil filter).
