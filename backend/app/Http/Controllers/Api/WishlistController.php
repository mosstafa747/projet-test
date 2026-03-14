<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = $request->user()->wishlist()->paginate(12);
        return response()->json($products);
    }

    public function toggle(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        $attached = $user->wishlist()->toggle($product->id);

        $inWishlist = $user->wishlist()->where('product_id', $product->id)->exists();

        return response()->json(['in_wishlist' => $inWishlist]);
    }
}
