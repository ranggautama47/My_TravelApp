<?php

use App\Http\Controllers\Dashboard\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Dashboard\PermissionController;
use App\Http\Controllers\Dashboard\RoleController;
use App\Http\Controllers\Dashboard\UserController;
use App\Http\Controllers\Dashboard\CategoriesController;
use App\Http\Controllers\Dashboard\LocationsController;
use App\Http\Controllers\Dashboard\TicketController;
use App\Http\Controllers\Dashboard\ReviewsController;
use App\Http\Controllers\Dashboard\TransactionController;
use App\Http\Controllers\Dashboard\RegionController;
use App\Http\Controllers\Dashboard\TicketCategoryController;
use App\Http\Controllers\User\LocationsController as UserLocationsController;
use App\Http\Controllers\User\LocationDetailController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\PaymentController;

Route::get('/test-webhook', function () {
    return response()->json([
        'webhook_secret' => config('services.xendit.webhook_secret'),
        'is_set' => !empty(config('services.xendit.webhook_secret')),
        'length' => strlen(config('services.xendit.webhook_secret'))
    ]);
});
// Routes utama
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/location', [UserLocationsController::class, 'index'])->name('location.index');
Route::get('/location/{id}', [LocationDetailController::class, 'index'])->name('location.detail');
Route::get('/maps', [UserLocationsController::class, 'maps'])->name('location.maps');

// ⭐ PENTING: Webhook HARUS di luar middleware auth
Route::post('/payment/webhook', [PaymentController::class, 'handleWebhook'])->name('payment.webhook');
Route::post('/webhook/xendit', [PaymentController::class, 'handleWebhook']);


Route::middleware('auth')->prefix('dashboard')->group(function () {
    Route::post('/payment', [PaymentController::class, 'handlePayment'])->name('payment.handle');
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->middleware(['verified'])->name('dashboard');

    // Resources
    Route::resource('/categories', CategoriesController::class);
    Route::resource('/locations', LocationsController::class);
    Route::resource('/reviews', ReviewsController::class);
    // Debug route: return reviews for a user (only user or admin can access)
    Route::get('/debug/reviews/{userId}', [ReviewsController::class, 'debugUserReviews'])->name('debug.reviews');
    Route::resource('/tickets', TicketController::class);
    Route::resource('/transactions', TransactionController::class);
    Route::resource('/regions', RegionController::class);
    Route::resource('/ticket-categories', TicketCategoryController::class);

    // permission & Roles
    Route::resource('/permissions', PermissionController::class);
    Route::resource('/roles', RoleController::class)->except('show');

    // users
    Route::resource('/users', UserController::class);

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Payments
    Route::post('/payment', [PaymentController::class, 'handlePayment'])->name('payment.handle');
    Route::get('/payment/status/{id}', [PaymentController::class, 'paymentStatus'])->name('payment.status');
    Route::get('/payment/check/{externalId}', [PaymentController::class, 'getPaymentStatus'])->name('payment.check');
    Route::get('/payment/success', function () {
        return Inertia::render('Payment/Success');
    })->name('payment.success');
    Route::get('/payment/failed', function () {
        return Inertia::render('Payment/Failed');
    })->name('payment.failed');
});

require __DIR__ . '/auth.php';
