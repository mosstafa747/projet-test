<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * @OA\Tag(name="Categories", description="API Endpoints for Categories")
 */
class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/categories",
     *     tags={"Categories"},
     *     summary="List all categories",
     *     @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index()
    {
        return response()->json(\Illuminate\Support\Facades\Cache::remember('categories_all', 3600, function() {
            return Category::all();
        }));
    }

    public function show(Category $category)
    {
        return response()->json(\Illuminate\Support\Facades\Cache::remember('category_show_' . $category->id, 3600, function() use ($category) {
            return $category;
        }));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $originalSlug = $validated['slug'];
        $count = 1;
        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count;
            $count++;
        }

        $category = Category::create($validated);
        \App\Services\AuditLogger::log('category_created', $category, $validated);
        \Illuminate\Support\Facades\Cache::forget('categories_all');
        
        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
            $originalSlug = $validated['slug'];
            $count = 1;
            while (Category::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $count;
                $count++;
            }
        }

        $category->update($validated);
        \App\Services\AuditLogger::log('category_updated', $category, $validated);
        \Illuminate\Support\Facades\Cache::forget('categories_all');
        \Illuminate\Support\Facades\Cache::forget('category_show_' . $category->id);
        
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        \App\Services\AuditLogger::log('category_deleted', $category);
        $category->delete();
        \Illuminate\Support\Facades\Cache::forget('categories_all');
        \Illuminate\Support\Facades\Cache::forget('category_show_' . $category->id);
        
        return response()->json(null, 204);
    }
}
