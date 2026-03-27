<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()->when($request->search, fn ($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->orderByDesc('created_at')
            ->paginate(20);
        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string', 'exists:categories,slug'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'stock' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'materials' => ['nullable', 'string'],
            'dimensions' => ['nullable', 'string'],
        ]);

        // Process images with Cloudinary if present
        if ($request->has('images')) {
            $cloudinary = new \App\Services\CloudinaryService();
            $uploadedImages = [];
            foreach ($request->images as $image) {
                if (str_starts_with($image, 'data:image')) {
                    $uploadedImages[] = $cloudinary->upload($image);
                } else {
                    $uploadedImages[] = $image;
                }
            }
            $validated['images'] = $uploadedImages;
        }

        $product = Product::create($validated);
        \App\Services\AuditLogger::log('product_created', $product, $validated);
        
        // Clear caches
        \Illuminate\Support\Facades\Cache::flush();
        
        return response()->json($product, 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'category' => ['sometimes', 'string', 'exists:categories,slug'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'materials' => ['nullable', 'string'],
            'dimensions' => ['nullable', 'string'],
        ]);

        if ($request->has('images')) {
            $cloudinary = new \App\Services\CloudinaryService();
            $uploadedImages = [];
            foreach ($request->images as $image) {
                if (str_starts_with($image, 'data:image')) {
                    $uploadedImages[] = $cloudinary->upload($image);
                } else {
                    $uploadedImages[] = $image;
                }
            }
            $validated['images'] = $uploadedImages;
        }

        $product->update($validated);
        \App\Services\AuditLogger::log('product_updated', $product, $validated);
        
        // Clear caches
        \Illuminate\Support\Facades\Cache::flush();
        
        return response()->json($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        \App\Services\AuditLogger::log('product_deleted', $product);
        $product->delete();
        return response()->json(null, 204);
    }
}
