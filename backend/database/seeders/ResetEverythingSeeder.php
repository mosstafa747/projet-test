<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class ResetEverythingSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 1. Wipe Orders & Logistics
        DB::table('orders')->truncate();
        DB::table('order_items')->truncate();
        
        // 2. Wipe Custom Requests
        DB::table('custom_requests')->truncate();
        
        // 3. Wipe Feedback & Support
        DB::table('reviews')->truncate();
        DB::table('support_messages')->truncate();
        DB::table('support_tickets')->truncate();
        DB::table('return_requests')->truncate();
        
        // 4. Wipe Logs
        DB::table('audit_logs')->truncate();

        // 5. Reset Product Stats (but keep products)
        // Set stock to 0 and sales_count to 0 as requested
        Product::query()->update([
            'stock' => 0,
            'sales_count' => 0
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('🚀 Database has been reset to zero. All orders, requests, and cash records are cleared.');
        $this->command->info('📦 All product stock and sales counts have been set to 0.');
    }
}
