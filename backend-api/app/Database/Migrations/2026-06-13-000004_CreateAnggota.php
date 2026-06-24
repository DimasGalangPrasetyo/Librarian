<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAnggota extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'kode_anggota' => ['type' => 'VARCHAR', 'constraint' => 40],
            'nama' => ['type' => 'VARCHAR', 'constraint' => 150],
            'email' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'no_hp' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
            'alamat' => ['type' => 'TEXT', 'null' => true],
            'status_anggota' => ['type' => 'ENUM', 'constraint' => ['aktif', 'nonaktif'], 'default' => 'aktif'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('kode_anggota');
        $this->forge->createTable('anggota', true);
    }

    public function down()
    {
        $this->forge->dropTable('anggota', true);
    }
}
