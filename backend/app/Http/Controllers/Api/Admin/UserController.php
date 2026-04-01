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
            ->when($request->search, function ($q, $v) {
                $q->where(function($q) use ($v) {
                    $q->where('name', 'like', "%{$v}%")
                      ->orWhere('email', 'like', "%{$v}%")
                      ->orWhere('phone', 'like', "%{$v}%");
                });
            })
            ->when($request->role, function ($q, $v) {
                if ($v === 'admin') $q->where('is_admin', true);
                if ($v === 'driver') $q->where('is_driver', true);
                if ($v === 'user') $q->where('is_admin', false)->where('is_driver', false);
            })
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($users);
    }
}
