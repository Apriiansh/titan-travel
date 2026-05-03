# Rencana Pengoptimalan Dashboard Manager - Titan Travel

Rencana ini bertujuan untuk mengubah Dashboard Manager dari data statis menjadi dashboard eksekutif dinamis yang berfokus pada ringkasan pendapatan dan performa bisnis.

## 1. Backend (Server Action)
- Membuat fungsi `getManagerDashboardStats` di `@/src/lib/actions/dashboard.ts` untuk mengambil:
  - **Total Pendapatan (Lunas/Dikonfirmasi)**: Total dari `amountPaid` untuk booking dengan status `CONFIRMED` atau `COMPLETED`.
  - **Total Booking Selesai**: Jumlah booking dengan status `COMPLETED` bulan ini.
  - **Top 3 Paket Wisata**: Paket dengan akumulasi pendapatan tertinggi.
  - **Data Grafik Pendapatan**: Data Pendapatan (Dinamis, bisa pilih bulan tertentu atau pertahun atau seluruh) untuk grafik garis (Line Chart).

## 2. Frontend (UI/UX)
- Memperbarui halaman `@/src/app/(panel)/manager/page.tsx`:
  - Mengganti *Stat Cards* statis dengan data riil dari database.
  - Menghilangkan metrik "Pending Verification" sesuai permintaan (Manager hanya melihat data yang sudah final).
  - Mengimplementasikan **Grafik Pendapatan (Line Chart)** menggunakan `recharts` atau library visualisasi yang tersedia.
  - Menampilkan tabel "Top Performing Packages" sebagai ringkasan strategi bisnis.

## 3. Laporan
- Memastikan konsistensi data antara Dashboard Manager dan Halaman Laporan Transaksi.

## 4. Keamanan
- Memastikan semua data yang ditarik sudah terfilter sesuai role Manager (hanya data agregat dan laporan yang relevan).
