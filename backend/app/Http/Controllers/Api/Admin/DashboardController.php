<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalSales = Order::where('status', 'delivered')->sum('total_price');
        $totalOrders = Order::where('status', 'delivered')->count();
        $totalCustomers = User::where('is_admin', false)->count();
        $avgOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        $recentOrders = Order::with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get();

        $topProducts = Product::orderByDesc('sales_count')
            ->take(5)
            ->get();

        // Generate full 7-day history with zeros
        $history = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $history->put($date, ['date' => $date, 'total' => 0]);
        }

        $salesData = Order::where('status', 'delivered')
            ->where('created_at', '>=', now()->subDays(7)->startOfDay())
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total'))
            ->groupBy('date')
            ->get();

        foreach ($salesData as $item) {
            if ($history->has($item->date)) {
                $history->put($item->date, [
                    'date' => $item->date,
                    'total' => (float)$item->total
                ]);
            }
        }
        $salesHistory = $history->values();

        return response()->json([
            'total_sales' => round($totalSales, 2),
            'total_orders' => $totalOrders,
            'total_customers' => $totalCustomers,
            'average_order_value' => round($avgOrderValue, 2),
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
            'sales_history' => $salesHistory
        ]);
    }
}
