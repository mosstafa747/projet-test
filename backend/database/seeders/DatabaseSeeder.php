<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@beldi.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        $this->call([
            ProductSeeder::class, 
            TestimonialSeeder::class,
            ShippingMethodSeeder::class
        ]);
    }
}
