<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateKoleksi extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'kategori_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'kode_koleksi' => ['type' => 'VARCHAR', 'constraint' => 40],
            'judul' => ['type' => 'VARCHAR', 'constraint' => 220],
            'jenis' => ['type' => 'ENUM', 'constraint' => ['umum', 'novel', 'komik'], 'default' => 'umum'],
            'penulis' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'penerbit' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'tahun_terbit' => ['type' => 'YEAR', 'null' => true],
            'isbn' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
            'sinopsis' => ['type' => 'TEXT', 'null' => true],
            'status_koleksi' => ['type' => 'ENUM', 'constraint' => ['tersedia', 'dipinjam', 'rusak', 'hilang'], 'default' => 'tersedia'],
            'cover_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'rak_lokasi' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['jenis', 'status_koleksi']);
        $this->forge->addForeignKey('kategori_id', 'kategori', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('koleksi', true);
    }

    public function down()
    {
        $this->forge->dropTable('koleksi', true);
    }
}
