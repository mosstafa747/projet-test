<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->supportTickets()->with('messages')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'order_id' => 'nullable|exists:orders,id',
            'priority' => 'nullable|string|in:low,medium,high'
        ]);

        $ticket = $request->user()->supportTickets()->create([
            'subject' => $request->subject,
            'order_id' => $request->order_id,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open'
        ]);

        $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message
        ]);

        return $ticket->load('messages');
    }

    public function show(Request $request, SupportTicket $supportTicket)
    {
        if ($supportTicket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $supportTicket->load(['messages.user', 'order']);
    }

    public function addMessage(Request $request, SupportTicket $supportTicket)
    {
        if ($supportTicket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['message' => 'required|string']);

        $message = $supportTicket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message
        ]);

        // Reopen ticket if it was closed
        if ($supportTicket->status === 'closed') {
            $supportTicket->update(['status' => 'open']);
        }

        return $message->load('user');
    }
}
