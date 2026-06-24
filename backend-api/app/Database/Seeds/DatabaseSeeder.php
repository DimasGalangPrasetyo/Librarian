<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call('UserSeeder');
        $this->call('KategoriSeeder');
        $this->call('KoleksiSeeder');
        $this->call('AnggotaSeeder');
        $this->call('PeminjamanSeeder');
    }
}
