<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'brand',
        'unit',
        'price',
        'original_price',
        'discount',
        'rating',
        'reviews_count',
        'in_stock',
        'stock_count',
        'sku',
        'short_description',
        'description',
        'images',
        'features',
        'specs',
        'variations',
        'warranty',
        'shipping_time',
        'tags',
        'related_ids',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'discount' => 'integer',
        'rating' => 'decimal:1',
        'reviews_count' => 'integer',
        'in_stock' => 'boolean',
        'stock_count' => 'integer',
        'images' => 'array',
        'features' => 'array',
        'specs' => 'array',
        'variations' => 'array',
        'tags' => 'array',
        'related_ids' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
