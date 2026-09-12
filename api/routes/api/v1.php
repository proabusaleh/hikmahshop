<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\WishlistController;
use App\Http\Controllers\Api\V1\CouponController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\MobileApiController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\CmsController;

// ── Public ──
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// ── Search (Public) ──
Route::get('/search',              [SearchController::class, 'search']);
Route::get('/search/suggestions',  [SearchController::class, 'suggestions']);
Route::get('/search/popular',      [SearchController::class, 'popular']);

// ── Reviews (Public) ──
Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);

// ── Protected ──
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Search
    Route::get('/search/recent',    [SearchController::class, 'recent']);
    Route::delete('/search/recent', [SearchController::class, 'clearRecent']);

    // Cart
    Route::get('/cart',                    [CartController::class, 'index']);
    Route::post('/cart/add',               [CartController::class, 'add']);
    Route::patch('/cart/items/{item}',     [CartController::class, 'updateQuantity']);
    Route::delete('/cart/items/{item}',    [CartController::class, 'remove']);
    Route::delete('/cart',                 [CartController::class, 'clear']);

    // Wishlist
    Route::get('/wishlist',                         [WishlistController::class, 'index']);
    Route::post('/wishlist',                         [WishlistController::class, 'toggle']);
    Route::patch('/wishlist/{wishlist}/alerts',      [WishlistController::class, 'updateAlerts']);
    Route::post('/wishlist/{wishlist}/move-to-cart', [WishlistController::class, 'moveToCart']);

    // Coupon
    Route::post('/coupons/validate', [CouponController::class, 'validate']);

    // Checkout
    Route::get('/checkout/summary',     [CheckoutController::class, 'summary']);
    Route::post('/checkout/place-order', [CheckoutController::class, 'placeOrder']);

    // Orders
    Route::get('/orders',           [OrderController::class, 'index']);
    Route::get('/orders/{orderNumber}',   [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // Customer review actions
    Route::post('/reviews',                 [ReviewController::class, 'store']);
    Route::put('/reviews/{review}',         [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}',      [ReviewController::class, 'destroy']);
    Route::post('/reviews/{review}/vote',   [ReviewController::class, 'vote']);
    Route::post('/reviews/{review}/report', [ReviewController::class, 'report']);

    // Notifications
    Route::get('/notifications',              [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read',  [NotificationController::class, 'markRead']);
    Route::patch('/notifications/read-all',   [NotificationController::class, 'markAllRead']);
    Route::post('/push-token',                [NotificationController::class, 'registerPushToken']);
    Route::delete('/push-token',              [NotificationController::class, 'removePushToken']);
});

// Admin coupon management
Route::middleware(['auth:sanctum', 'role:super_admin|admin|manager'])->group(function () {
    Route::post('/coupons', [CouponController::class, 'store']);
});

// Admin order management
Route::middleware(['auth:sanctum', 'role:super_admin|admin|manager|delivery_manager'])->group(function () {
    Route::get('/admin/orders',                        [OrderController::class, 'adminIndex']);
    Route::patch('/admin/orders/{order}/status',       [OrderController::class, 'updateStatus']);
    Route::post('/admin/orders/{order}/assign-courier', [OrderController::class, 'assignCourier']);
    Route::post('/admin/orders/{order}/tracking',      [OrderController::class, 'updateTracking']);
    Route::patch('/admin/orders/{order}/note',         [OrderController::class, 'addNote']);
    Route::get('/admin/payments',                      [OrderController::class, 'adminPayments']);
});

// Admin review management
Route::middleware(['auth:sanctum', 'role:super_admin|admin|content_manager'])->group(function () {
    Route::get('/admin/reviews',                    [ReviewController::class, 'adminIndex']);
    Route::get('/admin/reviews/reported',           [ReviewController::class, 'reported']);
    Route::patch('/admin/reviews/{review}/moderate', [ReviewController::class, 'moderate']);
    Route::post('/admin/reviews/{review}/reply',     [ReviewController::class, 'reply']);
});

// Payment callbacks (NO auth — these come from payment gateways)
Route::post('/payment/sslcommerz/ipn',    [PaymentController::class, 'sslcommerzIPN']);
Route::get('/payment/sslcommerz/success',  [PaymentController::class, 'sslcommerzSuccess']);
Route::get('/payment/bkash/callback',      [PaymentController::class, 'bkashCallback']);
Route::get('/payment/nagad/callback',      [PaymentController::class, 'nagadCallback']);
Route::get('/payment/cancelled',           [PaymentController::class, 'paymentCancelled']);
Route::get('/payment/failed',              [PaymentController::class, 'paymentFailed']);

// Mobile App (Public)
Route::prefix('mobile')->group(function () {
    Route::get('/home',   [MobileApiController::class, 'home']);
    Route::get('/config', [MobileApiController::class, 'config']);
});

// ── Blog (Public) ──
Route::get('/blog',            [BlogController::class, 'index']);
Route::get('/blog/categories', [BlogController::class, 'categories']);
Route::get('/blog/{slug}',     [BlogController::class, 'show']);

// ── CMS (Public) ──
Route::get('/pages/menu',      [CmsController::class, 'menuPages']);
Route::get('/pages/{slug}',    [CmsController::class, 'page']);
Route::get('/banners/{position?}', [CmsController::class, 'banners']);
Route::get('/faqs',            [CmsController::class, 'faqs']);
Route::get('/policies/{type}', [CmsController::class, 'policy']);

// ── Admin: CMS & Blog ──
Route::middleware(['auth:sanctum', 'role:super_admin|admin|content_manager'])->group(function () {
    Route::post('/blog',              [BlogController::class, 'store']);
    Route::put('/blog/{post}',        [BlogController::class, 'update']);
    Route::delete('/blog/{post}',     [BlogController::class, 'destroy']);

    Route::post('/admin/pages',       [CmsController::class, 'storePage']);
    Route::put('/admin/pages/{page}', [CmsController::class, 'updatePage']);
    Route::post('/admin/banners',     [CmsController::class, 'storeBanner']);
    Route::post('/admin/faqs',        [CmsController::class, 'storeFaq']);
    Route::put('/admin/policies/{type}', [CmsController::class, 'updatePolicy']);
});

// Admin analytics + inventory
Route::middleware(['auth:sanctum', 'role:super_admin|admin|manager'])->group(function () {
    // Analytics
    Route::get('/admin/analytics/dashboard',  [AnalyticsController::class, 'dashboard']);
    Route::get('/admin/analytics/sales',      [AnalyticsController::class, 'sales']);
    Route::get('/admin/analytics/products',   [AnalyticsController::class, 'products']);
    Route::get('/admin/analytics/customers',  [AnalyticsController::class, 'customers']);

    // Inventory
    Route::get('/admin/inventory',            [InventoryController::class, 'index']);
    Route::get('/admin/inventory/low-stock',  [InventoryController::class, 'lowStock']);
    Route::get('/admin/inventory/history',    [InventoryController::class, 'history']);
    Route::post('/admin/inventory/adjust',    [InventoryController::class, 'adjust']);
    Route::post('/admin/inventory/stock-in',  [InventoryController::class, 'stockIn']);
    Route::post('/admin/inventory/stock-out', [InventoryController::class, 'stockOut']);
});
