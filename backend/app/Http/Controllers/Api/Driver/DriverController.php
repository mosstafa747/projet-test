<?php

namespace App\Http\Controllers\Api\Driver;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DriverController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::where('driver_id', Auth::id())
            ->whereIn('status', ['assigned', 'shipped'])
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function history(): JsonResponse
    {
        $orders = Order::where('driver_id', Auth::id())
            ->whereIn('status', ['delivered', 'cancelled'])
            ->with('items.product')
            ->latest()
            ->take(20)
            ->get();

        return response()->json($orders);
    }

    public function updateStatus(Order $order, Request $request): JsonResponse
    {
        if ($order->driver_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:shipped,delivered,refused',
        ]);

        $status = $request->status;
        $updateData = [];

        if ($status === 'shipped') {
            $updateData = [
                'status' => 'shipped',
                'shipped_at' => now(),
            ];
        } elseif ($status === 'delivered') {
            $updateData = [
                'status' => 'delivered',
                'delivered_at' => now(),
                'payment_status' => 'paid',
            ];

            foreach ($order->items as $item) {
                if ($p = $item->product) {
                    $p->increment('sales_count', $item->quantity);
                }
            }
        } elseif ($status === 'refused') {
            $updateData = [
                'status' => 'cancelled', // Refused maps to cancelled for inventory logic
                'cancelled_at' => now(),
            ];
            
            // Restore inventory to ensure no leak on refusal
            foreach ($order->items as $item) {
                $product = $item->product;
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }
        }

        $order->update($updateData);

        return response()->json($order);
    }
}
