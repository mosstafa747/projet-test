<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomRequestController extends Controller
{
    public function index(): JsonResponse
    {
        $requests = CustomRequest::orderByDesc('created_at')->paginate(20);
        return response()->json($requests);
    }

    public function update(Request $request, CustomRequest $customRequest): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'string', 'max:50'],
            'admin_response' => ['nullable', 'string'],
        ]);
        $customRequest->update($validated);
        return response()->json($customRequest);
    }
}
