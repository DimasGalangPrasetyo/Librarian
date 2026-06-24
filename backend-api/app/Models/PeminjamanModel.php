<?php

namespace App\Models;

use CodeIgniter\Model;

class PeminjamanModel extends Model
{
    protected $table = 'peminjaman';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = [
        'kode_pinjam', 'koleksi_id', 'anggota_id', 'tanggal_pinjam',
        'tanggal_jatuh_tempo', 'tanggal_kembali', 'status_peminjaman', 'catatan'
    ];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
