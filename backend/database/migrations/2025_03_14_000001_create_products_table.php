<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->string('category'); // living_room, dining_room, bedroom, decor
            $table->json('images')->nullable(); // array of image URLs
            $table->unsignedInteger('stock')->default(0);
            $table->string('materials')->nullable();
            $table->string('dimensions')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('sales_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
