<?php

$product = \App\Models\Product::create([
    'name' => 'Beldi Variant Chair',
    'price' => 1200,
    'category' => 'seating',
    'stock' => 10,
    'sku' => 'CH-BELDI-001',
    'description' => 'A beautifully crafted chair with variants.'
]);

$product->variants()->createMany([
    [
        'name' => 'Light Walnut / Beige Fabric',
        'price_modifier' => 0,
        'stock' => 5,
        'sku' => 'CH-BELDI-001-LW',
        'options' => ['Color' => 'Light Walnut', 'Fabric' => 'Beige']
    ],
    [
        'name' => 'Dark Oak / Green Leather',
        'price_modifier' => 450,
        'stock' => 2,
        'sku' => 'CH-BELDI-001-DO',
        'options' => ['Color' => 'Dark Oak', 'Fabric' => 'Green Leather']
    ]
]);

$loaded = $product->load('variants');
echo json_encode($loaded, JSON_PRETTY_PRINT);
