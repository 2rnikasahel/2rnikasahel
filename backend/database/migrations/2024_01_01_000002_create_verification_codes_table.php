<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verification_codes', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->index(); // phone or email
            $table->string('code');
            $table->enum('type', ['sms', 'email']);
            $table->timestamp('expires_at');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->boolean('used')->default(false);
            $table->timestamps();
            
            $table->index(['identifier', 'type', 'used']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_codes');
    }
};
