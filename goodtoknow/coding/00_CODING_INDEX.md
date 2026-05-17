# 💻 Panduan Coding Fundamental: Titan Travel

Selamat datang di direktori **Coding Praktikal** Titan Travel! Panduan ini dirancang sangat bertahap (step-by-step), mulai dari cara Next.js 15 bekerja, pengenalan folder utama proyek, hingga sistem rekomendasi **TOPSIS** yang canggih.

Silakan pelajari secara berurutan agar pemahaman Anda tentang alur kode lebih solid:

## 📝 Daftar Modul

1. **[01_FUNDAMENTAL_NEXTJS.md](./01_FUNDAMENTAL_NEXTJS.md)**
   Pondasi awal! Memahami perbedaan kasta antara *Server Component* dan *Client Component*. Bagaimana membedakan halaman yang merender UI vs komponen yang berinteraksi dengan pengguna.

2. **[02_STRUKTUR_DIREKTORI_FUNGSI.md](./02_STRUKTUR_DIREKTORI_FUNGSI.md)**
   Membedah isi perut `src/` Titan Travel. Apa fungsi dari folder `components`, `hooks`, `lib`, `utils`, dan sistem `translations` Multi-bahasa?

3. **[03_DATABASE_PRISMA.md](./03_DATABASE_PRISMA.md)**
   Mempelajari bagaimana Next.js berkomunikasi dengan Database PostgreSQL/MySQL menggunakan Prisma ORM.

4. **[04_SISTEM_REKOMENDASI_TOPSIS.md](./04_SISTEM_REKOMENDASI_TOPSIS.md)**
   Pembedahan logika sistem SPK rekomendasi. Menggabungkan antara fungsi matematika TOPSIS dan bagaimana *Server Actions* mengeksekusinya.

5. **[05_KOMPONEN_UI_SHADCN.md](./05_KOMPONEN_UI_SHADCN.md)**
   Terakhir, bagaimana kita membangun antarmuka yang cantik dan interaktif secara praktis menggunakan Tailwind CSS dan Shadcn UI.

---
> **💡 Pesan untuk Pemula:**
> "Jangan langsung melompat ke Modul 04 jika Anda belum paham Modul 01. Di Next.js 15, meletakkan *Hooks* (`useState`) di tempat yang salah akan membuat layar Anda *Error*. Kuasai letaknya, dan kode Anda akan aman!"
