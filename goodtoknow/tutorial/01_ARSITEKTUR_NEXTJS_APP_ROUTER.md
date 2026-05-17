# 🏗️ Arsitektur Next.js 15 (App Router) pada Titan Travel

Aplikasi Titan Travel menggunakan versi Next.js terbaru dengan paradigma **App Router**. Ini mengubah cara kita memikirkan siklus pergerakan data dibandingkan dengan standar aplikasi single-page (SPA) tradisional.

## 1. Paradigma Server dan Client Components

Dalam struktur React modern yang diadopsi oleh Next.js, komponen dipecah menjadi dua dunia:

### Server Components (Default)
Secara bawaan, semua komponen di dalam `src/app` adalah **Server Components**.
- **Di mana dieksekusi?** Di lingkungan server Node.js.
- **Kelebihan Utama:** Dapat langsung membaca file sistem dan melakukan query langsung ke database (Prisma) tanpa melalui pembuatan endpoint API perantara. Selain itu ukuran *bundle* Javascript di sisi klien menjadi sangat kecil, meningkatkan kecepatan SEO dan Initial Page Load.
- **Batasan:** Tidak memiliki interaktivitas (`onClick`, `onChange`) dan tidak memiliki *State* atau *Hooks* (`useState`, `useEffect`).

### Client Components
Komponen ini dideklarasikan dengan direktif eksplisit `"use client";` pada baris pertama file.
- **Di mana dieksekusi?** Dirender awalnya (sebagai skeleton HTML) di server, dan dirender ulang (dihidupkan dengan Javascript) di browser klien.
- **Kelebihan Utama:** Mendukung penuh interaksi user (klik tombol, pengisian formulir) serta penggunaan Browser API (Geolocation, LocalStorage) dan state management.

> **💡 Best Practice:** Dorong batasan Client Components sejauh mungkin ke ujung daun (leaf nodes) dari *component tree*. Jangan jadikan satu halaman utuh sebagai Client Component kecuali terpaksa.

## 2. Server Actions: Menggantikan Endpoint API

Pada arsitektur REST API lama, Anda membuat URL rute seperti `/api/packages/create` untuk menyimpan data. 
Dengan **Server Actions**, Next.js menyembunyikan kompleksitas tersebut.

Anda hanya perlu mendefinisikan sebuah fungsi asynchronous dalam sebuah file (contoh: `src/lib/actions/topsis.ts`) dengan direktif `"use server";`. Fungsi tersebut kemudian dapat **langsung dipanggil** oleh Client Component. Di belakang layar, Next.js otomatis membuatkan endpoint POST tersembunyi yang efisien dan aman (menggunakan sistem RPC).

**Alur Data Titan Travel:**
1. Browser Client men-trigger event klik.
2. Memanggil fungsi async **Server Action**.
3. Di dalam Server Action, **Prisma ORM** akan terhubung ke PostgreSQL/MySQL.
4. Data dikembalikan langsung ke komponen klien dengan aman.

## 3. Struktur Folder Konvensi App Router

Titan Travel menggunakan pengelompokan yang sangat rapi di dalam `src/app`:
- **`(public)`**: Rute yang bisa diakses publik (Tanpa masuk ke *slug* URL, tanda kurung berfungsi mengelompokkan saja). Contoh: Landing Page, Halaman List Paket.
- **`(panel)`**: Dasbor interaktif khusus yang membutuhkan autentikasi dan otorisasi (*Role-Based Access Control*), dengan submenu turunan seperti `/admin` atau `/manager`.
- **`[slug]`**: Pola dinamis, seperti `/paket/[slug]/page.tsx` di mana slug ditangkap di parameter server untuk menarik detail spesifik ke database berdasarkan *slug*.
