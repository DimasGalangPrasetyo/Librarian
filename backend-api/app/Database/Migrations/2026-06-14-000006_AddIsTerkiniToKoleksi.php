<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddIsTerkiniToKoleksi extends Migration
{
    public function up()
    {
        if (! $this->db->fieldExists('is_terkini', 'koleksi')) {
            $this->forge->addColumn('koleksi', [
                'is_terkini' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 0,
                    'after'      => 'cover_url',
                ],
            ]);
        }
    }

    public function down()
    {
        if ($this->db->fieldExists('is_terkini', 'koleksi')) {
            $this->forge->dropColumn('koleksi', 'is_terkini');
        }
    }
}
