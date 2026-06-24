<?php

namespace App\Controllers\Api;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
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

    private function bearerToken(): ?string
    {
        $header = $this->request->getHeaderLine('Authorization') ?: (string) $this->request->getServer('HTTP_AUTHORIZATION');
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }

    public function login()
    {
        $data = $this->payload();
        $username = trim((string) ($data['username'] ?? $data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if ($username === '' || $password === '') {
            return $this->failValidationErrors('Username/email dan password wajib diisi.');
        }

        $model = new UserModel();
        $user = $model->groupStart()
            ->where('username', $username)
            ->orWhere('useremail', $username)
            ->groupEnd()
            ->first();

        if (!$user || !password_verify($password, $user['userpassword'])) {
            return $this->failUnauthorized('Username/email atau password salah.');
        }

        $token = bin2hex(random_bytes(32));
        $model->update($user['id'], [
            'token' => $token,
            'last_login_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->respond([
            'status' => 200,
            'error' => null,
            'messages' => 'Login berhasil.',
            'data' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'email' => $user['useremail'],
                'token' => $token,
            ],
        ]);
    }

    public function logout()
    {
        $token = $this->bearerToken();
        if ($token) {
            (new UserModel())->where('token', $token)->set(['token' => null])->update();
        }

        return $this->respond([
            'status' => 200,
            'messages' => 'Logout berhasil.',
        ]);
    }
}
