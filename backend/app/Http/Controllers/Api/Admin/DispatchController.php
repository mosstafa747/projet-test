<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DispatchController extends Controller
{
    public function confirm(Order $order): JsonResponse
    {
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order is not in pending status'], 422);
        }

        $order->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        return response()->json($order);
    }

    public function assignDriver(Order $order, Request $request): JsonResponse
    {
        $request->validate([
            'driver_id' => 'required|exists:users,id',
        ]);

        $driver = User::findOrFail($request->driver_id);
        if (!$driver->is_driver) {
            return response()->json(['message' => 'User is not a driver'], 422);
        }

        $order->update([
            'status' => 'assigned',
            'driver_id' => $driver->id,
        ]);

        return response()->json($order->load('user', 'items.product'));
    }

    public function startDelivery(Order $order): JsonResponse
    {
        if ($order->status !== 'assigned') {
            return response()->json(['message' => 'Order must be assigned to start delivery.'], 422);
        }

        $order->update([
            'status' => 'shipped',
            'shipped_at' => now(),
        ]);

        return response()->json($order->load('user', 'items.product'));
    }

    public function driverStats(): JsonResponse
    {
        $drivers = User::where('is_driver', true)->get();
        
        $stats = $drivers->map(function ($driver) {
            $collectedCash = Order::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->where('payment_status', 'paid')
                ->where('is_cash_settled', false)
                ->sum('total_price');
            
            return [
                'id' => $driver->id,
                'name' => $driver->name,
                'email' => $driver->email,
                'collected_cash' => $collectedCash,
                'active_orders_count' => Order::where('driver_id', $driver->id)
                    ->whereIn('status', ['assigned', 'shipped'])
                    ->count(),
            ];
        });

        return response()->json($stats);
    }

    public function settle(User $user): JsonResponse
    {
        if (!$user->is_driver) {
            return response()->json(['message' => 'User is not a driver'], 422);
        }

        Order::where('driver_id', $user->id)
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->where('is_cash_settled', false)
            ->update(['is_cash_settled' => true]);

        return response()->json(['message' => 'Cash settled successfully']);
    }
}
