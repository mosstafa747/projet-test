<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomRequestController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReturnRequestController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/suggestions', [ProductController::class, 'suggestions']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/category/{category}', [ProductController::class, 'byCategory']);
Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index']);
Route::get('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'show']);
Route::post('/coupons/validate', [\App\Http\Controllers\Api\CouponController::class, 'validate']);
Route::get('/shipping-methods', [\App\Http\Controllers\Api\ShippingMethodController::class, 'index']);
Route::get('/testimonials', fn () => \App\Models\Testimonial::where('featured', true)->get());

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/custom-requests', [CustomRequestController::class, 'store']);

// Protected
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/users/profile', [AuthController::class, 'profile']);
    Route::put('/users/profile', [AuthController::class, 'updateProfile']);
    Route::put('/users/password', [AuthController::class, 'updatePassword']);
    Route::delete('/users/account', [AuthController::class, 'deleteAccount']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/password-reset', [AuthController::class, 'passwordReset']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/payment/stripe-session', [\App\Http\Controllers\Api\PaymentController::class, 'createSession']);
    Route::post('/payment/success', [\App\Http\Controllers\Api\PaymentController::class, 'handleSuccess']);

    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);

    Route::get('/tickets', [SupportTicketController::class, 'index']);
    Route::post('/tickets', [SupportTicketController::class, 'store']);
    Route::get('/tickets/{supportTicket}', [SupportTicketController::class, 'show']);
    Route::post('/tickets/{supportTicket}/messages', [SupportTicketController::class, 'addMessage']);

    Route::get('/returns', [ReturnRequestController::class, 'index']);
    Route::post('/returns', [ReturnRequestController::class, 'store']);
});

// Admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('stats', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
    Route::get('settings', [\App\Http\Controllers\Api\Admin\SettingController::class, 'index']);
    Route::put('settings', [\App\Http\Controllers\Api\Admin\SettingController::class, 'update']);
    Route::get('products/alerts', [\App\Http\Controllers\Api\Admin\ProductController::class, 'alerts']);
    Route::apiResource('products', \App\Http\Controllers\Api\Admin\ProductController::class);
    Route::post('products/import', [\App\Http\Controllers\Api\Admin\ProductController::class, 'import']);
    Route::get('orders/export', [\App\Http\Controllers\Api\Admin\OrderController::class, 'export']);
    Route::get('orders', [\App\Http\Controllers\Api\Admin\OrderController::class, 'index']);
    Route::put('orders/{order}', [\App\Http\Controllers\Api\Admin\OrderController::class, 'update']);
    Route::post('orders/{order}/confirm', [\App\Http\Controllers\Api\Admin\OrderController::class, 'confirm']);
    Route::post('orders/{order}/cancel', [\App\Http\Controllers\Api\Admin\OrderController::class, 'cancel']);
    Route::post('orders/{order}/refund', [\App\Http\Controllers\Api\Admin\OrderController::class, 'refund']);
    Route::get('custom-requests', [\App\Http\Controllers\Api\Admin\CustomRequestController::class, 'index']);
    Route::put('custom-requests/{customRequest}', [\App\Http\Controllers\Api\Admin\CustomRequestController::class, 'update']);
    Route::get('users', [\App\Http\Controllers\Api\Admin\UserController::class, 'index']);
    Route::get('users/{user}', [\App\Http\Controllers\Api\Admin\UserController::class, 'show']);
    Route::put('users/{user}/toggle-admin', [\App\Http\Controllers\Api\Admin\UserController::class, 'toggleAdmin']);
    Route::get('reviews', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'index']);
    Route::put('reviews/{review}', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'destroy']);
    
    Route::post('categories', [\App\Http\Controllers\CategoryController::class, 'store']);
    Route::put('categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update']);
    Route::delete('categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy']);
    Route::apiResource('coupons', \App\Http\Controllers\Api\Admin\CouponController::class);
    Route::get('shipping-methods', [\App\Http\Controllers\Api\ShippingMethodController::class, 'adminIndex']);
    Route::post('shipping-methods', [\App\Http\Controllers\Api\ShippingMethodController::class, 'store']);
    Route::put('shipping-methods/{shippingMethod}', [\App\Http\Controllers\Api\ShippingMethodController::class, 'update']);
    Route::delete('shipping-methods/{shippingMethod}', [\App\Http\Controllers\Api\ShippingMethodController::class, 'destroy']);

    Route::get('tickets', [\App\Http\Controllers\Api\Admin\SupportTicketController::class, 'index']);
    Route::put('tickets/{supportTicket}', [\App\Http\Controllers\Api\Admin\SupportTicketController::class, 'update']);
    Route::post('tickets/{supportTicket}/messages', [\App\Http\Controllers\Api\Admin\SupportTicketController::class, 'addMessage']);

    Route::get('returns', [\App\Http\Controllers\Api\Admin\ReturnRequestController::class, 'index']);
    Route::put('returns/{returnRequest}', [\App\Http\Controllers\Api\Admin\ReturnRequestController::class, 'update']);
});
