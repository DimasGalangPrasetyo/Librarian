<?php

namespace App\Controllers\Api;

use App\Models\KategoriModel;
use App\Models\KoleksiModel;
use App\Models\PeminjamanModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class PublicController extends ResourceController
{
    protected $format = 'json';

    private function coverPalette(string $jenis): array
    {
        return match ($jenis) {
            'novel' => ['#243B53', '#F9735B', '#FFF7ED', 'bx-book-heart'],
            'komik' => ['#2D1B69', '#F472B6', '#F5F3FF', 'bx-planet'],
            default => ['#1F3D2B', '#D6A84F', '#F4E8D0', 'bx-library'],
        };
    }

    public function dashboard()
    {
        $koleksi = new KoleksiModel();
        $kategori = new KategoriModel();
        $pinjam = new PeminjamanModel();

        $popular = $kategori->select('kategori.id, kategori.jenis, kategori.nama_kategori, COUNT(koleksi.id) AS total_koleksi')
            ->join('koleksi', 'koleksi.kategori_id = kategori.id', 'left')
            ->groupBy('kategori.id')
            ->orderBy('total_koleksi', 'DESC')
            ->findAll(6);

        $latest = $koleksi->select('koleksi.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = koleksi.kategori_id')
            ->orderBy('koleksi.id', 'DESC')
            ->findAll(8);

        $featured = (new KoleksiModel())->select('koleksi.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = koleksi.kategori_id')
            ->where('koleksi.is_terkini', 1)
            ->orderBy('koleksi.updated_at', 'DESC')
            ->findAll(8);

        return $this->respond([
            'status' => 200,
            'data' => [
                'total_koleksi' => $koleksi->countAllResults(),
                'total_buku_umum' => $koleksi->where('jenis', 'umum')->countAllResults(),
                'total_novel' => (new KoleksiModel())->where('jenis', 'novel')->countAllResults(),
                'total_komik' => (new KoleksiModel())->where('jenis', 'komik')->countAllResults(),
                'total_tersedia' => (new KoleksiModel())->where('status_koleksi', 'tersedia')->countAllResults(),
                'total_dipinjam' => (new KoleksiModel())->where('status_koleksi', 'dipinjam')->countAllResults(),
                'peminjaman_aktif' => $pinjam->whereIn('status_peminjaman', ['aktif', 'terlambat'])->countAllResults(),
                'genre_populer' => $popular,
                'koleksi_terbaru' => $latest,
                'koleksi_terkini' => $featured,
            ],
        ]);
    }

    public function kategori()
    {
        $jenis = $this->request->getGet('jenis');
        $model = new KategoriModel();
        if ($jenis) {
            $model->where('jenis', $jenis);
        }
        return $this->respond([
            'status' => 200,
            'data' => $model->orderBy('jenis', 'ASC')->orderBy('nama_kategori', 'ASC')->findAll(),
        ]);
    }

    public function koleksi()
    {
        $jenis = $this->request->getGet('jenis');
        $kategoriId = $this->request->getGet('kategori_id');
        $q = $this->request->getGet('q');

        $model = new KoleksiModel();
        $builder = $model->select('koleksi.*, kategori.nama_kategori, kategori.slug_kategori')
            ->join('kategori', 'kategori.id = koleksi.kategori_id');

        if ($jenis) {
            $builder->where('koleksi.jenis', $jenis);
        }
        if ($kategoriId) {
            $builder->where('koleksi.kategori_id', $kategoriId);
        }
        if ($q) {
            $builder->groupStart()
                ->like('koleksi.judul', $q)
                ->orLike('koleksi.penulis', $q)
                ->orLike('kategori.nama_kategori', $q)
                ->groupEnd();
        }

        return $this->respond([
            'status' => 200,
            'data' => $builder->orderBy('koleksi.id', 'DESC')->findAll(60),
        ]);
    }

    public function koleksiDetail($id = null)
    {
        $model = new KoleksiModel();
        $data = $model->select('koleksi.*, kategori.nama_kategori, kategori.deskripsi AS deskripsi_kategori')
            ->join('kategori', 'kategori.id = koleksi.kategori_id')
            ->where('koleksi.id', $id)
            ->first();

        if (! $data) {
            return $this->failNotFound('Koleksi tidak ditemukan.');
        }

        return $this->respond([
            'status' => 200,
            'data' => $data,
        ]);
    }

    public function cover($id = null): ResponseInterface
    {
        $row = (new KoleksiModel())->find($id);
        if (! $row) {
            return $this->response->setStatusCode(404)->setHeader('Content-Type', 'image/svg+xml')
                ->setBody('<svg xmlns="http://www.w3.org/2000/svg" width="420" height="620"><rect width="100%" height="100%" fill="#CBD5E1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="#334155">Cover tidak ditemukan</text></svg>');
        }

        [$primary, $accent, $light, $icon] = $this->coverPalette($row['jenis'] ?? 'umum');
        $title = esc($row['judul'] ?: 'Tanpa Judul');
        $author = esc($row['penulis'] ?: 'Penulis belum diisi');
        $type = esc(match ($row['jenis'] ?? 'umum') {
            'novel' => 'Novel',
            'komik' => 'Komik',
            default => 'Buku Umum',
        });
        $initials = strtoupper(implode('', array_map(static fn ($part) => substr($part, 0, 1), array_slice(preg_split('/\s+/', trim($row['judul'] ?? 'Librarian')) ?: ['L'], 0, 2))));
        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="620" viewBox="0 0 420 620">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{$primary}" />
      <stop offset="100%" stop-color="{$accent}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="420" height="620" rx="36" fill="url(#bg)"/>
  <circle cx="360" cy="90" r="110" fill="rgba(255,255,255,0.10)"/>
  <circle cx="80" cy="560" r="120" fill="rgba(255,255,255,0.08)"/>
  <g filter="url(#shadow)">
    <rect x="48" y="58" width="324" height="504" rx="28" fill="rgba(255,255,255,0.14)"/>
  </g>
  <rect x="72" y="88" width="120" height="48" rx="18" fill="{$light}" opacity="0.95"/>
  <text x="132" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="{$primary}">{$type}</text>
  <g transform="translate(282,86)">
    <rect x="0" y="0" width="64" height="84" rx="16" fill="rgba(255,255,255,0.16)"/>
    <path d="M17 60V22c0-4.4 3.6-8 8-8h24c4.4 0 8 3.6 8 8v38c0 4.4-3.6 8-8 8H25c-4.4 0-8-3.6-8-8z" fill="rgba(255,255,255,0.92)"/>
    <path d="M25 14v54" stroke="{$accent}" stroke-width="4" opacity="0.9"/>
    <path d="M31 28h18M31 38h18M31 48h18" stroke="{$primary}" stroke-width="3" opacity="0.6"/>
  </g>
  <rect x="72" y="190" width="108" height="108" rx="28" fill="rgba(255,255,255,0.20)"/>
  <text x="126" y="257" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="#ffffff">{$initials}</text>
  <foreignObject x="72" y="328" width="276" height="140">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, Helvetica, sans-serif; color: white;">
      <div style="font-size: 34px; font-weight: 800; line-height: 1.18; max-height: 120px; overflow: hidden;">{$title}</div>
      <div style="margin-top: 14px; font-size: 18px; opacity: 0.84;">{$author}</div>
    </div>
  </foreignObject>
  <text x="72" y="530" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,0.72)">Librarian Collection</text>
</svg>
SVG;

        return $this->response->setHeader('Content-Type', 'image/svg+xml')->setBody($svg);
    }
}
