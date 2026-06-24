<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AnggotaSeeder extends Seeder
{
    public function run()
    {
        $members = [
            ['AG-001', 'Rizky Maulana', 'rizky@example.com', '081234567001', 'Bekasi', 'aktif'],
            ['AG-002', 'Salsa Nabila', 'salsa@example.com', '081234567002', 'Cikarang', 'aktif'],
            ['AG-003', 'Fajar Pratama', 'fajar@example.com', '081234567003', 'Tambun', 'aktif'],
            ['AG-004', 'Nadya Kirana', 'nadya@example.com', '081234567004', 'Karawang', 'nonaktif'],
        ];

        foreach ($members as [$kode, $nama, $email, $hp, $alamat, $status]) {
            $exists = $this->db->table('anggota')->where('kode_anggota', $kode)->get()->getRowArray();
            if (!$exists) {
                $this->db->table('anggota')->insert([
                    'kode_anggota' => $kode,
                    'nama' => $nama,
                    'email' => $email,
                    'no_hp' => $hp,
                    'alamat' => $alamat,
                    'status_anggota' => $status,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}
