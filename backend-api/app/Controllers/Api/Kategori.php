<?php

namespace App\Controllers\Api;

use App\Models\KategoriModel;
use CodeIgniter\RESTful\ResourceController;

class Kategori extends ResourceController
{
    protected $format = 'json';
    private function payload(): array
    {
        $json = $this->request->getJSON(true);
        if (is_array($json)) {
            return $json;
        }

        $raw = $this->request->getRawInput();
        if (!empty($raw)) {
            return $raw;
        }

        return $this->request->getPost();
    }

    private function slug(string $text): string
    {
        $slug = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $text));
        return trim($slug, '-');
    }

    public function index()
    {
        $jenis = $this->request->getGet('jenis');
        $q = $this->request->getGet('q');
        $model = new KategoriModel();

        if ($jenis) {
            $model->where('jenis', $jenis);
        }
        if ($q) {
            $model->like('nama_kategori', $q);
        }

        return $this->respond([
            'status' => 200,
            'data' => $model->orderBy('jenis', 'ASC')->orderBy('nama_kategori', 'ASC')->findAll(),
        ]);
    }

    public function show($id = null)
    {
        $data = (new KategoriModel())->find($id);
        if (!$data) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $payload = $this->payload();
        if (empty($payload['jenis']) || empty($payload['nama_kategori'])) {
            return $this->failValidationErrors('Jenis dan nama kategori wajib diisi.');
        }

        $model = new KategoriModel();
        $id = $model->insert([
            'jenis' => $payload['jenis'],
            'nama_kategori' => $payload['nama_kategori'],
            'slug_kategori' => $this->slug($payload['nama_kategori']),
            'deskripsi' => $payload['deskripsi'] ?? null,
        ]);

        return $this->respondCreated(['status' => 201, 'messages' => 'Kategori berhasil ditambahkan.', 'data' => $model->find($id)]);
    }

    public function update($id = null)
    {
        $model = new KategoriModel();
        $old = $model->find($id);
        if (!$old) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }

        $payload = $this->payload();
        $data = [
            'jenis' => $payload['jenis'] ?? $old['jenis'],
            'nama_kategori' => $payload['nama_kategori'] ?? $old['nama_kategori'],
            'deskripsi' => $payload['deskripsi'] ?? $old['deskripsi'],
        ];
        $data['slug_kategori'] = $this->slug($data['nama_kategori']);
        $model->update($id, $data);

        return $this->respond(['status' => 200, 'messages' => 'Kategori berhasil diperbarui.', 'data' => $model->find($id)]);
    }

    public function delete($id = null)
    {
        $model = new KategoriModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'messages' => 'Kategori berhasil dihapus.']);
    }
}
