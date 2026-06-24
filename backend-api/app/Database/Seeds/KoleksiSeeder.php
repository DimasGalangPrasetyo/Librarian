<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class KoleksiSeeder extends Seeder
{
    private function kategoriId(string $jenis, string $nama): int
    {
        $row = $this->db->table('kategori')
            ->where('jenis', $jenis)
            ->where('nama_kategori', $nama)
            ->get()->getRowArray();

        return (int) ($row['id'] ?? 1);
    }

    public function run()
    {
        $items = [
            ['UM-001', 'umum', 'Pelajaran', 'Matematika Dasar untuk SMA', 'Tim Eduka', 'Pustaka Belajar', 2022, 'Ringkasan materi aljabar, geometri, statistika, dan latihan soal bertahap.', 'tersedia', 'Rak A1'],
            ['UM-002', 'umum', 'Rumus', 'Buku Saku Rumus Fisika', 'D. Prasetyo', 'Cendekia Press', 2021, 'Kumpulan rumus fisika lengkap dengan contoh penggunaan singkat.', 'tersedia', 'Rak A2'],
            ['UM-003', 'umum', 'Kamus', 'Kamus Inggris-Indonesia Praktis', 'Lembaga Bahasa Nusantara', 'Bahasa Kita', 2020, 'Kamus ringkas untuk kebutuhan sekolah, kerja, dan percakapan harian.', 'dipinjam', 'Rak A3'],
            ['UM-004', 'umum', 'Resep', 'Resep Rumahan 30 Hari', 'Maya Lestari', 'Dapur Cerita', 2023, 'Kumpulan menu harian sederhana, hemat, dan mudah dicoba.', 'tersedia', 'Rak A4'],
            ['UM-005', 'umum', 'Teknologi', 'Dasar Pemrograman Web Modern', 'Raka Wijaya', 'Tekno Media', 2024, 'Pengantar HTML, CSS, JavaScript, REST API, dan konsep SPA.', 'rusak', 'Rak A5'],
            ['NV-001', 'novel', 'Romance', 'Senja di Stasiun Kota', 'Alina Putri', 'Langit Cerita', 2021, 'Kisah dua orang yang saling mencari di tengah ritme kota yang cepat.', 'tersedia', 'Rak B1'],
            ['NV-002', 'novel', 'Drama', 'Rumah yang Tidak Pernah Pulang', 'Naufal Hidayat', 'Narasi Senja', 2022, 'Novel keluarga tentang kehilangan, harapan, dan keberanian memulai ulang.', 'dipinjam', 'Rak B2'],
            ['NV-003', 'novel', 'Misteri', 'Kode di Balik Jendela', 'Tara Maheswari', 'Aksara Hitam', 2020, 'Misteri surat lama yang menghubungkan masa lalu dengan kasus baru.', 'tersedia', 'Rak B3'],
            ['NV-004', 'novel', 'Fantasi', 'Kerajaan Awan Biru', 'Reno Aditya', 'Fantasia House', 2023, 'Petualangan di kerajaan langit yang dijaga oleh arsip mimpi.', 'tersedia', 'Rak B4'],
            ['NV-005', 'novel', 'Thriller', 'Detik Terakhir', 'Nadia Arum', 'Pena Gelap', 2024, 'Ketegangan seorang jurnalis yang membongkar jaringan rahasia.', 'hilang', 'Rak B5'],
            ['KM-001', 'komik', 'Action', 'Blade Runner Academy Vol. 1', 'K. Arata', 'Panelverse', 2021, 'Aksi murid akademi tempur melindungi kota dari ancaman robot liar.', 'tersedia', 'Rak C1'],
            ['KM-002', 'komik', 'Adventure', 'Pulau Mesin Tua Vol. 1', 'Dimas Ren', 'Komika Studio', 2022, 'Petualangan kru muda menemukan pulau penuh teknologi kuno.', 'tersedia', 'Rak C2'],
            ['KM-003', 'komik', 'Fantasy', 'Dream Gate Vol. 1', 'Luna Kei', 'Fantasy Panel', 2023, 'Gerbang mimpi membawa tokoh utama ke dunia penuh sihir warna.', 'dipinjam', 'Rak C3'],
            ['KM-004', 'komik', 'Comedy', 'Kos-Kosan Hero Vol. 2', 'Aji Purnama', 'Laugh Ink', 2020, 'Komedi keseharian para penghuni kos yang diam-diam punya kekuatan unik.', 'tersedia', 'Rak C4'],
            ['KM-005', 'komik', 'Manga', 'Samurai Kopi Vol. 1', 'Hiro Naka', 'Manga Line', 2024, 'Manga aksi ringan tentang barista yang menjaga kota dengan pedang kayu.', 'tersedia', 'Rak C5'],
        ];

        foreach ($items as [$kode, $jenis, $kategori, $judul, $penulis, $penerbit, $tahun, $sinopsis, $status, $rak]) {
            $exists = $this->db->table('koleksi')->where('kode_koleksi', $kode)->get()->getRowArray();
            if (!$exists) {
                $this->db->table('koleksi')->insert([
                    'kategori_id' => $this->kategoriId($jenis, $kategori),
                    'kode_koleksi' => $kode,
                    'judul' => $judul,
                    'jenis' => $jenis,
                    'penulis' => $penulis,
                    'penerbit' => $penerbit,
                    'tahun_terbit' => $tahun,
                    'isbn' => null,
                    'sinopsis' => $sinopsis,
                    'status_koleksi' => $status,
                    'cover_url' => null,
                    'rak_lokasi' => $rak,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}
