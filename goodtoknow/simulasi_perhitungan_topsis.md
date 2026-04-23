# Simulasi Perhitungan Metode TOPSIS - Titan Travel

Dokumen ini berisi contoh simulasi perhitungan manual berdasarkan Bab 3 Laporan Tugas Akhir untuk memvalidasi algoritma rekomendasi pada aplikasi Titan Travel.

## 1. Data Alternatif & Kriteria (Matriks Keputusan $X$)
Misalkan terdapat 5 paket wisata (Alternatif) yang akan dinilai berdasarkan 4 kriteria utama:

| Kode | Nama Paket Wisata | C1: Harga (Rp) | C2: Fasilitas (1-5) | C3: Waktu Keb. (Skor) | C4: Durasi (Hari) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A1** | Bali 4H3M | 3.500.000 | 4 | 1 (Pagi) | 4 |
| **A2** | Lombok 3H2M | 2.800.000 | 3 | 2 (Siang) | 3 |
| **A3** | Kuala Lumpur 4H3M | 4.200.000 | 5 | 1 (Pagi) | 4 |
| **A4** | Singapura 3H2M | 5.000.000 | 5 | 3 (Malam) | 3 |
| **A5** | Yogyakarta 2H1M | 1.800.000 | 2 | 2 (Siang) | 2 |

**Sifat Kriteria & Bobot ($W$):**
*   C1 (Harga): **Cost** | Bobot: 0.35
*   C2 (Fasilitas): **Benefit** | Bobot: 0.25
*   C3 (Waktu): **Cost** (Makin kecil skor/pagi makin baik) | Bobot: 0.20
*   C4 (Durasi): **Cost** (Makin singkat makin efisien) | Bobot: 0.20

---

## 2. Langkah Perhitungan

### Langkah 1: Normalisasi Matriks ($R$)
Setiap nilai dibagi dengan akar jumlah kuadrat per kolom.
*   Contoh C1: $\sqrt{3.5^2 + 2.8^2 + 4.2^2 + 5.0^2 + 1.8^2} \approx 8.12$
*   Hasilnya adalah matriks $R$ dengan nilai antara 0 - 1.

### Langkah 2: Matriks Ternormalisasi Terbobot ($Y$)
Mengalikan nilai matriks $R$ dengan bobot kriteria ($W$).
*   $y_{ij} = w_j \times r_{ij}$

### Langkah 3: Menentukan Solusi Ideal ($A^+$ dan $A^-$)
*   **Solusi Ideal Positif ($A^+$)**: Mengambil nilai **terkecil** untuk Cost (C1, C3, C4) dan **terbesar** untuk Benefit (C2).
*   **Solusi Ideal Negatif ($A^-$)**: Kebalikan dari $A^+$.

### Langkah 4: Jarak Euclidean ($D^+$ dan $D^-$)
Menghitung seberapa dekat paket dengan solusi terbaik dan seberapa jauh dari solusi terburuk.

| Alternatif | $D^+$ (Jarak ke Ideal Positif) | $D^-$ (Jarak ke Ideal Negatif) |
| :--- | :--- | :--- |
| **A1** | 0.0955 | 0.1255 |
| **A2** | 0.0887 | 0.1123 |
| **A3** | 0.1168 | 0.1293 |
| **A4** | 0.1678 | 0.0886 |
| **A5** | **0.0960** | **0.1552** |

### Langkah 5: Nilai Preferensi Akhir ($V_i$)
Rumus: $V_i = \frac{D_i^-}{D_i^- + D_i^+}$

| Alternatif | Nilai $V_i$ | Peringkat |
| :--- | :--- | :--- |
| **A5 (Yogyakarta)** | **0.6177** | **1 (Rekomendasi)** |
| **A1 (Bali)** | 0.5680 | 2 |
| **A2 (Lombok)** | 0.5588 | 3 |
| **A3 (Kuala Lumpur)** | 0.5253 | 4 |
| **A4 (Singapura)** | 0.3456 | 5 |

---

## 3. Kesimpulan Analisis
Berdasarkan simulasi di atas, **Paket Yogyakarta (A5)** terpilih sebagai rekomendasi terbaik.
*   **Alasannya**: Meskipun fasilitasnya paling standar (Skor 2), namun harganya sangat murah (C1) dan durasinya sangat singkat/efisien (C4), yang mana kriteria ini memiliki total bobot 55% (0.35 + 0.20).
*   Sistem secara otomatis mengarahkan pelanggan ke pilihan yang paling **value-for-money** sesuai rumus TOPSIS.

---
*Catatan: Simulasi ini digunakan sebagai dasar logika pemrograman pada file `src/lib/topsis.ts` (jika ada) atau logika filter pada komponen frontend.*
