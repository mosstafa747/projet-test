<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $reviews = Review::with('product:id,name', 'user:id,name')->orderByDesc('created_at')->paginate(20);
        return response()->json($reviews);
    }

    public function update(Request $request, Review $review): JsonResponse
    {
        $validated = $request->validate([
            'approved' => ['required', 'boolean'],
        ]);
        $review->update($validated);
        $this->updateProductRating($review->product);
        \App\Services\AuditLogger::log('review_moderated', $review, $validated);
        return response()->json($review);
    }

    public function destroy(Review $review): JsonResponse
    {
        \App\Services\AuditLogger::log('review_deleted', $review);
        $product = $review->product;
        $review->delete();
        $this->updateProductRating($product);
        return response()->json(['message' => 'Review deleted']);
    }

    protected function updateProductRating($product)
    {
        $product->update([
            'rating' => round($product->approvedReviews()->avg('rating') ?? 0, 2),
        ]);
    }
}
