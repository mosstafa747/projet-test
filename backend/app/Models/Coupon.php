<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'expiry_date', 'usage_limit', 
        'usage_count', 'min_order_value', 'is_active'
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'datetime',
            'is_active' => 'boolean',
            'value' => 'float',
            'min_order_value' => 'float',
        ];
    }

    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->expiry_date && $this->expiry_date->isPast()) return false;
        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) return false;
        return true;
    }}
