<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Data Cleanup: Slugify existing products.category strings
        $products = \App\Models\Product::all();
        foreach ($products as $product) {
            $product->category = \Illuminate\Support\Str::slug($product->category);
            $product->save();
        }

        // 2. Add FullText index for optimized search
        Schema::table('products', function (Blueprint $table) {
            $table->fullText(['name', 'materials', 'category', 'description'], 'products_search_fulltext');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropFullText('products_search_fulltext');
        });
    }
};
