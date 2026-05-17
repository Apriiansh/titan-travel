# 🗄️ Database Schema & Prisma ORM

Titan Travel dibangun di atas database SQL (PostgreSQL/MySQL) yang di-*scaffolding* menggunakan **Prisma ORM**. Skema database terpusat pada file tunggal `prisma/schema.prisma`. 

Berikut adalah anatomi dan entitas *core* dari struktur datanya:

## 1. Domain Entitas Inti

- **`User` & `Session`**
  Menangani sistem Akun dan Otorisasi. Tabel `users` menampung nama, email, dan peran atau otorisasi seperti tipe *enum* `USER`, `MANAGER`, dan `ADMIN`. Relasinya mengarah pada Session (Autentikasi).
  
- **`TourPackage` (Pusat Semesta)**
  Menyimpan inti informasi paket wisata. Memiliki fitur spesifik untuk Multi-Bahasa (*JSON fields* untuk title/description/location) serta atribut statis khusus untuk *scoring* SPK (seperti `facilityScore`, `departureScore`, `durationDays`). Berstatus publik jika `isPublished` di set ke *true*.
  
- **`PriceTier`**
  Karena harga tour bisa berbeda-beda tergantung batas minimum orang (PAX) serta moda transportasi (Vehicle Type), tabel ini berfungsi memberikan kelenturan penentuan harga untuk satu paket (*One-to-Many* relasi dari `TourPackage`).

- **`Booking`**
  Menyimpan jejak alur transaksi pesanan (Cart/Invoice). Mencatat Pax, Payment Type (Lunas/DP), serta status `CONFIRMED`, `PENDING`, dll.

## 2. Domain Parameter SPK TOPSIS

- **`TopsisCriterion`**
  Sebagai tabel *Settings* algoritma yang statis, berisikan C1, C2, C3, C4. Menyimpan konfigurasi `weight` (bobot asli) dan `type` (seperti *COST* atau *BENEFIT*). Ini menjadi sangat powerful bagi manajer untuk bermain-main dengan skor rekomendasi melalui Dashboard secara *real-time*.

## 3. Relasi Cerdas (*Cascade Delete & Cascade Relationships*)

Struktur Prisma di-desain sedemikian rupa agar tidak meninggalkan data *Orphan* (data terbuang tanpa induk). 
Contoh, pada entitas `PriceTier`:
```prisma
package TourPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
```
Saat manajer menghapus satu *Tour Package*, maka semua tingkatan harga (`PriceTier`) terkait akan secara otomatis musnah dihapus dari basis data tanpa perlu query pembersihan manual.

## Catatan Migrasi
Karena Next.js merupakan framework berbasis modern JS, semua perubahan di dalam file `.prisma` ini harus divalidasi dan diimplementasi ke SQL dengan command:
`npx prisma migrate dev --name <nama_perubahan>`
Ini akan menghasilkan folder riwayat perpindahan (*migrations log*) di `prisma/migrations`.
