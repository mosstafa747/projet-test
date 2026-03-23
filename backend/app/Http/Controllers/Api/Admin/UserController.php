<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->search, fn ($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('email', 'like', "%{$v}%"))
            ->orderByDesc('created_at')
            ->paginate(20);
        return response()->json($users);
    }

    public function toggleAdmin(User $user): JsonResponse
    {
        try {
            $user->is_admin = !$user->is_admin;
            $user->save();
            
            \Illuminate\Support\Facades\Log::info("User role toggled: ID {$user->id}, email {$user->email}, new is_admin: " . ($user->is_admin ? 'true' : 'false'));
            
            return response()->json([
                'message' => 'User role updated',
                'is_admin' => $user->is_admin
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to toggle admin role for user ID {$user->id}: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update user role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(User $user): JsonResponse
    {
        $user->load([
            'orders' => fn($q) => $q->orderByDesc('created_at')->limit(10),
            'reviews' => fn($q) => $q->with('product')->orderByDesc('created_at')->limit(10),
            'tickets' => fn($q) => $q->orderByDesc('created_at')->limit(10)
        ]);
        
        return response()->json($user);
    }
}
