<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateKategori extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'jenis' => ['type' => 'ENUM', 'constraint' => ['umum', 'novel', 'komik'], 'default' => 'umum'],
            'nama_kategori' => ['type' => 'VARCHAR', 'constraint' => 120],
            'slug_kategori' => ['type' => 'VARCHAR', 'constraint' => 150],
            'deskripsi' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['jenis', 'slug_kategori']);
        $this->forge->createTable('kategori', true);
    }

    public function down()
    {
        $this->forge->dropTable('kategori', true);
    }
}
