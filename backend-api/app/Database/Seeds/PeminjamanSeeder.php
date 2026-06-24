<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PeminjamanSeeder extends Seeder
{
    private function koleksiId(string $kode): int
    {
        $row = $this->db->table('koleksi')->where('kode_koleksi', $kode)->get()->getRowArray();
        return (int) ($row['id'] ?? 1);
    }

    private function anggotaId(string $kode): int
    {
        $row = $this->db->table('anggota')->where('kode_anggota', $kode)->get()->getRowArray();
        return (int) ($row['id'] ?? 1);
    }

    public function run()
    {
        $today = date('Y-m-d');
        $loans = [
            ['PJ-001', 'UM-003', 'AG-001', date('Y-m-d', strtotime('-3 days')), date('Y-m-d', strtotime('+4 days')), null, 'aktif', 'Peminjaman kamus untuk latihan bahasa.'],
            ['PJ-002', 'NV-002', 'AG-002', date('Y-m-d', strtotime('-12 days')), date('Y-m-d', strtotime('-5 days')), null, 'terlambat', 'Belum dikembalikan melewati jatuh tempo.'],
            ['PJ-003', 'KM-003', 'AG-003', date('Y-m-d', strtotime('-2 days')), date('Y-m-d', strtotime('+5 days')), null, 'aktif', 'Komik masih dibaca anggota.'],
            ['PJ-004', 'NV-001', 'AG-001', date('Y-m-d', strtotime('-20 days')), date('Y-m-d', strtotime('-13 days')), date('Y-m-d', strtotime('-12 days')), 'dikembalikan', 'Sudah kembali dengan kondisi baik.'],
        ];

        foreach ($loans as [$kode, $kodeKoleksi, $kodeAnggota, $pinjam, $tempo, $kembali, $status, $catatan]) {
            $exists = $this->db->table('peminjaman')->where('kode_pinjam', $kode)->get()->getRowArray();
            if (!$exists) {
                $this->db->table('peminjaman')->insert([
                    'kode_pinjam' => $kode,
                    'koleksi_id' => $this->koleksiId($kodeKoleksi),
                    'anggota_id' => $this->anggotaId($kodeAnggota),
                    'tanggal_pinjam' => $pinjam,
                    'tanggal_jatuh_tempo' => $tempo,
                    'tanggal_kembali' => $kembali,
                    'status_peminjaman' => $status,
                    'catatan' => $catatan,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}
