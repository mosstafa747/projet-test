<?php

namespace Database\Seeders;

use App\Models\ShippingMethod;
use Illuminate\Database\Seeder;

class ShippingMethodSeeder extends Seeder
{
    public function run(): void
    {
        ShippingMethod::create([
            'name' => 'Standard Delivery',
            'price' => 15,
            'estimated_days' => '5-7 business days',
            'is_active' => true,
        ]);

        ShippingMethod::create([
            'name' => 'Express Delivery',
            'price' => 25,
            'estimated_days' => '2-3 business days',
            'is_active' => true,
        ]);
    }
}
