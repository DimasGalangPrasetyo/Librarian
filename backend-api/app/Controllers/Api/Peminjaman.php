<?php

namespace App\Controllers\Api;

use App\Models\KoleksiModel;
use App\Models\PeminjamanModel;
use CodeIgniter\RESTful\ResourceController;

class Peminjaman extends ResourceController
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

    private function withRelations(?int $id = null)
    {
        $model = new PeminjamanModel();
        $builder = $model->select('peminjaman.*, koleksi.judul, koleksi.kode_koleksi, koleksi.jenis, anggota.nama AS nama_anggota, anggota.kode_anggota')
            ->join('koleksi', 'koleksi.id = peminjaman.koleksi_id')
            ->join('anggota', 'anggota.id = peminjaman.anggota_id');
        if ($id) { $builder->where('peminjaman.id', $id); }
        return $builder;
    }

    public function index()
    {
        $status = $this->request->getGet('status');
        $q = $this->request->getGet('q');
        $builder = $this->withRelations();
        if ($status) { $builder->where('peminjaman.status_peminjaman', $status); }
        if ($q) {
            $builder->groupStart()
                ->like('peminjaman.kode_pinjam', $q)
                ->orLike('koleksi.judul', $q)
                ->orLike('anggota.nama', $q)
                ->groupEnd();
        }
        $data = $builder->orderBy('peminjaman.id', 'DESC')->findAll();
        $today = date('Y-m-d');
        foreach ($data as &$row) {
            if ($row['status_peminjaman'] === 'aktif' && $row['tanggal_jatuh_tempo'] < $today) {
                $row['status_efektif'] = 'terlambat';
            } else {
                $row['status_efektif'] = $row['status_peminjaman'];
            }
        }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function show($id = null)
    {
        $data = $this->withRelations((int) $id)->first();
        if (!$data) { return $this->failNotFound('Data peminjaman tidak ditemukan.'); }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $payload = $this->payload();
        foreach (['koleksi_id', 'anggota_id', 'tanggal_pinjam', 'tanggal_jatuh_tempo'] as $field) {
            if (empty($payload[$field])) { return $this->failValidationErrors('Koleksi, anggota, tanggal pinjam, dan jatuh tempo wajib diisi.'); }
        }

        $koleksiModel = new KoleksiModel();
        $koleksi = $koleksiModel->find($payload['koleksi_id']);
        if (!$koleksi) { return $this->failValidationErrors('Koleksi tidak ditemukan.'); }
        if ($koleksi['status_koleksi'] !== 'tersedia') {
            return $this->failValidationErrors('Koleksi tidak tersedia untuk dipinjam.');
        }

        $model = new PeminjamanModel();
        $id = $model->insert([
            'kode_pinjam' => $payload['kode_pinjam'] ?? 'PJ-' . date('His'),
            'koleksi_id' => $payload['koleksi_id'],
            'anggota_id' => $payload['anggota_id'],
            'tanggal_pinjam' => $payload['tanggal_pinjam'],
            'tanggal_jatuh_tempo' => $payload['tanggal_jatuh_tempo'],
            'tanggal_kembali' => $payload['tanggal_kembali'] ?? null,
            'status_peminjaman' => $payload['status_peminjaman'] ?? 'aktif',
            'catatan' => $payload['catatan'] ?? null,
        ]);

        $koleksiModel->update($payload['koleksi_id'], ['status_koleksi' => 'dipinjam']);
        return $this->respondCreated(['status' => 201, 'messages' => 'Peminjaman berhasil dibuat.', 'data' => $this->withRelations((int) $id)->first()]);
    }

    public function update($id = null)
    {
        $model = new PeminjamanModel();
        $old = $model->find($id);
        if (!$old) { return $this->failNotFound('Data peminjaman tidak ditemukan.'); }

        $payload = $this->payload();
        $data = [];
        foreach (['kode_pinjam','koleksi_id','anggota_id','tanggal_pinjam','tanggal_jatuh_tempo','tanggal_kembali','status_peminjaman','catatan'] as $field) {
            if (array_key_exists($field, $payload)) { $data[$field] = $payload[$field]; }
        }

        if (($data['status_peminjaman'] ?? '') === 'dikembalikan' && empty($data['tanggal_kembali'])) {
            $data['tanggal_kembali'] = date('Y-m-d');
        }

        $model->update($id, $data);
        $new = $model->find($id);
        $koleksiModel = new KoleksiModel();
        if ($new['status_peminjaman'] === 'dikembalikan') {
            $koleksiModel->update($new['koleksi_id'], ['status_koleksi' => 'tersedia']);
        } elseif (in_array($new['status_peminjaman'], ['aktif', 'terlambat'], true)) {
            $koleksiModel->update($new['koleksi_id'], ['status_koleksi' => 'dipinjam']);
        }

        return $this->respond(['status' => 200, 'messages' => 'Peminjaman berhasil diperbarui.', 'data' => $this->withRelations((int) $id)->first()]);
    }

    public function delete($id = null)
    {
        $model = new PeminjamanModel();
        $old = $model->find($id);
        if (!$old) { return $this->failNotFound('Data peminjaman tidak ditemukan.'); }
        $model->delete($id);
        if (in_array($old['status_peminjaman'], ['aktif', 'terlambat'], true)) {
            (new KoleksiModel())->update($old['koleksi_id'], ['status_koleksi' => 'tersedia']);
        }
        return $this->respondDeleted(['status' => 200, 'messages' => 'Peminjaman berhasil dihapus.']);
    }
}
