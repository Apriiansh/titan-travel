# 📁 Membedah Anatomi Folder `src/` Titan Travel

Sebuah proyek Next.js yang skalabel selalu memisahkan logic sesuai dengan fungsinya. Di Titan Travel, folder `src/` memiliki beberapa "Ruangan" khusus. Mari kita pelajari peran masing-masing ruang.

## 1. Folder `src/app` (Sistem Routing Utama)

Ini adalah folder terpenting. Semua *URL Path* di aplikasi lahir dari sini.
- `src/app/page.tsx` = Mengakses `localhost:3000/` (Beranda).
- `src/app/(panel)/admin/page.tsx` = Mengakses `localhost:3000/admin`. *(Folder dalam kurung tidak ikut masuk URL, hanya untuk merapikan kelompok Dashboard).*

## 2. Folder `src/components` (Pabrik UI)

Di sini kita meletakkan "Batu Bata" pembentuk web.
- **`src/components/ui/`**: Berisi komponen dasar dari Shadcn UI (seperti `button.tsx`, `input.tsx`, `dialog.tsx`). Ini adalah komponen "bisu" yang hanya bertugas tampil cantik.
- **`src/components/panel/`**: Berisi komponen-komponen kompleks khusus untuk Dashboard Admin (seperti `AppSidebar.tsx` atau `PanelHeader.tsx`).

## 3. Folder `src/lib` (Perpustakaan Mesin Inti)

Ini adalah dapur utama. Semua kode murni Javascript/Typescript yang mengurus koneksi atau kalkulasi matematika ada di sini.
- **`src/lib/prisma.ts`**: Skrip penghubung agar Next.js bisa mengobrol dengan Database.
- **`src/lib/topsis.ts`**: Otak matematis perhitungan skor TOPSIS.
- **`src/lib/actions/`**: Folder khusus menampung **Server Actions**. Ini adalah pengganti API. File `topsis.ts` di dalam `actions` bertugas menjembatani interaksi tombol dari pengguna ke *engine* `lib/topsis.ts`.

## 4. Folder `src/hooks` (Perkakas Klien Kustom)

Hooks kustom adalah fungsi yang berawalan dengan `use` (misal: `useToast` atau `useMediaQuery`).
Titan Travel menggunakannya untuk logika frontend yang dipakai berulang-ulang.

Contoh Kasus: 
Daripada kita menulis logika untuk memunculkan notifikasi pop-up (Toast) setiap kali dari nol, kita cukup memanggil `const { toast } = useToast()`.

## 5. Folder `src/utils` (Alat Bantu Ringan)

Berbeda dengan `lib` yang mengurus mesin inti, `utils` biasanya berisi fungsi-fungsi format kecil yang serbaguna (Bisa dipakai di Server maupun Client).
- **Format Uang**: `export const formatRupiah = (angka) => { ... }`
- **Format Tanggal**: Mengubah `2024-05-12` menjadi `12 Mei 2024`.
- **Gabung Class Tailwind**: Fungsi `cn()` buatan Shadcn yang bertugas menggabungkan string-string nama *class* Tailwind.

## 6. Fitur `translations` (Multi-Bahasa)

Titan Travel didesain sebagai platform Tour Guide Internasional. 
Di database (`TourPackage`), judul dan deskripsi sering disimpan dalam format JSON:
`{"id": "Tur Bali", "en": "Bali Tour"}`

Di dalam `src/lib/translations.ts` atau file sejenis, biasanya terdapat fungsi *helper* untuk memilih bahasa secara cerdas.
Jika user memilih bahasa Inggris, fungsi utilitas translasi akan otomatis menarik object `title.en`. Jika tidak ada, ia akan *fallback* (kembali) menggunakan bahasa Indonesia `title.id`.


---
<div align="center">

[⬅️ Sebelumnya: Fundamental Next.js](./01_FUNDAMENTAL_NEXTJS.md) | [🏠 Indeks Utama](./00_CODING_INDEX.md) | [Selanjutnya: Database & Prisma ➡️](./03_DATABASE_PRISMA.md)

</div>
