<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., kavenegar
            $table->string('display_name'); // e.g., کاوه نگار
            $table->json('credentials')->nullable(); // Stores API keys, usernames, etc.
            $table->boolean('is_active')->default(false);
            $table->integer('priority')->default(0); // For fallback/round-robin logic
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_providers');
    }
};
