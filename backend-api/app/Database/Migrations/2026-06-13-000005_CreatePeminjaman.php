<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePeminjaman extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'kode_pinjam' => ['type' => 'VARCHAR', 'constraint' => 40],
            'koleksi_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'anggota_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'tanggal_pinjam' => ['type' => 'DATE'],
            'tanggal_jatuh_tempo' => ['type' => 'DATE'],
            'tanggal_kembali' => ['type' => 'DATE', 'null' => true],
            'status_peminjaman' => ['type' => 'ENUM', 'constraint' => ['aktif', 'dikembalikan', 'terlambat'], 'default' => 'aktif'],
            'catatan' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['status_peminjaman', 'tanggal_jatuh_tempo']);
        $this->forge->addForeignKey('koleksi_id', 'koleksi', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('anggota_id', 'anggota', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('peminjaman', true);
    }

    public function down()
    {
        $this->forge->dropTable('peminjaman', true);
    }
}
