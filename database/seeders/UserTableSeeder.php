<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ Create user (atau ambil jika sudah ada)
        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'      => 'admin',
                'phone'     => '-',
                'password'  => bcrypt('password'),
            ]
        );

        // ✅ Get role admin
        $adminRole = Role::where('name', 'admin')->first();

        if ($adminRole) {
            // ✅ Assign role admin ke user
            $user->syncRoles([$adminRole]);

            $this->command->info('✅ User admin created with role: ' . $adminRole->name);
        } else {
            $this->command->error('❌ Admin role not found!');
        }
    }
}
