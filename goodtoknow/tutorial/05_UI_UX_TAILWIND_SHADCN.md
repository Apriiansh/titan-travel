# 💅 UI/UX dengan Tailwind CSS dan Shadcn

Antarmuka pengguna (UI) dari Titan Travel tidak dibangun dari nol secara tradisional menggunakan *vanilla CSS*. Sistem UI ini merupakan persilangan antara kelenturan utilitas **Tailwind CSS** dengan kekayaan fungsional dari komponen siap pakai **Shadcn UI**.

## 1. Tailwind CSS

Tailwind CSS merupakan kerangka kerja utilitas yang berfokus pada efisiensi. Alih-alih Anda menulis di file CSS khusus:
```css
.card {
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
}
```
Kita menulis *inline* kelas langsung di dalam struktur JSX React:
```tsx
<div className="p-4 bg-white rounded-lg">
```

### Keunggulan untuk Titan Travel
- Kustomisasi sangat cepat, tidak perlu memikirkan penamaan class (BEM konvensi tidak diperlukan).
- Otomatis menghapus kelas yang tidak dipakai (Treeshaking) ketika di *build* untuk memperkecil ukuran *payload* klien.
- Pengaturan responsif sangat intuitif (Cukup gunakan awalan `md:`, `lg:` contohnya `md:p-8` akan melebarkan *padding* hanya di layar setara tablet ke atas).

## 2. Shadcn UI

Titan Travel banyak menggunakan elemen kompleks seperti Formulir interaktif, Dropdown Select, Modal Dialog, Tabel Pagination, dan Toast (Pop-up Sukses/Gagal). Membangun logika itu secara manual tidak produktif.

Itulah mengapa kita menggunakan komponen **Shadcn UI**.

> *Catatan Penting: Shadcn bukanlah library komponen npm standar. Anda tidak melakukan `npm install shadcn`. Shadcn adalah kumpulan kode mentah yang disuntikkan langsung ke folder proyek `src/components/ui/` melalui command interface (CLI).*

### Kenapa Shadcn?
1. **Fully Accessible (a11y):** Otomatis mendukung interaksi *Keyboard* bagi penyandang disabilitas atau *Power User*.
2. **Kustomisasi Tak Terbatas:** Karena kodenya *dikirim mentah* ke folder proyek kita, kita bisa memodifikasinya dengan Tailwind CSS sebebas-bebasnya, tidak seperti Material-UI yang sangat kaku.
3. **Animasi Smooth:** Integrasi mulus dengan *Framer Motion* atau *Radix UI* *under-the-hood*.

## 3. Kombinasi di Lingkungan Komponen

Biasanya, sebuah form di Titan Travel akan digabungkan seperti ini (Ilustrasi penyatuan Shadcn dan Server Action):

```tsx
"use client";
import { Button } from "@/components/ui/button"; // Shadcn Button

export function DeleteButton({ id }: { id: string }) {
   return (
      <Button 
        variant="destructive" // Pre-defined variant shadcn
        className="w-full mt-4 hover:shadow-lg" // Customisasi Tailwind tambahan
        onClick={() => deleteAction(id)}
      >
        Hapus Paket
      </Button>
   )
}
```

Ini menciptakan *Developer Experience* (DX) yang sangat menakjubkan bagi engineer, mempercepat pengembangan UI yang konsisten dan elegan.
