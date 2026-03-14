<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/api/admin/coupons', 'GET');
// We need to act as an admin user
$user = App\Models\User::where('is_admin', true)->first();
if ($user) {
    $request->setUserResolver(fn() => $user);
}

try {
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content: " . $response->getContent() . "\n";
    $kernel->terminate($request, $response);
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "FILE: " . $e->getFile() . " LINE: " . $e->getLine() . "\n";
    echo "TRACE: " . $e->getTraceAsString() . "\n";
}
