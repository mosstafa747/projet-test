<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index()
    {
        return SupportTicket::with(['user', 'messages'])->latest()->get();
    }

    public function update(Request $request, SupportTicket $supportTicket)
    {
        $request->validate([
            'status' => 'nullable|string|in:open,in_progress,resolved,closed',
            'priority' => 'nullable|string|in:low,medium,high'
        ]);

        $supportTicket->update($request->only(['status', 'priority']));
        return $supportTicket;
    }

    public function addMessage(Request $request, SupportTicket $supportTicket)
    {
        $request->validate(['message' => 'required|string']);

        $message = $supportTicket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message
        ]);

        if ($supportTicket->status === 'open') {
            $supportTicket->update(['status' => 'in_progress']);
        }

        return $message->load('user');
    }
}
