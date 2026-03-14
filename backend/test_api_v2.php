<?php
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$request = Request::create('/api/admin/coupons', 'GET');

// Simulate authenticated admin
$admin = App\Models\User::where('is_admin', true)->first();
if ($admin) {
    echo "Found admin: " . $admin->email . "\n";
    $request->merge(['user' => $admin]); // Simple way to simulate user in request
    // Better: actAs via Sanctum or just force it in Resolver
    $app['auth']->guard('sanctum')->setUser($admin);
} else {
    echo "No admin user found!\n";
}

try {
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content Preview: " . substr($response->getContent(), 0, 500) . "\n";
    if ($response->getStatusCode() === 500) {
        // If it's a 500, try to see the error details
        $content = json_decode($response->getContent(), true);
        if (isset($content['message'])) {
            echo "ERROR MESSAGE: " . $content['message'] . "\n";
        }
    }
} catch (\Throwable $e) {
    echo "CAUGHT EXCEPTION: " . $e->getMessage() . "\n";
    echo "FILE: " . $e->getFile() . " LINE: " . $e->getLine() . "\n";
}
