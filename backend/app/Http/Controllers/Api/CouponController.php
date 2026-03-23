<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric'
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json(['message' => 'Invalid coupon code'], 400);
        }

        if (!$coupon->isValid()) {
            return response()->json(['message' => 'Coupon is expired or usage limit reached'], 400);
        }

        if ($coupon->min_order_value && $request->amount < $coupon->min_order_value) {
            return response()->json([
                'message' => "Order amount must be at least {$coupon->min_order_value} to use this coupon"
            ], 400);
        }

        return response()->json([
            'coupon' => $coupon,
            'message' => 'Coupon applied successfully'
        ]);
    }
}
