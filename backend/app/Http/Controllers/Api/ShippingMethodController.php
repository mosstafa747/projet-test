<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingMethodController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(ShippingMethod::where('is_active', true)->get());
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json(ShippingMethod::orderBy('price')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'estimated_days' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        return response()->json(ShippingMethod::create($validated), 201);
    }

    public function update(Request $request, ShippingMethod $shippingMethod): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'estimated_days' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $shippingMethod->update($validated);
        return response()->json($shippingMethod);
    }

    public function destroy(ShippingMethod $shippingMethod): JsonResponse
    {
        $shippingMethod->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
