<?php

namespace App\Models;

use CodeIgniter\Model;

class KoleksiModel extends Model
{
    protected $table = 'koleksi';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = [
        'kategori_id', 'kode_koleksi', 'judul', 'jenis', 'penulis', 'penerbit',
        'tahun_terbit', 'isbn', 'sinopsis', 'status_koleksi', 'cover_url', 'is_terkini', 'rak_lokasi'
    ];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
