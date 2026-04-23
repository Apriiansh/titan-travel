# TOPSIS Engine Standards

Panduan implementasi algoritma rekomendasi berbasis metode TOPSIS untuk menjaga integritas riset Tugas Akhir.

## 1. Variabel Kriteria
Setiap perhitungan rekomendasi paket wisata harus melibatkan 4 kriteria standar berikut:
1.  **C1: Harga** (Sifat: Cost, Bobot: 0.35)
2.  **C2: Fasilitas** (Sifat: Benefit, Bobot: 0.25)
3.  **C3: Waktu Keberangkatan** (Sifat: Cost, Bobot: 0.20)
4.  **C4: Durasi** (Sifat: Cost, Bobot: 0.20)

## 2. Integritas Algoritma
*   **Normalisasi**: Gunakan pembagi akar jumlah kuadrat ($\sqrt{\sum x^2}$).
*   **Solusi Ideal**: Pastikan pemisahan antara kriteria *Benefit* (Maksimal untuk ideal positif) dan *Cost* (Minimal untuk ideal positif).
*   **Output**: Hasil akhir harus berupa Nilai Preferensi ($V_i$) dengan rentang 0 hingga 1.

## 3. Transparansi UI
*   Tampilkan label "Rekomendasi Terbaik" atau ranking pada daftar paket agar user tahu sistem sedang bekerja secara objektif.
*   Jangan memanipulasi ranking secara manual tanpa dasar kriteria.
