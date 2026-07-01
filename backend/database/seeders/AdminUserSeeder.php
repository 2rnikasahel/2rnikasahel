<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'uuid' => Str::uuid(),
            'name' => 'Super Admin',
            'email' => env('PRIMARY_ADMIN_EMAIL', 'admin@dornika.com'),
            'phone' => env('PRIMARY_ADMIN_PHONE', '09123456789'),
            'password' => Hash::make(env('PRIMARY_ADMIN_PASSWORD', 'ChangeMeNow123!')),
            'role' => 'super_admin',
            'is_verified' => true,
            'birth_date' => now()->subYears(30),
        ]);
    }
}
