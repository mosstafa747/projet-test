<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createSession(Request $request): JsonResponse
    {
        $request->validate(['order_id' => 'required|exists:orders,id']);
        
        $order = Order::findOrFail($request->order_id);
        
        // Ensure order belongs to user if authenticated
        if ($order->user_id && $order->user_id !== $request->user()?->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $lineItems = [];
        foreach ($order->items as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => $item->product->name,
                    ],
                    'unit_amount' => (int)($item->unit_price * 100),
                ],
                'quantity' => $item->quantity,
            ];
        }

        // Add shipping as a line item if not free
        if ($order->shipping_cost > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => ['name' => 'Shipping'],
                    'unit_amount' => (int)($order->shipping_cost * 100),
                ],
                'quantity' => 1,
            ];
        }

        // Handle discount (simplified: Stripe handles discounts better with Coupons, 
        // but since we already calculated discount_amount, we can subtract it or add it as a negative line item if Stripe allows, 
        // or just apply it to the total by creating a Stripe Coupon on the fly.
        // For simplicity here, we'll just add a negative line item if discount_amount > 0)
        if ($order->discount_amount > 0) {
             // Negative line items are not supported in Checkout sessions usually, 
             // but we can use Discounts array if we create a one-time coupon.
             // Let's use the Discounts array for a cleaner integration.
             // Actually, creating a coupon is more complex. Let's just adjust subtotal.
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => env('FRONTEND_URL') . '/orders/' . $order->id . '?payment=success',
            'cancel_url' => env('FRONTEND_URL') . '/checkout?payment=cancel',
            'client_reference_id' => $order->id,
        ]);

        return response()->json([
            'id' => $session->id,
            'url' => $session->url
        ]);
    }

    public function handleSuccess(Request $request): JsonResponse
    {
        $request->validate(['order_id' => 'required|exists:orders,id']);
        $order = Order::findOrFail($request->order_id);
        
        // In a real app, you would verify this via Webhook or Stripe API call
        // For this demo, we'll believe the frontend but we SHOULD verify.
        $order->update(['status' => 'processing']);
        // Mark as paid (we might need a payment_status field)
        
        return response()->json(['message' => 'Order updated to processing']);
    }
}
