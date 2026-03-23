<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Products", description="API Endpoints for Products")
 */
class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/products",
     *     tags={"Products"},
     *     summary="List all products",
     *     @OA\Parameter(name="q", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="category", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'products_index_' . md5(json_encode($request->all()));
        
        $products = \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function() use ($request) {
            $query = Product::with('variants');

            if ($request->has('q') && $request->q) {
                $q = $request->q;
                $query->where(function($query) use ($q) {
                    $query->where('name', 'like', "%{$q}%")
                          ->orWhere('materials', 'like', "%{$q}%")
                          ->orWhere('category', 'like', "%{$q}%")
                          ->orWhere('description', 'like', "%{$q}%");
                });
            }

            if ($request->has('category') && $request->category) {
                $query->where('category', $request->category);
            }

            if ($request->has('materials') && $request->materials) {
                $mats = is_array($request->materials) ? $request->materials : explode(',', $request->materials);
                $query->where(function($q) use ($mats) {
                    foreach ($mats as $m) {
                        $q->orWhere('materials', 'like', "%{$m}%");
                    }
                });
            }

            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            if ($request->has('in_stock') && $request->boolean('in_stock')) {
                $query->where('stock', '>', 0);
            }

            $sort = $request->get('sort', 'newest');
            match ($sort) {
                'price_asc' => $query->orderBy('price'),
                'price_desc' => $query->orderByDesc('price'),
                'bestselling' => $query->orderByDesc('sales_count'),
                default => $query->orderByDesc('created_at'),
            };

            $perPage = min((int) $request->get('per_page', 12), 48);
            return $query->paginate($perPage);
        });

        return response()->json($products);
    }

    public function suggestions(Request $request): JsonResponse
    {
        $q = $request->get('q', '');
        if (strlen($q) < 2) return response()->json([]);

        $cacheKey = 'products_suggestions_' . md5($q);
        $suggestions = \Illuminate\Support\Facades\Cache::remember($cacheKey, 600, function() use ($q) {
            return Product::where('name', 'like', "%{$q}%")
                ->orWhere('category', 'like', "%{$q}%")
                ->limit(5)
                ->get(['id', 'name', 'category', 'images']);
        });

        return response()->json($suggestions);
    }

    public function show(Product $product): JsonResponse
    {
        $cacheKey = 'product_show_' . $product->id;
        $data = \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function() use ($product) {
            return $product->load(['approvedReviews.user:id,name', 'variants']);
        });
        return response()->json($data);
    }

    public function byCategory(string $category): JsonResponse
    {
        $cacheKey = 'products_by_category_' . $category;
        $products = \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function() use ($category) {
            return Product::with('variants')->where('category', $category)->orderByDesc('sales_count')->limit(8)->get();
        });
        return response()->json($products);
    }
}
