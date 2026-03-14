<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;

class ReturnRequestController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->orders()->whereHas('returnRequests')->with('returnRequests')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'order_item_id' => 'nullable|exists:order_items,id',
            'reason' => 'required|string'
        ]);

        $order = $request->user()->orders()->findOrFail($request->order_id);

        $returnRequest = $order->returnRequests()->create([
            'order_item_id' => $request->order_item_id,
            'reason' => $request->reason,
            'status' => 'pending'
        ]);

        return $returnRequest;
    }
}
