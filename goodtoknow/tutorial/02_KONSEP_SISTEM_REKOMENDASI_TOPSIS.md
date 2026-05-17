# 🧠 Konsep Sistem Rekomendasi (SPK) dengan TOPSIS

Titan Travel bukan sekadar *web e-commerce* pariwisata biasa. Bisnis logiknya dilengkapi oleh *Sistem Pendukung Keputusan* (SPK) guna menyaring dan memeringkat paket-paket wisata berdasarkan preferensi turis secara personal. Algoritma yang digunakan adalah **TOPSIS**.

## 1. Apa itu TOPSIS?

**TOPSIS** (*Technique for Order of Preference by Similarity to Ideal Solution*) didasarkan pada konsep bahwa solusi alternatif yang dipilih (paket wisata yang disarankan) tidak hanya harus memiliki jarak terpendek dari Solusi Ideal Positif, tetapi juga memiliki jarak terjauh dari Solusi Ideal Negatif.

*Bahasa sederhananya:* Paket terbaik adalah paket yang memiliki atribut terbanyak yang disukai oleh pengguna (misal: harga murah, fasilitas lengkap), sekaligus menghindari hal-hal yang tidak diinginkan.

## 2. Kenapa TOPSIS?

Metode TOPSIS sangat cocok untuk kasus Titan Travel dengan alasan:
1. Sifat komputasinya efisien untuk jumlah paket wisata yang terus bertambah (Ratusan hingga ribuan baris data).
2. Algoritmanya tidak rumit untuk dipahami, memungkinkan manajer untuk memodifikasi bobot preferensi tanpa menyentuh *core logic* yang sangat dalam.
3. Kemampuannya mengatasi skala ukuran kriteria yang bervariasi (harga puluhan juta, vs fasilitas berskala 1-5). TOPSIS menormalkannya ke skala yang seragam.

## 3. Parameter Kriteria TOPSIS di Titan Travel

Berdasarkan *business logic*, terdapat **4 Kriteria Utama** yang membentuk keputusan rekomendasi:

| Kode | Nama Kriteria | Tipe Kriteria | Makna |
|---|---|---|---|
| **C1** | Harga (Price) | **COST** | Semakin kecil/murah harganya, semakin baik nilainya. |
| **C2** | Fasilitas (Facilities) | **BENEFIT** | Semakin tinggi skor kelengkapan (1-5), semakin baik nilainya. |
| **C3** | Waktu Keberangkatan | **COST** | Jarak/deviasi terhadap waktu ideal yang diinginkan user. Semakin kecil perbedaan waktunya, semakin baik. |
| **C4** | Durasi Hari (Duration) | **COST** | Berapa lama durasi trip. Semakin singkat trip standar (jika user preferensi harga/waktu terbatas), makin rendah *cost* nya. *(Bisa dimodifikasi)* |

## 4. Alur Kerja Fitur Rekomendasi Secara Konseptual

1. **Pemilihan Prioritas:** Pelanggan di halaman depan akan memilih "Gaya Liburan" mereka (Prioritas Harga, Prioritas Waktu, Prioritas Fasilitas, atau Seimbang).
2. **Kalkulasi Dinamis Bobot:** Jika user memilih Prioritas Harga, bobot `C1 (Harga)` akan diinjeksi tinggi (Contoh: `0.55` dari skala `1.0`), menekan bobot kriteria lainnya.
3. **Eksekusi Engine:** Engine di belakang sistem (`topsis.ts`) akan mengambil seluruh paket wisata yang berstatus `isPublished: true`, menjalankan matematis TOPSIS, lalu memberi skor preferensi ($V_i$) pada setiap paket.
4. **Pemberian Lencana (Badge):** Berdasarkan urutan (ranking) dan ambang batas skor $V_i$, sistem menempelkan lencana dinamis seperti *"Sangat Direkomendasikan"*, *"Direkomendasikan"*, atau sekadar *"Pilihan Alternatif"*. Hasilnya di-render di antarmuka pelanggan.
