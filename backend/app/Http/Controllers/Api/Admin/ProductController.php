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
        $products = Product::with('variants')->when($request->search, fn ($q, $v) => $q->where('name', 'like', "%{$v}%"))
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
            'sku' => ['nullable', 'string', 'unique:products,sku'],
            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required', 'string'],
            'variants.*.options' => ['nullable', 'array'],
            'variants.*.price_modifier' => ['nullable', 'numeric'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.sku' => ['nullable', 'string'],
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

        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $variantData) {
                $product->variants()->create($variantData);
            }
        }

        \App\Services\AuditLogger::log('product_created', $product, $validated);
        
        // Clear caches
        \Illuminate\Support\Facades\Cache::flush();
        
        return response()->json($product->load('variants'), 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('variants'));
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
            'sku' => ['nullable', 'string', 'unique:products,sku,' . $product->id],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.name' => ['required', 'string'],
            'variants.*.options' => ['nullable', 'array'],
            'variants.*.price_modifier' => ['nullable', 'numeric'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.sku' => ['nullable', 'string'],
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

        if ($request->has('variants') && is_array($request->variants)) {
            $updatedVariantIds = [];
            foreach ($request->variants as $variantData) {
                if (isset($variantData['id'])) {
                    $variant = $product->variants()->find($variantData['id']);
                    if ($variant) {
                        $variant->update($variantData);
                        $updatedVariantIds[] = $variant->id;
                    }
                } else {
                    $newVariant = $product->variants()->create($variantData);
                    $updatedVariantIds[] = $newVariant->id;
                }
            }
            // Delete variants not sent in update
            $product->variants()->whereNotIn('id', $updatedVariantIds)->delete();
        }

        \App\Services\AuditLogger::log('product_updated', $product, $validated);
        
        // Clear caches
        \Illuminate\Support\Facades\Cache::flush();
        
        return response()->json($product->load('variants'));
    }

    public function destroy(Product $product): JsonResponse
    {
        \App\Services\AuditLogger::log('product_deleted', $product);
        $product->delete();
        return response()->json(null, 204);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        if (!$handle) {
            return response()->json(['message' => 'Unable to read file.'], 422);
        }

        // Read header row
        $header = fgetcsv($handle);
        if (!$header) {
            fclose($handle);
            return response()->json(['message' => 'CSV file is empty or has no header row.'], 422);
        }

        $header = array_map('strtolower', array_map('trim', $header));
        $requiredFields = ['name', 'price', 'category', 'stock'];
        $missingHeaders = array_diff($requiredFields, $header);

        if (!empty($missingHeaders)) {
            fclose($handle);
            return response()->json([
                'message' => 'CSV is missing required columns: ' . implode(', ', $missingHeaders),
            ], 422);
        }

        $successCount = 0;
        $failureCount = 0;
        $errors = [];
        $seenSkus = [];
        $rowNumber = 1; // header is row 0

        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;
            $data = array_combine($header, array_pad($row, count($header), ''));

            // Trim values
            $data = array_map('trim', $data);

            // Validate required fields
            $rowErrors = [];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    $rowErrors[] = "Missing required field: {$field}";
                }
            }

            // Validate price is numeric
            if (!empty($data['price']) && !is_numeric($data['price'])) {
                $rowErrors[] = "Price must be a number";
            }

            // Validate stock is integer
            if (!empty($data['stock']) && !ctype_digit($data['stock'])) {
                $rowErrors[] = "Stock must be an integer";
            }

            // Validate category exists
            if (!empty($data['category'])) {
                $categoryExists = \App\Models\Category::where('slug', $data['category'])
                    ->orWhere('name', $data['category'])->exists();
                if (!$categoryExists) {
                    $rowErrors[] = "Category '{$data['category']}' does not exist";
                }
            }

            // Validate SKU uniqueness
            $sku = $data['sku'] ?? null;
            if (!empty($sku)) {
                if (in_array($sku, $seenSkus)) {
                    $rowErrors[] = "Duplicate SKU '{$sku}' within this file";
                } elseif (Product::where('sku', $sku)->exists()) {
                    $rowErrors[] = "SKU '{$sku}' already exists in the database";
                } else {
                    $seenSkus[] = $sku;
                }
            }

            if (!empty($rowErrors)) {
                $failureCount++;
                $errors[] = ['row' => $rowNumber, 'name' => $data['name'] ?? '(empty)', 'errors' => $rowErrors];
                continue;
            }

            // Resolve category slug
            $category = \App\Models\Category::where('slug', $data['category'])
                ->orWhere('name', $data['category'])->first();

            try {
                Product::create([
                    'name' => $data['name'],
                    'price' => (float) $data['price'],
                    'description' => $data['description'] ?? '',
                    'category' => $category->slug,
                    'stock' => (int) $data['stock'],
                    'sku' => $sku ?: null,
                    'materials' => $data['materials'] ?? null,
                    'dimensions' => $data['dimensions'] ?? null,
                    'low_stock_threshold' => isset($data['low_stock_threshold']) && $data['low_stock_threshold'] !== '' ? (int) $data['low_stock_threshold'] : 5,
                    'images' => !empty($data['imageurl']) ? [$data['imageurl']] : [],
                ]);
                $successCount++;
            } catch (\Exception $e) {
                $failureCount++;
                $errors[] = ['row' => $rowNumber, 'name' => $data['name'], 'errors' => [$e->getMessage()]];
            }
        }

        fclose($handle);

        \Illuminate\Support\Facades\Cache::flush();

        return response()->json([
            'success_count' => $successCount,
            'failure_count' => $failureCount,
            'errors' => $errors,
        ]);
    }

    public function alerts(): JsonResponse
    {
        $products = Product::whereColumn('stock', '<=', 'low_stock_threshold')
            ->orWhere(function($query) {
                $query->whereNull('low_stock_threshold')
                      ->where('stock', '<=', 5);
            })
            ->with('variants')
            ->get();
        return response()->json($products);
    }
}
