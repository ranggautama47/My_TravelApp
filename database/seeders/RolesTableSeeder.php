<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $pengunjungRole = Role::firstOrCreate(['name' => 'pengunjung', 'guard_name' => 'web']);

        // ✅ Assign SEMUA permissions ke admin
        $adminRole->syncPermissions(Permission::all());

        // ✅ Assign permissions khusus ke pengunjung
        $pengunjungPermissions = [
            'reviews index',
            'transactions index'
        ];

        $pengunjungRole->syncPermissions($pengunjungPermissions);

        // Output untuk debugging
        $this->command->info('✅ Admin role: ' . $adminRole->permissions->count() . ' permissions');
        $this->command->info('✅ Pengunjung role: ' . $pengunjungRole->permissions->count() . ' permissions');
    }
}
