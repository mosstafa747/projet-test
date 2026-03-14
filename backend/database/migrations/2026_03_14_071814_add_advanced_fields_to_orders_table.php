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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('refund_amount', 10, 2)->nullable()->after('discount_amount');
            $table->text('refund_reason')->nullable()->after('refund_amount');
            $table->enum('refund_status', ['pending', 'processed', 'rejected'])->nullable()->after('refund_reason');
            $table->timestamp('confirmed_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['refund_amount', 'refund_reason', 'refund_status', 'confirmed_at']);
        });
    }
};
