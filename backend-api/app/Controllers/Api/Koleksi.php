<?php

namespace App\Controllers\Api;

use App\Models\KoleksiModel;
use CodeIgniter\HTTP\Files\UploadedFile;
use CodeIgniter\RESTful\ResourceController;

class Koleksi extends ResourceController
{
    protected $format = 'json';
    private array $statusList = ['tersedia', 'dipinjam', 'rusak', 'hilang'];
    private array $jenisList = ['umum', 'novel', 'komik'];

    private function payload(): array
    {
        $json = $this->request->getJSON(true);
        if (is_array($json)) {
            return $json;
        }

        $raw = $this->request->getRawInput();
        if (! empty($raw)) {
            return $raw;
        }

        return $this->request->getPost();
    }

    private function normalizePayload(array $payload): array
    {
        if (array_key_exists('is_terkini', $payload)) {
            $payload['is_terkini'] = in_array((string) $payload['is_terkini'], ['1', 'true', 'on', 'yes'], true) ? 1 : 0;
        }
        return $payload;
    }

    private function saveUploadedCover(?UploadedFile $file, ?string $oldUrl = null): ?string
    {
        if (! $file || ! $file->isValid() || $file->hasMoved()) {
            return $oldUrl;
        }

        $mime = $file->getMimeType();
        if (! in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) {
            return $oldUrl;
        }

        $dir = FCPATH . 'uploads/covers';
        if (! is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        if ($oldUrl && str_contains($oldUrl, '/uploads/covers/')) {
            $oldPath = FCPATH . ltrim(parse_url($oldUrl, PHP_URL_PATH) ?? '', '/');
            if (is_file($oldPath)) {
                @unlink($oldPath);
            }
        }

        $newName = $file->getRandomName();
        $file->move($dir, $newName, true);

        return base_url('uploads/covers/' . $newName);
    }

    private function collectFormData(): array
    {
        $payload = $this->normalizePayload($this->request->getPost());
        foreach (['kategori_id', 'tahun_terbit'] as $numField) {
            if (isset($payload[$numField]) && $payload[$numField] === '') {
                $payload[$numField] = null;
            }
        }
        return $payload;
    }

    public function index()
    {
        $jenis = $this->request->getGet('jenis');
        $status = $this->request->getGet('status');
        $q = $this->request->getGet('q');
        $kategoriId = $this->request->getGet('kategori_id');

        $model = new KoleksiModel();
        $builder = $model->select('koleksi.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = koleksi.kategori_id');

        if ($jenis) { $builder->where('koleksi.jenis', $jenis); }
        if ($status) { $builder->where('koleksi.status_koleksi', $status); }
        if ($kategoriId) { $builder->where('koleksi.kategori_id', $kategoriId); }
        if ($q) {
            $builder->groupStart()
                ->like('koleksi.judul', $q)
                ->orLike('koleksi.penulis', $q)
                ->orLike('koleksi.kode_koleksi', $q)
                ->groupEnd();
        }

        return $this->respond(['status' => 200, 'data' => $builder->orderBy('koleksi.id', 'DESC')->findAll()]);
    }

    public function show($id = null)
    {
        $model = new KoleksiModel();
        $data = $model->select('koleksi.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = koleksi.kategori_id')
            ->where('koleksi.id', $id)
            ->first();
        if (! $data) { return $this->failNotFound('Koleksi tidak ditemukan.'); }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $payload = $this->normalizePayload($this->payload());
        if (empty($payload['judul']) || empty($payload['jenis']) || empty($payload['kategori_id'])) {
            return $this->failValidationErrors('Judul, jenis, dan kategori wajib diisi.');
        }
        if (! in_array($payload['jenis'], $this->jenisList, true)) {
            return $this->failValidationErrors('Jenis koleksi tidak valid.');
        }

        $model = new KoleksiModel();
        $id = $model->insert([
            'kategori_id' => $payload['kategori_id'],
            'kode_koleksi' => $payload['kode_koleksi'] ?? strtoupper(substr($payload['jenis'], 0, 2)) . '-' . date('His'),
            'judul' => $payload['judul'],
            'jenis' => $payload['jenis'],
            'penulis' => $payload['penulis'] ?? null,
            'penerbit' => $payload['penerbit'] ?? null,
            'tahun_terbit' => $payload['tahun_terbit'] ?? null,
            'isbn' => $payload['isbn'] ?? null,
            'sinopsis' => $payload['sinopsis'] ?? null,
            'status_koleksi' => $payload['status_koleksi'] ?? 'tersedia',
            'cover_url' => $payload['cover_url'] ?? null,
            'is_terkini' => $payload['is_terkini'] ?? 0,
            'rak_lokasi' => $payload['rak_lokasi'] ?? null,
        ]);

        return $this->respondCreated(['status' => 201, 'messages' => 'Koleksi berhasil ditambahkan.', 'data' => $model->find($id)]);
    }

    public function update($id = null)
    {
        $model = new KoleksiModel();
        $old = $model->find($id);
        if (! $old) { return $this->failNotFound('Koleksi tidak ditemukan.'); }

        $payload = $this->normalizePayload($this->payload());
        $data = [];
        foreach (['kategori_id','kode_koleksi','judul','jenis','penulis','penerbit','tahun_terbit','isbn','sinopsis','status_koleksi','cover_url','is_terkini','rak_lokasi'] as $field) {
            if (array_key_exists($field, $payload)) {
                $data[$field] = $payload[$field];
            }
        }
        if (isset($data['status_koleksi']) && ! in_array($data['status_koleksi'], $this->statusList, true)) {
            return $this->failValidationErrors('Status koleksi tidak valid.');
        }
        if (isset($data['jenis']) && ! in_array($data['jenis'], $this->jenisList, true)) {
            return $this->failValidationErrors('Jenis koleksi tidak valid.');
        }

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'messages' => 'Koleksi berhasil diperbarui.', 'data' => $model->find($id)]);
    }

    public function uploadCreate()
    {
        $payload = $this->collectFormData();
        if (empty($payload['judul']) || empty($payload['jenis']) || empty($payload['kategori_id'])) {
            return $this->failValidationErrors('Judul, jenis, dan kategori wajib diisi.');
        }
        if (! in_array($payload['jenis'], $this->jenisList, true)) {
            return $this->failValidationErrors('Jenis koleksi tidak valid.');
        }

        $coverUrl = $payload['cover_url'] ?? null;
        $file = $this->request->getFile('cover_file');
        if ($file && $file->isValid()) {
            $coverUrl = $this->saveUploadedCover($file, null);
        }

        $model = new KoleksiModel();
        $id = $model->insert([
            'kategori_id' => $payload['kategori_id'],
            'kode_koleksi' => $payload['kode_koleksi'] ?? strtoupper(substr($payload['jenis'], 0, 2)) . '-' . date('His'),
            'judul' => $payload['judul'],
            'jenis' => $payload['jenis'],
            'penulis' => $payload['penulis'] ?? null,
            'penerbit' => $payload['penerbit'] ?? null,
            'tahun_terbit' => $payload['tahun_terbit'] ?? null,
            'isbn' => $payload['isbn'] ?? null,
            'sinopsis' => $payload['sinopsis'] ?? null,
            'status_koleksi' => $payload['status_koleksi'] ?? 'tersedia',
            'cover_url' => $coverUrl,
            'is_terkini' => $payload['is_terkini'] ?? 0,
            'rak_lokasi' => $payload['rak_lokasi'] ?? null,
        ]);

        return $this->respondCreated(['status' => 201, 'messages' => 'Koleksi berhasil ditambahkan.', 'data' => $model->find($id)]);
    }

    public function uploadUpdate($id = null)
    {
        $model = new KoleksiModel();
        $old = $model->find($id);
        if (! $old) {
            return $this->failNotFound('Koleksi tidak ditemukan.');
        }

        $payload = $this->collectFormData();
        $data = [];
        foreach (['kategori_id','kode_koleksi','judul','jenis','penulis','penerbit','tahun_terbit','isbn','sinopsis','status_koleksi','cover_url','is_terkini','rak_lokasi'] as $field) {
            if (array_key_exists($field, $payload)) {
                $data[$field] = $payload[$field];
            }
        }

        $file = $this->request->getFile('cover_file');
        if ($file && $file->isValid()) {
            $data['cover_url'] = $this->saveUploadedCover($file, $old['cover_url'] ?? null);
        }

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'messages' => 'Koleksi berhasil diperbarui.', 'data' => $model->find($id)]);
    }

    public function toggleTerkini($id = null)
    {
        $model = new KoleksiModel();
        $row = $model->find($id);
        if (! $row) {
            return $this->failNotFound('Koleksi tidak ditemukan.');
        }

        $newValue = ($row['is_terkini'] ?? 0) ? 0 : 1;
        $model->update($id, ['is_terkini' => $newValue]);

        return $this->respond([
            'status' => 200,
            'messages' => $newValue ? 'Koleksi dimasukkan ke Koleksi Terkini.' : 'Koleksi dikeluarkan dari Koleksi Terkini.',
            'data' => $model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $model = new KoleksiModel();
        $row = $model->find($id);
        if (! $row) { return $this->failNotFound('Koleksi tidak ditemukan.'); }
        if (! empty($row['cover_url']) && str_contains($row['cover_url'], '/uploads/covers/')) {
            $path = FCPATH . ltrim(parse_url($row['cover_url'], PHP_URL_PATH) ?? '', '/');
            if (is_file($path)) {
                @unlink($path);
            }
        }
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'messages' => 'Koleksi berhasil dihapus.']);
    }
}
