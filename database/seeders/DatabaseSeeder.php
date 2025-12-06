<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🧹 Bersihkan folder kategori lama setiap seed ulang
    Storage::disk('public')->deleteDirectory('categories');
    Storage::disk('public')->makeDirectory('categories');

        // URUTAN YANG BENAR:
        $this->call([
            permissionsTabSeeder::class,  // 1. Buat permissions dulu
            RolesTableSeeder::class,       // 2. Buat roles & assign permissions
            UserTableSeeder::class,        // 3. Buat user & assign role
        ]);
    }
}
