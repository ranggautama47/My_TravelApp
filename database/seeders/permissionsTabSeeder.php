<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class permissionsTabSeeder extends Seeder
{
    public function run(): void
    {
        // GANTI SEMUA Permission::create() MENJADI Permission::firstOrCreate()

        //permission users
        Permission::firstOrCreate(['name' => 'users index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'users create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'users edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'users delete', 'guard_name' => 'web']);

        //permission roles
        Permission::firstOrCreate(['name' => 'roles index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'roles create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'roles edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'roles delete', 'guard_name' => 'web']);

        //permission permissions
        Permission::firstOrCreate(['name' => 'permissions index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'permissions create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'permissions edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'permissions delete', 'guard_name' => 'web']);

        //permission categories
        Permission::firstOrCreate(['name' => 'categories index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'categories create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'categories edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'categories delete', 'guard_name' => 'web']);

        //permission locations
        Permission::firstOrCreate(['name' => 'locations index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'locations create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'locations edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'locations delete', 'guard_name' => 'web']);

        // permission reviews
        Permission::firstOrCreate(['name' => 'reviews index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'reviews create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'reviews edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'reviews delete', 'guard_name' => 'web']);

        // permission tickets
        Permission::firstOrCreate(['name' => 'tickets index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'tickets create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'tickets edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'tickets delete', 'guard_name' => 'web']);

        // permission transactions
        Permission::firstOrCreate(['name' => 'transactions index', 'guard_name' => 'web']);

        // permission regions
         Permission::firstOrCreate(['name' => 'regions index', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'regions create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'regions edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'regions delete', 'guard_name' => 'web']);

    }
}
