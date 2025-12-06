<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Rename kolom yang typo
            $table->renameColumn('rate_kerbersihan', 'rate_kebersihan');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->renameColumn('rate_kebersihan', 'rate_kerbersihan');
        });
    }
};
