<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\UmkmController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ReviewController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Redirect admin users to Filament admin panel
        if (auth()->user()->is_admin) {
            return redirect('/admin');
        }
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Dashboard Routes (Admin CRUD)
Route::middleware(['auth', 'verified', 'admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    // Dashboard Home
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    
    // UMKM Management
    Route::resource('umkm', UmkmController::class);
    
    // Product Management
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/regenerate-qr', [ProductController::class, 'regenerateQrCode'])->name('products.regenerate-qr');
    
    // Review Management
    Route::resource('reviews', ReviewController::class);
    Route::patch('reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
    Route::post('reviews/bulk-approve', [ReviewController::class, 'bulkApprove'])->name('reviews.bulk-approve');
    Route::post('reviews/bulk-reject', [ReviewController::class, 'bulkReject'])->name('reviews.bulk-reject');
});

// Public Product Pages (accessed via QR codes)
Route::get('/product/{unique_code}', function ($unique_code) {
    $product = \App\Models\Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->with(['umkmProfile', 'images', 'approvedReviews'])
        ->firstOrFail();
    
    // Track QR scan
    \App\Models\QrScan::create([
        'product_id' => $product->id,
        'scanned_at' => now(),
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'location_data' => null // Can be enhanced with geolocation
    ]);
    
    return Inertia::render('Product/Show', [
        'product' => $product
    ]);
})->name('product.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
