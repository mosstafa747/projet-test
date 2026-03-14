<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;

class ReturnRequestController extends Controller
{
    public function index()
    {
        return ReturnRequest::with(['order.user', 'orderItem.product'])->latest()->get();
    }

    public function update(Request $request, ReturnRequest $returnRequest)
    {
        $request->validate([
            'status' => 'required|string|in:approved,rejected'
        ]);

        $returnRequest->update(['status' => $request->status]);
        return $returnRequest;
    }
}
