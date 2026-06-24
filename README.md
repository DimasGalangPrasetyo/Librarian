# Librarian

**Librarian** adalah Sistem Informasi Rental Buku dan Komik Digital berbasis **Decoupled Architecture**. Backend dibangun menggunakan **CodeIgniter 4 sebagai RESTful API Server**, sedangkan frontend dibangun menggunakan **VueJS 3 + Vue Router CDN sebagai Single Page Application (SPA)**. Tampilan dibuat dengan **TailwindCSS CDN**, Axios sebagai HTTP client, Boxicons untuk ikon, dan AOS untuk animasi public page.

## Tema Studi Kasus

Tema yang dipilih: **Sistem Informasi Rental Buku / Komik Digital (E-Library)**.

Aplikasi memisahkan koleksi menjadi 3 jenis utama:

1. **Buku Umum**: buku pelajaran, rumus, kamus, resep, ensiklopedia, teknologi, dan referensi umum.
2. **Novel**: romance, drama, misteri, thriller, fantasi, dan fiksi remaja.
3. **Komik**: action, adventure, fantasy, comedy, slice of life, manga, dan genre komik lain.

Setiap jenis koleksi memiliki tema warna berbeda:

| Jenis | Tema | Primary | Secondary 1 | Secondary 2 | Accent |
|---|---|---|---|---|---|
| Buku Umum | Library | `#1F3D2B` | `#F4E8D0` | `#8B5E3C` | `#D6A84F` |
| Novel | Casual | `#243B53` | `#FFF7ED` | `#D9A5A5` | `#F9735B` |
| Komik | Dreams Fantasy | `#2D1B69` | `#6D8DFF` | `#C4B5FD` | `#F472B6` |

## Hak Akses

### Public / Pengunjung

Public tidak menggunakan login dan tidak memiliki tombol menuju admin. Public hanya dapat mengakses:

- Landing page Librarian
- Halaman Buku Umum
- Halaman Novel
- Halaman Komik
- Detail koleksi
- Ringkasan total koleksi dan genre populer

### Administrator

Administrator wajib login melalui route khusus:

```text
#/admin/login
```

Setelah login, admin dapat mengakses:

- Dashboard
- CRUD kategori / genre
- CRUD koleksi
- CRUD anggota
- CRUD peminjaman
- Ubah status koleksi: tersedia, dipinjam, rusak, hilang
- Ubah status peminjaman: aktif, terlambat, dikembalikan
- Logout

## Struktur Folder

```text
UAS_Web2_NIM_Nama/
├── backend-api/
│   ├── app/
│   │   ├── Controllers/Api/
│   │   ├── Models/
│   │   ├── Database/Migrations/
│   │   ├── Database/Seeds/
│   │   ├── Filters/
│   │   └── Config/
│   ├── public/
│   ├── vendor/
│   ├── .env
│   └── spark
├── frontend-spa/
│   ├── index.html
│   └── assets/js/
│       ├── app.js
│       ├── config.js
│       └── components/
└── README.md
```

## Relasi Database

Tabel utama yang digunakan:

1. `users`
2. `kategori`
3. `koleksi`
4. `anggota`
5. `peminjaman`

Relasi:

```text
kategori.id       1 ---- * koleksi.kategori_id
koleksi.id        1 ---- * peminjaman.koleksi_id
anggota.id        1 ---- * peminjaman.anggota_id
users             digunakan untuk login admin dan token API
```

Silakan tambahkan screenshot relasi tabel dari phpMyAdmin Designer pada bagian ini.

```text
/docs/screenshots/relasi-database.png
```

## Endpoint API Utama

Base URL backend:

```text
http://localhost:8080/api
```

### Public Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/public/dashboard` | Ringkasan public |
| GET | `/public/kategori` | Daftar genre public |
| GET | `/public/koleksi` | Daftar koleksi public |
| GET | `/public/koleksi/{id}` | Detail koleksi public |

### Auth Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/login` | Login admin dan menghasilkan token |
| POST | `/logout` | Logout admin dan menghapus token |

### Admin Endpoint Proteksi Token

Endpoint berikut wajib memakai header:

```text
Authorization: Bearer <token>
```

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/dashboard` | Dashboard admin |
| GET/POST/PUT/DELETE | `/kategori` | CRUD kategori |
| GET/POST/PUT/DELETE | `/koleksi` | CRUD koleksi |
| GET/POST/PUT/DELETE | `/anggota` | CRUD anggota |
| GET/POST/PUT/DELETE | `/peminjaman` | CRUD peminjaman |

## Pengujian Token 401 di Postman

Contoh pengujian API tanpa token:

```text
Method: POST
URL   : http://localhost:8080/api/koleksi
Header: kosongkan Authorization
```

Body JSON:

```json
{
  "judul": "Tes Tanpa Token",
  "jenis": "umum",
  "kategori_id": 1
}
```

Hasil yang benar:

```json
{
  "status": 401,
  "error": 401,
  "messages": "Akses ditolak. Token tidak ditemukan pada request."
}
```

Tambahkan screenshot Postman 401 di:

```text
/docs/screenshots/postman-401.png
```

## Cara Instalasi Backend

1. Masuk ke folder backend:

```bash
cd backend-api
```

2. Pastikan database sudah dibuat di MySQL/MariaDB:

```sql
CREATE DATABASE librarian_db;
```

3. Cek konfigurasi `.env`:

```text
database.default.hostname = localhost
database.default.database = librarian_db
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
```

4. Jalankan migrasi dan seeder:

```bash
php spark migrate
php spark db:seed DatabaseSeeder
```

5. Jalankan server backend:

```bash
php spark serve
```

Backend berjalan di:

```text
http://localhost:8080
```

## Cara Menjalankan Frontend

Buka file berikut di browser:

```text
frontend-spa/index.html
```

Atau jalankan dengan Live Server VSCode agar lebih rapi.

## Akun Admin

```text
Email    : admin@email.com
Password : admin123
```

## Screenshot Aplikasi

Tambahkan screenshot berikut sebelum submit:

```text
/docs/screenshots/login-admin.png
/docs/screenshots/dashboard-admin.png
/docs/screenshots/modal-tambah-edit.png
/docs/screenshots/tabel-tailwind.png
/docs/screenshots/public-home.png
/docs/screenshots/public-koleksi.png
/docs/screenshots/network-authorization-bearer.png
```

## Link Demo dan Video Presentasi

```text
Link Demo            : -
Link Video YouTube   : -
```

## Kesimpulan Keamanan

Vue Router Navigation Guards bekerja di sisi klien untuk mencegah pengguna yang belum login membuka route admin pada SPA. Namun proteksi ini tidak cukup karena request API tetap bisa ditembak langsung melalui Postman. Oleh karena itu backend menggunakan CodeIgniter Filters `ApiAuthFilter` untuk memeriksa header `Authorization: Bearer <token>` sebelum endpoint admin diproses. Axios Interceptors di frontend membantu menyisipkan token secara otomatis ke setiap request admin dan menangani error 401 secara global.
