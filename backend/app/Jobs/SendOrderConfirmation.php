<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendOrderConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Order $order)
    {}

    public function handle(): void
    {
        // For now, we simulate sending an email as the system isn't fully configured
        Log::info("Asynchronous Order Confirmation Email sent for Order #{$this->order->order_number} to {$this->order->user?->email}");
        
        // In a real scenario, we would use Mail::to($this->order->user->email)->send(new OrderConfirmed($this->order));
    }
}
