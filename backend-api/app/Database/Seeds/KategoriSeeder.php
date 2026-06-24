<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class KategoriSeeder extends Seeder
{
    private function slug(string $text): string
    {
        $slug = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $text));
        return trim($slug, '-');
    }

    public function run()
    {
        $data = [
            ['umum', 'Pelajaran', 'Buku pelajaran sekolah, kampus, dan referensi belajar.'],
            ['umum', 'Rumus', 'Kumpulan rumus matematika, fisika, kimia, dan statistika.'],
            ['umum', 'Kamus', 'Kamus bahasa, istilah teknis, dan glosarium.'],
            ['umum', 'Resep', 'Buku resep masakan, minuman, dan baking.'],
            ['umum', 'Ensiklopedia', 'Referensi umum dan pengetahuan populer.'],
            ['umum', 'Teknologi', 'Komputer, pemrograman, desain, dan teknologi informasi.'],
            ['novel', 'Romance', 'Cerita cinta dan hubungan antartokoh.'],
            ['novel', 'Drama', 'Konflik emosional dan kehidupan sehari-hari.'],
            ['novel', 'Misteri', 'Teka-teki, investigasi, dan rahasia.'],
            ['novel', 'Thriller', 'Ketegangan, konflik cepat, dan ancaman.'],
            ['novel', 'Fantasi', 'Dunia imajinatif, sihir, dan petualangan.'],
            ['novel', 'Fiksi Remaja', 'Cerita pertumbuhan, sekolah, dan persahabatan.'],
            ['komik', 'Action', 'Pertarungan, hero, dan adegan cepat.'],
            ['komik', 'Adventure', 'Petualangan dan eksplorasi dunia baru.'],
            ['komik', 'Fantasy', 'Dunia fantasi, kekuatan khusus, dan mitologi.'],
            ['komik', 'Comedy', 'Cerita ringan dan humor.'],
            ['komik', 'Slice of Life', 'Kehidupan sehari-hari dan relasi sosial.'],
            ['komik', 'Manga', 'Komik bergaya Jepang.'],
        ];

        foreach ($data as [$jenis, $nama, $deskripsi]) {
            $exists = $this->db->table('kategori')
                ->where('jenis', $jenis)
                ->where('nama_kategori', $nama)
                ->get()->getRowArray();

            if (!$exists) {
                $this->db->table('kategori')->insert([
                    'jenis' => $jenis,
                    'nama_kategori' => $nama,
                    'slug_kategori' => $this->slug($nama),
                    'deskripsi' => $deskripsi,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}
