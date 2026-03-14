<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index('price');
            $table->index('created_at');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('created_at');
            $table->index('order_number');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['product_id', 'approved']);
        });

        Schema::table('wishlist', function (Blueprint $table) {
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['price']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['order_number']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['product_id', 'approved']);
        });

        Schema::table('wishlist', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });
    }
};
