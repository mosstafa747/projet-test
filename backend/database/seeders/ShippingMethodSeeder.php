<?php

namespace Database\Seeders;

use App\Models\ShippingMethod;
use Illuminate\Database\Seeder;

class ShippingMethodSeeder extends Seeder
{
    public function run(): void
    {
        ShippingMethod::create([
            'id' => 1,
            'name' => 'Standard Delivery',
            'price' => 45,
            'estimated_days' => '3-5 business days',
            'is_active' => true,
        ]);
    }
}
