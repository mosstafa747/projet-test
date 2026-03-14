<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Moroccan Cedar Side Table', 'price' => 2450, 'description' => 'Hand-carved cedar side table with traditional geometric motifs.', 'category' => 'living_room', 'stock' => 5, 'materials' => 'Cedar wood', 'dimensions' => '45cm x 45cm x 55cm'],
            ['name' => 'Beldi Dining Table', 'price' => 8900, 'description' => 'Large dining table in solid wood with metal inlay.', 'category' => 'dining_room', 'stock' => 2, 'materials' => 'Oak, forged iron', 'dimensions' => '200cm x 90cm x 76cm'],
            ['name' => 'Zellige Console', 'price' => 3200, 'description' => 'Console with zellige-inspired tile inlay.', 'category' => 'living_room', 'stock' => 4, 'materials' => 'Wood, ceramic tiles', 'dimensions' => '120cm x 40cm x 85cm'],
            ['name' => 'Artisan Bed Frame', 'price' => 12500, 'description' => 'King-size bed frame with hand-forged headboard.', 'category' => 'bedroom', 'stock' => 3, 'materials' => 'Cedar, iron', 'dimensions' => '180cm x 200cm'],
            ['name' => 'Marrakech Pendant Lamp', 'price' => 680, 'description' => 'Handcrafted metal pendant lamp.', 'category' => 'decor', 'stock' => 15, 'materials' => 'Brass', 'dimensions' => '30cm diameter'],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, ['images' => []]));
        }
    }
}
