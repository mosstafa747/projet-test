<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'subtotal', 'shipping_cost', 'total_price',
        'shipping_name', 'shipping_phone', 'shipping_address', 'shipping_city', 'shipping_country',
        'delivery_method', 'payment_method', 'status', 'coupon_code', 'discount_amount',
        'refund_amount', 'refund_reason', 'refund_status', 'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'total_price' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'refund_amount' => 'decimal:2',
            'confirmed_at' => 'datetime',
        ];
    }

    public static function generateOrderNumber(): string
    {
        return 'BA-' . strtoupper(uniqid()) . '-' . now()->format('Ymd');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
