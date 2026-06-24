<?php

namespace App\Filters;

use App\Models\UserModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class ApiAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader) {
            $authHeader = (string) $request->getServer('HTTP_AUTHORIZATION');
        }

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return Services::response()
                ->setStatusCode(401)
                ->setJSON([
                    'status' => 401,
                    'error' => 401,
                    'messages' => 'Akses ditolak. Token tidak ditemukan pada request.',
                ]);
        }

        $token = $matches[1];
        $user = (new UserModel())->where('token', $token)->first();

        if (!$user) {
            return Services::response()
                ->setStatusCode(401)
                ->setJSON([
                    'status' => 401,
                    'error' => 401,
                    'messages' => 'Sesi token tidak valid atau sudah kedaluwarsa.',
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak diperlukan aksi setelah request diproses.
    }
}
