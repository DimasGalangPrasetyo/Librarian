# Menjalankan Frontend Librarian

Frontend jangan dibuka dengan `file://` untuk pengujian akhir. Jalankan sebagai server statis agar URL demo lokal jelas.

## Cara 1 - dari root project

Klik dua kali `run_frontend.bat`, lalu buka:

```text
http://localhost:5500/
```

Admin login:

```text
http://localhost:5500/#/admin/login
```

## Cara 2 - terminal

```bash
php -S localhost:5500 -t frontend-spa
```

Pastikan backend API juga aktif di:

```text
http://localhost:8080
```

Konfigurasi API ada di `assets/js/config.js`:

```js
const API_BASE_URL = 'http://localhost:8080/api';
```
