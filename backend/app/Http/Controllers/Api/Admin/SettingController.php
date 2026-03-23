<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    public function update(Request $request): JsonResponse
    {
        $settings = $request->all();
        
        foreach ($settings as $key => $value) {
            Setting::setValue($key, $value);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
