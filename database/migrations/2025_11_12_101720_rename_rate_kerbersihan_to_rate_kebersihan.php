<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Cek apakah kolom rate_kerbersihan ada
        if (Schema::hasColumn('reviews', 'rate_kerbersihan')) {
            // Jika ada, rename
            Schema::table('reviews', function (Blueprint $table) {
                $table->renameColumn('rate_kerbersihan', 'rate_kebersihan');
            });
        } else {
            // Jika tidak ada, cek apakah rate_kebersihan sudah ada
            if (!Schema::hasColumn('reviews', 'rate_kebersihan')) {
                // Jika belum ada, tambahkan kolom baru
                Schema::table('reviews', function (Blueprint $table) {
                    $table->integer('rate_kebersihan')->default(5)->after('review');
                });
            }
            // Jika sudah ada rate_kebersihan, skip (migration sudah pernah jalan)
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('reviews', 'rate_kebersihan')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->renameColumn('rate_kebersihan', 'rate_kerbersihan');
            });
        }
    }
};
