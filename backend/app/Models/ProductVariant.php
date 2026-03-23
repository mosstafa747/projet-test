<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'name', 'options', 'price_modifier', 'stock', 'sku'
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'price_modifier' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
