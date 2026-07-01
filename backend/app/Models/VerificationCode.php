<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'identifier',
        'code',
        'type',
        'expires_at',
        'attempts',
        'used',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    public static function generate($identifier, $type, $length = 5)
    {
        // Delete old unused codes
        static::where('identifier', $identifier)
            ->where('type', $type)
            ->where('used', false)
            ->delete();

        $code = str_pad(random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);

        return static::create([
            'identifier' => $identifier,
            'code' => $code,
            'type' => $type,
            'expires_at' => now()->addMinutes(5),
        ]);
    }

    public function isValid($code)
    {
        if ($this->code !== $code) {
            $this->increment('attempts');
            return false;
        }

        if ($this->expires_at->isPast()) {
            return false;
        }

        if ($this->used) {
            return false;
        }

        $this->update(['used' => true]);
        return true;
    }
}
