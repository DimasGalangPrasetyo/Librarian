<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Home extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 200,
            'message' => 'Librarian REST API Server aktif.',
            'project' => 'Librarian - Sistem Informasi Rental Buku dan Komik Digital',
            'endpoints' => [
                'login' => '/api/login',
                'public_dashboard' => '/api/public/dashboard',
                'public_koleksi' => '/api/public/koleksi',
                'admin_dashboard' => '/api/dashboard',
            ],
        ]);
    }
}
