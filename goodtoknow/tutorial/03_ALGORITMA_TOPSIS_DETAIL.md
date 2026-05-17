# 🧮 Detail Algoritma Matematis TOPSIS

Untuk para engineer dan developer yang perlu memahami logika eksak di dalam file `src/lib/topsis.ts`, berikut adalah bedah matematis langkah demi langkah dari algoritma TOPSIS di aplikasi Titan Travel.

Asumsi jumlah kriteria ada 4 (C1 hingga C4) dan jumlah alternatif/paket yang dinilai ada $m$.

### Langkah 1: Matriks Keputusan (X) & Normalisasi Matriks (R)

Pertama, sistem mengambil nilai asli paket dan mengubahnya ke dalam satu satuan yang sama menggunakan rumus normalisasi *Euclidean*:

$$ r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{i=1}^{m} x_{ij}^2}} $$

- $x_{ij}$ : Nilai asli alternatif $i$ pada kriteria $j$.
- Penyebutnya adalah **akar** dari **jumlah kuadrat** seluruh paket pada kriteria $j$.

### Langkah 2: Matriks Keputusan Ternormalisasi Terbobot (Y)

Nilai $R$ kemudian dikalikan dengan bobot ($W$) dinamis (berdasarkan preferensi pengunjung web, atau ketetapan Manager).

$$ y_{ij} = w_j \times r_{ij} $$

Ini menghasilkan representasi nilai yang telah menyesuaikan level "prioritas" kriteria (mana yang lebih penting).

### Langkah 3: Menentukan Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)

Sistem kemudian harus mendeteksi batas tertinggi dan terendah dari sekumpulan nilai tersebut:

- **Solusi Ideal Positif ($A^+$):** 
  - Jika kriteria adalah **BENEFIT** (C2 - Fasilitas), ambil nilai $y_{ij}$ **Maksimum**.
  - Jika kriteria adalah **COST** (C1 - Harga, C3 - Jadwal, C4 - Durasi), ambil nilai $y_{ij}$ **Minimum**.

- **Solusi Ideal Negatif ($A^-$):**
  - Jika kriteria adalah **BENEFIT** (C2 - Fasilitas), ambil nilai $y_{ij}$ **Minimum**.
  - Jika kriteria adalah **COST** (C1 - Harga, C3 - Jadwal, C4 - Durasi), ambil nilai $y_{ij}$ **Maksimum**.

### Langkah 4: Menghitung Jarak Euclidean dari Solusi Ideal (D+ dan D-)

Kita mengukur "jarak" paket kita terhadap Solusi Positif ($D_i^+$) dan Solusi Negatif ($D_i^-$). Menggunakan rumus jarak dua titik Euclidean (akar penjumlahan kuadrat):

$$ D_i^+ = \sqrt{\sum_{j=1}^{n} (y_{ij} - y_j^+)^2} $$

$$ D_i^- = \sqrt{\sum_{j=1}^{n} (y_{ij} - y_j^-)^2} $$

### Langkah 5: Nilai Preferensi / Skor Akhir (Vi)

Terakhir, hitung skor untuk me-ranking setiap paket wisata. Rumusnya adalah persentase kedekatan ke solusi ideal (skala $0$ hingga $1$).

$$ V_i = \frac{D_i^-}{D_i^- + D_i^+} $$

Semakin mendekati nilai $1.0$, semakin baik atau layak paket wisata tersebut untuk direkomendasikan. Sistem di kode `topsis.ts` melakukan *sorting array* secara menurun (descending) berbasis nilai $V_i$ ini dan menugaskan properti `ranking`.
