<?php

namespace App\Controllers\Api;

use App\Models\AnggotaModel;
use CodeIgniter\RESTful\ResourceController;

class Anggota extends ResourceController
{
    protected $format = 'json';
    private function payload(): array
    {
        $json = $this->request->getJSON(true);
        if (is_array($json)) { return $json; }
        $raw = $this->request->getRawInput();
        if (!empty($raw)) { return $raw; }
        return $this->request->getPost();
    }

    public function index()
    {
        $q = $this->request->getGet('q');
        $status = $this->request->getGet('status');
        $model = new AnggotaModel();
        if ($q) {
            $model->groupStart()
                ->like('nama', $q)
                ->orLike('kode_anggota', $q)
                ->orLike('email', $q)
                ->groupEnd();
        }
        if ($status) { $model->where('status_anggota', $status); }
        return $this->respond(['status' => 200, 'data' => $model->orderBy('id', 'DESC')->findAll()]);
    }

    public function show($id = null)
    {
        $data = (new AnggotaModel())->find($id);
        if (!$data) { return $this->failNotFound('Anggota tidak ditemukan.'); }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $payload = $this->payload();
        if (empty($payload['nama'])) { return $this->failValidationErrors('Nama anggota wajib diisi.'); }
        $model = new AnggotaModel();
        $id = $model->insert([
            'kode_anggota' => $payload['kode_anggota'] ?? 'AG-' . date('His'),
            'nama' => $payload['nama'],
            'email' => $payload['email'] ?? null,
            'no_hp' => $payload['no_hp'] ?? null,
            'alamat' => $payload['alamat'] ?? null,
            'status_anggota' => $payload['status_anggota'] ?? 'aktif',
        ]);
        return $this->respondCreated(['status' => 201, 'messages' => 'Anggota berhasil ditambahkan.', 'data' => $model->find($id)]);
    }

    public function update($id = null)
    {
        $model = new AnggotaModel();
        if (!$model->find($id)) { return $this->failNotFound('Anggota tidak ditemukan.'); }
        $payload = $this->payload();
        $data = [];
        foreach (['kode_anggota','nama','email','no_hp','alamat','status_anggota'] as $field) {
            if (array_key_exists($field, $payload)) { $data[$field] = $payload[$field]; }
        }
        $model->update($id, $data);
        return $this->respond(['status' => 200, 'messages' => 'Anggota berhasil diperbarui.', 'data' => $model->find($id)]);
    }

    public function delete($id = null)
    {
        $model = new AnggotaModel();
        if (!$model->find($id)) { return $this->failNotFound('Anggota tidak ditemukan.'); }
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'messages' => 'Anggota berhasil dihapus.']);
    }
}
