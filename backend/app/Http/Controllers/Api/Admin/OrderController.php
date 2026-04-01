<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\AuditLogger;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with('user:id,name,email', 'items.product')
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate(20);
        return response()->json($orders);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled,returned'],
        ]);
        $order->update($validated);
        AuditLogger::log('order_status_updated', $order, $validated);
        return response()->json($order->load('items.product'));
    }

    public function confirm(Order $order): JsonResponse
    {
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be confirmed.'], 422);
        }

        $order->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        AuditLogger::log('order_confirmed', $order);
        return response()->json($order->load('items.product'));
    }

    public function cancel(Order $order): JsonResponse
    {
        if (in_array($order->status, ['delivered', 'cancelled', 'returned'])) {
            return response()->json(['message' => "Orders with status '{$order->status}' cannot be cancelled."], 422);
        }

        // Restore inventory
        foreach ($order->items as $item) {
            $product = $item->product;
            if ($product) {
                $product->increment('stock', $item->quantity);
            }
        }

        $order->update(['status' => 'cancelled']);

        AuditLogger::log('order_cancelled', $order);
        return response()->json($order->load('items.product'));
    }

    public function refund(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01', 'max:' . $order->total_price],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        // Restore inventory for returned items
        foreach ($order->items as $item) {
            $product = $item->product;
            if ($product) {
                $product->increment('stock', $item->quantity);
            }
        }

        $order->update([
            'refund_amount' => $validated['amount'],
            'refund_reason' => $validated['reason'],
            'refund_status' => 'processed',
            'status' => 'returned'
        ]);

        AuditLogger::log('order_refunded', $order, $validated);
        return response()->json($order->load('items.product'));
    }

    public function deliver(Order $order): JsonResponse
    {
        if (!in_array($order->status, ['shipped', 'picked_up', 'on_the_way', 'assigned'])) {
            return response()->json(['message' => 'Order must be in delivery to be marked as delivered.'], 422);
        }

        $order->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        AuditLogger::log('order_delivered', $order);
        return response()->json($order->load('items.product'));
    }

    public function complete(Order $order): JsonResponse
    {
        if ($order->status !== 'delivered') {
            return response()->json(['message' => 'Only delivered orders can be completed.'], 422);
        }

        $order->update([
            'status' => 'completed',
            'completed_at' => now(),
            'payment_status' => 'paid',
        ]);

        AuditLogger::log('order_completed', $order);
        return response()->json($order->load('items.product'));
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $orders = Order::with('user:id,name,email')->latest()->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders_export_' . now()->format('Y-m-d_H-i-s') . '.csv"',
        ];

        return response()->stream(function () use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Order ID', 'Order Number', 'Date', 'Customer', 'Email', 'Total Price', 'Status', 'Shipping City', 'Payment Status']);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->order_number,
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->user?->name ?? 'Guest',
                    $order->user?->email ?? $order->shipping_email ?? 'N/A',
                    $order->total_price,
                    strtoupper($order->status),
                    $order->shipping_city,
                    $order->payment_status ?? 'N/A'
                ]);
            }
            fclose($file);
        }, 200, $headers);
    }
}
