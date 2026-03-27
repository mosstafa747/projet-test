<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->boolean('is_driver')->default(false)->after('is_admin');
        });

        Schema::table('orders', function (Blueprint $blueprint) {
            $blueprint->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete();
            $blueprint->enum('payment_status', ['unpaid', 'paid'])->default('unpaid')->after('payment_method');
            $blueprint->timestamp('shipped_at')->nullable();
            $blueprint->timestamp('delivered_at')->nullable();
            $blueprint->timestamp('cancelled_at')->nullable();
            // Note: status is usually a string or enum, we'll ensure validation handles the new states:
            // pending, confirmed, assigned, shipped, delivered, cancelled
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn('is_driver');
        });

        Schema::table('orders', function (Blueprint $blueprint) {
            $blueprint->dropForeign(['driver_id']);
            $blueprint->dropColumn(['driver_id', 'payment_status', 'shipped_at', 'delivered_at', 'cancelled_at']);
        });
    }
};
