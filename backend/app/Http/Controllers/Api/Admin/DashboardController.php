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
        $totalSales = Order::where('status', '!=', 'cancelled')->sum('total_price');
        $totalOrders = Order::count();
        $totalCustomers = User::where('is_admin', false)->count();
        $avgOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        $recentOrders = Order::with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get();

        $topProducts = Product::orderByDesc('sales_count')
            ->take(5)
            ->get();

        // Simple weekly sales history
        $salesHistory = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', now()->subDays(7))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total'))
            ->groupBy('date')
            ->get();

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
