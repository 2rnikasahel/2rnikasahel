<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsProvider extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'display_name', 'credentials', 'is_active', 'priority'];

    protected $casts = [
        'credentials' => 'array',
        'is_active' => 'boolean',
    ];
}
