# Simulasi Perhitungan Metode TOPSIS - Titan Travel

Dokumen ini berisi simulasi perhitungan manual mendalam berdasarkan Bab 3 Laporan Tugas Akhir untuk memvalidasi algoritma pada aplikasi Titan Travel.

---

## 1. Data Alternatif & Kriteria (Matriks Keputusan $X$)

| Kode | Nama Paket | C1: Harga (jt) | C2: Fasilitas (1-5) | C3: Waktu (Skor) | C4: Durasi (Hari) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **A1** | Bali 4H3M | 3.5 | 4 | 1 | 4 |
| **A2** | Lombok 3H2M | 2.8 | 3 | 2 | 3 |
| **A3** | KL 4H3M | 4.2 | 5 | 1 | 4 |
| **A4** | Singapura 3H2M | 5.0 | 5 | 3 | 3 |
| **A5** | Yogyakarta 2H1M | 1.8 | 2 | 2 | 2 |

**Bobot Kriteria ($W$):**
$W = [0.35, 0.25, 0.20, 0.20]$

---

## 2. Langkah Perhitungan Mendalam

### Langkah 1: Normalisasi Matriks ($R$)
Rumus: $r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{i=1}^{n} x_{ij}^2}}$

**Perhitungan Pembagi (Akar Jumlah Kuadrat):**
*   **C1**: $\sqrt{3.5^2 + 2.8^2 + 4.2^2 + 5.0^2 + 1.8^2} = \sqrt{65.97} = \mathbf{8.122}$
*   **C2**: $\sqrt{4^2 + 3^2 + 5^2 + 5^2 + 2^2} = \sqrt{63} = \mathbf{7.937}$
*   **C3**: $\sqrt{1^2 + 2^2 + 1^2 + 3^2 + 2^2} = \sqrt{19} = \mathbf{4.359}$
*   **C4**: $\sqrt{4^2 + 3^2 + 4^2 + 3^2 + 2^2} = \sqrt{54} = \mathbf{7.348}$

**Matriks $R$ (Setelah Dibagi):**
| Alt | C1 | C2 | C3 | C4 |
| :--- | :---: | :---: | :---: | :---: |
| **A1** | 0.4309 | 0.5040 | 0.2294 | 0.5443 |
| **A2** | 0.3447 | 0.3780 | 0.4588 | 0.4082 |
| **A3** | 0.5171 | 0.6300 | 0.2294 | 0.5443 |
| **A4** | 0.6156 | 0.6300 | 0.6882 | 0.4082 |
| **A5** | 0.2216 | 0.2520 | 0.4588 | 0.2721 |

---

### Langkah 2: Matriks Ternormalisasi Terbobot ($Y$)
Rumus: $y_{ij} = w_j \times r_{ij}$

| Alt | C1 (x0.35) | C2 (x0.25) | C3 (x0.20) | C4 (x0.20) |
| :--- | :---: | :---: | :---: | :---: |
| **A1** | 0.1508 | 0.1260 | 0.0459 | 0.1089 |
| **A2** | 0.1206 | 0.0945 | 0.0918 | 0.0816 |
| **A3** | 0.1810 | 0.1575 | 0.0459 | 0.1089 |
| **A4** | 0.2155 | 0.1575 | 0.1376 | 0.0816 |
| **A5** | 0.0776 | 0.0630 | 0.0918 | 0.0544 |

---

### Langkah 3: Solusi Ideal ($A^+$ dan $A^-$)
*   $A^+$ (Ideal Positif): Benefit=Max, Cost=Min
*   $A^-$ (Ideal Negatif): Benefit=Min, Cost=Max

| Solusi | C1 (Cost) | C2 (Benefit) | C3 (Cost) | C4 (Cost) |
| :--- | :---: | :---: | :---: | :---: |
| **$A^+$** | **0.0776** | **0.1575** | **0.0459** | **0.0544** |
| **$A^-$** | **0.2155** | **0.0630** | **0.1376** | **0.1089** |

---

### Langkah 4: Jarak Euclidean ($D^+$ dan $D^-$)
Rumus: $D_i^+ = \sqrt{\sum (y_{ij} - A_j^+)^2}$

**Contoh Perhitungan Jarak A1 ke Positif ($D_1^+$):**
$D_1^+ = \sqrt{(0.1508-0.0776)^2 + (0.1260-0.1575)^2 + (0.0459-0.0459)^2 + (0.1089-0.0544)^2}$
$D_1^+ = \sqrt{0.0053 + 0.0010 + 0 + 0.0030} = \mathbf{0.0964}$

**Tabel Jarak Keseluruhan:**
| Alt | $D^+$ (Jarak ke Terbaik) | $D^-$ (Jarak ke Terburuk) |
| :--- | :---: | :---: |
| **A1** | 0.0964 | 0.1172 |
| **A2** | 0.0872 | 0.1118 |
| **A3** | 0.1167 | 0.1345 |
| **A4** | 0.1651 | 0.0984 |
| **A5** | 0.1065 | 0.1575 |

---

### Langkah 5: Nilai Preferensi Akhir ($V_i$) & Ranking
Rumus: $V_i = \frac{D_i^-}{D_i^- + D_i^+}$

| Alternatif | Perhitungan $V_i$ | Skor $V_i$ | Ranking |
| :--- | :---: | :---: | :---: |
| **A5 (Yogyakarta)** | $0.1575 / (0.1575 + 0.1065)$ | **0.5966** | **1** |
| **A1 (Bali)** | $0.1172 / (0.1172 + 0.0964)$ | **0.5487** | **2** |
| **A2 (Lombok)** | $0.1118 / (0.1118 + 0.0872)$ | **0.5618** | **3** |
| **A3 (Kuala Lumpur)** | $0.1345 / (0.1345 + 0.1167)$ | **0.5354** | **4** |
| **A4 (Singapura)** | $0.0984 / (0.0984 + 0.1651)$ | **0.3734** | **5** |

---

## 3. Kesimpulan Analisis
Kenapa **Yogyakarta (A5)** menang?
Meskipun fasilitasnya paling rendah (Skor 2), Yogyakarta unggul telak di dua kriteria dengan bobot total 55%, yaitu:
1.  **Harga (C1)**: Paling murah (1.8jt vs lainnya >2.8jt).
2.  **Durasi (C4)**: Paling singkat (2 hari), dianggap paling efisien dalam simulasi ini.

Sistem memberikan skor **0.5966**, yang menjadikannya rekomendasi utama (Ranking 1) bagi pelanggan yang mencari efisiensi biaya dan waktu.
---

## 4. Pemetaan Database ke Variabel TOPSIS
Agar algoritma di atas dapat berjalan pada aplikasi, berikut adalah pemetaan data dari database MySQL ke variabel kriteria:

| Kode | Kriteria | Sifat | Sumber Database (Tabel & Kolom) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | Harga | **Cost** | `price_tiers` -> `price` | Diambil harga terendah (`MIN`) |
| **C2** | Fasilitas | **Benefit** | `tour_packages` -> `facilityScore` | Input Admin (Skor 1-5) |
| **C3** | Waktu Keb. | **Cost** | `tour_packages` -> `departureScore` | Skor 1: Pagi, 2: Siang, 3: Malam |
| **C4** | Durasi | **Cost** | `tour_packages` -> `durationDays` | Jumlah hari perjalanan |

### Logika Benefit vs Cost:
1.  **Benefit (C2)**: Semakin **tinggi** nilainya, semakin besar peluang paket tersebut menjadi ranking 1.
2.  **Cost (C1, C3, C4)**: Semakin **rendah** nilainya, semakin besar peluang paket tersebut menjadi ranking 1.
    *   *Kenapa Waktu (C3) adalah Cost?* Karena dalam penelitian ini, waktu keberangkatan lebih awal (skor 1) dianggap lebih efisien daripada waktu yang lebih lambat.
    *   *Kenapa Durasi (C4) adalah Cost?* Karena durasi yang lebih singkat dianggap lebih padat dan efisien secara waktu bagi target pasar tertentu.
