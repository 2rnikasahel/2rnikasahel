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
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('name');
            $table->string('brand');
            $table->string('unit')->default('عدد'); // عدد, متر, شاخه, کیلوگرم, بسته, ست
            $table->decimal('price', 15, 2);
            $table->decimal('original_price', 15, 2)->nullable();
            $table->unsignedTinyInteger('discount')->default(0);
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->boolean('in_stock')->default(true);
            $table->unsignedInteger('stock_count')->default(0);
            $table->string('sku')->unique();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->json('features')->nullable();
            $table->json('specs')->nullable();
            $table->json('variations')->nullable();
            $table->string('warranty')->nullable();
            $table->string('shipping_time')->nullable();
            $table->json('tags')->nullable();
            $table->json('related_ids')->nullable();
            $table->enum('status', ['draft', 'published'])->default('published');
            $table->timestamps();
            
            $table->index(['status', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
