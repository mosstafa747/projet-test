<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductVariantTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_product_with_variants()
    {
        $product = Product::create([
            'name' => 'Beldi Chair',
            'price' => 1200,
            'category' => 'seating',
            'stock' => 10,
            'sku' => 'CH-BELDI-001'
        ]);

        $product->variants()->create([
            'name' => 'Red Leather',
            'price_modifier' => 500,
            'stock' => 5,
            'sku' => 'CH-BELDI-001-RED',
            'options' => ['Color' => 'Red', 'Material' => 'Leather']
        ]);

        $product->variants()->create([
            'name' => 'Black Fabric',
            'price_modifier' => 0,
            'stock' => 5,
            'sku' => 'CH-BELDI-001-BLK',
            'options' => ['Color' => 'Black', 'Material' => 'Fabric']
        ]);

        $this->assertDatabaseHas('products', [
            'sku' => 'CH-BELDI-001'
        ]);

        $this->assertDatabaseHas('product_variants', [
            'name' => 'Red Leather',
            'sku' => 'CH-BELDI-001-RED'
        ]);

        $this->assertCount(2, $product->variants);
    }
}
