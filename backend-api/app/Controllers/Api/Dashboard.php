<?php

namespace App\Controllers\Api;

use App\Models\AnggotaModel;
use App\Models\KategoriModel;
use App\Models\KoleksiModel;
use App\Models\PeminjamanModel;
use CodeIgniter\RESTful\ResourceController;

class Dashboard extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $today = date('Y-m-d');
        $koleksi = new KoleksiModel();
        $anggota = new AnggotaModel();
        $kategori = new KategoriModel();
        $peminjaman = new PeminjamanModel();

        $recent = $peminjaman->select('peminjaman.*, koleksi.judul, koleksi.kode_koleksi, anggota.nama AS nama_anggota')
            ->join('koleksi', 'koleksi.id = peminjaman.koleksi_id')
            ->join('anggota', 'anggota.id = peminjaman.anggota_id')
            ->orderBy('peminjaman.id', 'DESC')
            ->findAll(6);

        return $this->respond([
            'status' => 200,
            'data' => [
                'total_koleksi' => $koleksi->countAllResults(),
                'total_buku_umum' => (new KoleksiModel())->where('jenis', 'umum')->countAllResults(),
                'total_novel' => (new KoleksiModel())->where('jenis', 'novel')->countAllResults(),
                'total_komik' => (new KoleksiModel())->where('jenis', 'komik')->countAllResults(),
                'total_anggota' => $anggota->countAllResults(),
                'total_kategori' => $kategori->countAllResults(),
                'peminjaman_aktif' => (new PeminjamanModel())->whereIn('status_peminjaman', ['aktif', 'terlambat'])->countAllResults(),
                'peminjaman_terlambat' => (new PeminjamanModel())->groupStart()->where('status_peminjaman', 'terlambat')->orGroupStart()->where('status_peminjaman', 'aktif')->where('tanggal_jatuh_tempo <', $today)->groupEnd()->groupEnd()->countAllResults(),
                'koleksi_tersedia' => (new KoleksiModel())->where('status_koleksi', 'tersedia')->countAllResults(),
                'koleksi_rusak' => (new KoleksiModel())->where('status_koleksi', 'rusak')->countAllResults(),
                'koleksi_hilang' => (new KoleksiModel())->where('status_koleksi', 'hilang')->countAllResults(),
                'koleksi_terkini' => (new KoleksiModel())->where('is_terkini', 1)->countAllResults(),
                'peminjaman_terbaru' => $recent,
            ],
        ]);
    }
}
