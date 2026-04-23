# Project Progress & Roadmap - Titan Travel (Decision Support System)

Dokumen ini melacak status pengembangan aplikasi Titan Travel dan merinci workflow teknis untuk setiap modul fitur.

---

## 📊 Status Progres Global

| Modul                     | Status      | Progres | Catatan Utama                                          |
| :------------------------ | :---------- | :------ | :----------------------------------------------------- |
| **CMS & Landing Page**    | **SELESAI** | 100%    | Smart Assistant & Multi-bahasa sudah aktif.            |
| **Theme & UI System**     | **SELESAI** | 100%    | Support Dark/Light mode & Design Tokens.               |
| **Auth & Authorization**  | Berjalan    | 80%     | Role ADMIN/MANAGER sudah aktif.                        |
| **TOPSIS Engine**         | **SELESAI** | 100%    | Mendukung Bobot Dinamis & Personalisasi User.          |
| **Booking & Transaction** | Berjalan    | 55%     | Manajemen Admin siap, Checkout publik perlu penguatan. |
| **Analytics Dashboard**   | Berjalan    | 75%     | Statistik terintegrasi dengan data riil.               |

---

## 🛠️ Workflow Per Fitur (Detail)

### 1. Sistem Tema (Dark Mode) - **COMPLETED**

- **Workflow**:
  1.  `ThemeProvider` mendeteksi preferensi sistem/localStorage.
  2.  Injeksi class `.dark` dan atribut `data-theme` ke root `<html>`.
  3.  Komponen UI menggunakan variabel CSS (misal `bg-card-bg`) yang nilainya berubah otomatis di `globals.css`.

### 2. Rekomendasi Cerdas (TOPSIS Engine) - **COMPLETED**

- **Workflow**:
  1.  **Master Data**: Admin menentukan skor fakta (Fasilitas, Waktu, Durasi) di Form Paket.
  2.  **User Preference**: User memilih prioritas (Harga/Fasilitas/Waktu) via `RecommendationFinder`.
  3.  **Processing**: Server Action `getPersonalizedRecommendations` menghitung skor TOPSIS secara real-time.
  4.  **Math**: Normalisasi -> Pembobotan Dinamis -> Jarak Euclidean ke target User -> Nilai $V_i$.
  5.  **Output**: Hasil ditampilkan dengan badge "Match Score %" dan ranking.

### 3. Manajemen Paket Wisata - **COMPLETED**

- **Workflow**:
  1.  **Multi-lang**: Input 3 bahasa dengan fitur _Auto-Translate_ (Sparkles icon).
  2.  **Criteria Input**: Slider untuk skor fasilitas & dropdown untuk waktu berangkat.
  3.  **Instant Sync**: Penggunaan `useEffect` untuk sinkronisasi state tabel setelah `router.refresh()`.
  4.  **Price Logic**: Konversi otomatis ke USD dan penanganan harga coret (promo).

### 4. Modul Pemesanan & Transaksi (Public Flow) - **NEXT FOCUS**

- **Workflow**:
  1.  **Phase 1 (Initiation)**: User mengisi form reservasi di `PackageDetailClient` (Nama, WA, Email, Tgl Berangkat, & Pax).
  2.  **Phase 2 (Logic Server)**: Server Action `createBooking`:
      - Validasi sisa kuota paket.
      - Kalkulasi `Total Harga` (Pax × Harga Paket).
      - Generate `Booking Code` unik (contoh: TT-240401-XXXX).
      - Simpan ke Database dengan status `PENDING`.
  3.  **Phase 3 (Checkout)**: Redirect ke `/checkout/[bookingId]`. Menampilkan invoice ringkas dan instruksi transfer bank.
  4.  **Phase 4 (Confirmation)**: User mengunggah bukti transfer (via Portal Upload). Status berubah menjadi `MENUNGGU_VERIFIKASI`.
  5.  **Phase 5 (Verification)**: Admin melakukan verifikasi visual bukti transfer di Dashboard -> Klik "Confirm" -> Status `CONFIRMED` -> Tiket Digital terbit.

---

## 🚀 Rencana Kerja Selanjutnya (Next Steps)

1.  **[High Priority]** Implementasi Server Action `createBooking` di `src/lib/actions/bookings.ts` lengkap dengan validasi kuota.
2.  **[High Priority]** Pembuatan UI Halaman Checkout (`src/app/checkout/[id]/page.tsx`) dengan desain premium & ringkasan invoice.
3.  **[Medium Priority]** Portal Mandiri untuk pengguna mengunggah bukti transfer tanpa harus login (guest access).
4.  **[Medium Priority]** Integrasi sistem "Tiket Digital" (Halaman khusus/PDF) yang dapat diakses user setelah pembayaran diterima.
5.  **[Low Priority]** Webhook/API sederhana untuk mengirim notifikasi ke WhatsApp Admin saat ada pesanan baru masuk.

---

_Terakhir diupdate: 23 April 2026 by - `my kisah`_
