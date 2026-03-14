<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('furniture_type')->nullable();
            $table->string('budget')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_requests');
    }
};
