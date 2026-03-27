<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    /**
     * This controller formerly handled PayPal and Stripe.
     * All online payment methods have been removed as per user request.
     * Only Cash on Delivery is currently supported.
     */

    public function handleSuccess(Request $request): JsonResponse
    {
        $request->validate(['order_id' => 'required|exists:orders,id']);
        $order = Order::findOrFail($request->order_id);
        
        // This endpoint could be used for after-the-fact confirmation if needed.
        $order->update(['status' => 'processing']);
        
        return response()->json(['message' => 'Order updated to processing']);
    }
}
