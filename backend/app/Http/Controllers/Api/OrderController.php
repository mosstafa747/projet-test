<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Orders", description="API Endpoints for Orders")
 */
class OrderController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/orders",
     *     tags={"Orders"},
     *     summary="Create a new order",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(type="object")),
     *     @OA\Response(response=201, description="Order created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'shipping_name' => ['required', 'string', 'max:255'],
            'shipping_phone' => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_country' => ['required', 'string', 'max:100'],
            'delivery_method' => ['required', 'exists:shipping_methods,id'],
            'payment_method' => ['required', 'in:cash,card,paypal'],
            'coupon_code' => ['nullable', 'string', 'exists:coupons,code'],
        ]);

        $subtotal = 0;
        $orderItems = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            if ($product->stock < $item['quantity']) {
                return response()->json(
                    ['message' => "Insufficient stock for {$product->name}"],
                    422
                );
            }
            $orderItems[] = [
                'product' => $product,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
            ];
            $subtotal += $product->price * $item['quantity'];
        }

        $shippingMethod = \App\Models\ShippingMethod::findOrFail($validated['delivery_method']);
        $shippingCost = $shippingMethod->price;

        $discountAmount = 0;
        $coupon = null;
        if ($validated['coupon_code'] ?? null) {
            $coupon = \App\Models\Coupon::where('code', $validated['coupon_code'])->first();
            if ($coupon && $coupon->isValid() && $subtotal >= $coupon->min_order_value) {
                if ($coupon->type === 'percentage') {
                    $discountAmount = ($subtotal * $coupon->value) / 100;
                } elseif ($coupon->type === 'fixed') {
                    $discountAmount = $coupon->value;
                } elseif ($coupon->type === 'free_shipping') {
                    $discountAmount = $shippingCost;
                    $shippingCost = 0;
                }
                $coupon->increment('usage_count');
            }
        }

        $totalPrice = max(0, $subtotal + $shippingCost - ($coupon && $coupon->type === 'free_shipping' ? 0 : $discountAmount));
        // Note: For consistency with frontend: Total = subtotal + shipping - discount.
        // If free_shipping, shipping is 0 and discount is the original shipping cost (for records), 
        // but we don't subtract it from subtotal.
        // If not free_shipping, we subtract discountAmount.
        // Actually, the previous calculation max(0, subtotal + shippingCost - discountAmount) was simpler 
        // but if shippingCost is set to 0, then we shouldn't subtract discountAmount again if it equals the old shippingCost.
        
        // Let's refine the total price calculation to be foolproof:
        if ($coupon && $coupon->type === 'free_shipping') {
            $totalPrice = $subtotal; // Shipping is free, no other discount applied by a free_shipping coupon
        } else {
            $totalPrice = max(0, $subtotal + $shippingCost - $discountAmount);
        }

        $order = Order::create([
            'user_id' => $request->user()?->id,
            'order_number' => Order::generateOrderNumber(),
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'discount_amount' => $discountAmount,
            'coupon_code' => $validated['coupon_code'] ?? null,
            'total_price' => $totalPrice,
            'shipping_name' => $validated['shipping_name'],
            'shipping_phone' => $validated['shipping_phone'],
            'shipping_address' => $validated['shipping_address'],
            'shipping_city' => $validated['shipping_city'],
            'shipping_country' => $validated['shipping_country'],
            'delivery_method' => $validated['delivery_method'],
            'payment_method' => $validated['payment_method'],
        ]);

        foreach ($orderItems as $oi) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $oi['product']->id,
                'quantity' => $oi['quantity'],
                'unit_price' => $oi['unit_price'],
            ]);
            $oi['product']->decrement('stock', $oi['quantity']);
            $oi['product']->increment('sales_count', $oi['quantity']);
        }

        $order->load('items.product');

        \App\Jobs\SendOrderConfirmation::dispatch($order);
        \App\Services\AuditLogger::log('order_created', $order);

        return response()->json($order, 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id && $order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $order->load('items.product');
        return response()->json($order);
    }
}
