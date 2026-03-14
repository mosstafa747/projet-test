<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Coupon::orderByDesc('created_at')->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:coupons,code'],
            'type' => ['required', 'in:percentage,fixed,free_shipping'],
            'value' => ['required', 'numeric', 'min:0'],
            'expiry_date' => ['nullable', 'date'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'min_order_value' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $coupon = Coupon::create($validated);
        \App\Services\AuditLogger::log('coupon_created', $coupon, $validated);
        return response()->json($coupon, 201);
    }

    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:coupons,code,' . $coupon->id],
            'type' => ['required', 'in:percentage,fixed,free_shipping'],
            'value' => ['required', 'numeric', 'min:0'],
            'expiry_date' => ['nullable', 'date'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'min_order_value' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $coupon->update($validated);
        \App\Services\AuditLogger::log('coupon_updated', $coupon, $validated);
        return response()->json($coupon);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        \App\Services\AuditLogger::log('coupon_deleted', $coupon);
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted']);
    }
}
