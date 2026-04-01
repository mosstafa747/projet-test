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
            ->whereIn('status', ['assigned', 'accepted', 'picked_up', 'shipped', 'on_the_way'])
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
            'status' => 'required|in:accepted,rejected,picked_up,on_the_way,shipped,delivered,refused',
            'failed_reason' => 'nullable|string|max:500',
            'driver_comment' => 'nullable|string|max:500',
            'payment_received' => 'nullable|boolean',
        ]);

        $status = $request->status;
        $updateData = [];

        if ($status === 'rejected') {
            $order->update([
                'status' => 'confirmed',
                'driver_id' => null,
            ]);
            return response()->json(['message' => 'Rejected']);
        } elseif ($status === 'accepted') {
            $updateData = ['status' => 'accepted'];
        } elseif ($status === 'picked_up') {
            $updateData = ['status' => 'picked_up'];
        } elseif ($status === 'shipped' || $status === 'on_the_way') {
            $updateData = [
                'status' => 'shipped', // use shipped to maintain sync with generic frontend logic
                'shipped_at' => now(),
            ];
        } elseif ($status === 'delivered') {
            $updateData = [
                'status' => 'delivered',
                'delivered_at' => now(),
                'payment_status' => $request->payment_received ? 'paid' : 'unpaid',
                'driver_comment' => $request->driver_comment,
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
                'failed_reason' => $request->failed_reason,
                'driver_comment' => $request->driver_comment,
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
