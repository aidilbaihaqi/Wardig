<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\UmkmController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ReviewController;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\Review;

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

// Admin CRUD now handled by Filament at /admin. Remove Inertia-based admin routes to
// prevent conflicts with Filament panel routing and authentication.

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

// Additional public sections for product detail
Route::get('/product/{unique_code}/story', function ($unique_code) {
    $product = Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->with(['umkmProfile', 'images'])
        ->firstOrFail();

    return Inertia::render('Product/Story', [
        'product' => $product,
    ]);
})->name('product.story');

Route::get('/product/{unique_code}/maker', function ($unique_code) {
    $product = Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->with(['umkmProfile.products' => function ($query) {
            $query->select('id', 'umkm_id', 'name', 'unique_code');
        }])
        ->firstOrFail();

    return Inertia::render('Product/Maker', [
        'product' => $product,
    ]);
})->name('product.maker');

Route::get('/product/{unique_code}/gallery', function ($unique_code) {
    $product = Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->with(['images'])
        ->firstOrFail();

    return Inertia::render('Product/Gallery', [
        'product' => $product,
    ]);
})->name('product.gallery');

Route::get('/product/{unique_code}/reviews', function ($unique_code) {
    $product = Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->with(['approvedReviews', 'umkmProfile'])
        ->firstOrFail();

    return Inertia::render('Product/Reviews', [
        'product' => $product,
    ]);
})->name('product.reviews');

// Public endpoint to submit a review (pending approval)
Route::post('/product/{unique_code}/reviews', function ($unique_code) {
    $product = Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->firstOrFail();

    $validated = request()->validate([
        'customer_name' => 'required|string|max:255',
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'required|string',
        'review_images' => 'nullable|array',
        'review_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $imagePaths = [];
    if (request()->hasFile('review_images')) {
        foreach (request()->file('review_images') as $image) {
            $imagePaths[] = $image->store('reviews/images', 'public');
        }
    }

    Review::create([
        'product_id' => $product->id,
        'customer_name' => $validated['customer_name'],
        'rating' => $validated['rating'],
        'comment' => $validated['comment'],
        'review_images' => $imagePaths ?: null,
        'status' => 'pending',
    ]);

    return redirect()->route('product.reviews', ['unique_code' => $unique_code])
        ->with('success', 'Review berhasil dikirim dan menunggu persetujuan.');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Public QR Scanner page for customers
Route::get('/scan', function () {
    return Inertia::render('Scan');
})->name('scan');

// Scan success page: shown immediately after QR decoded
Route::get('/scan/success/{unique_code}', function ($unique_code) {
    $product = Product::where('unique_code', $unique_code)
        ->where('status', 'active')
        ->with(['umkmProfile'])
        ->firstOrFail();

    // Track QR scan upon successful decode
    \App\Models\QrScan::create([
        'product_id' => $product->id,
        'scanned_at' => now(),
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'location_data' => null,
    ]);

    return Inertia::render('ScanSuccess', [
        'product' => $product,
    ]);
})->name('scan.success');

// Serve product QR images via application (works even if symlink is blocked)
Route::get('/qr/{product}', function (Product $product) {
    if (! $product->qr_code_path || ! Storage::disk('public')->exists($product->qr_code_path)) {
        abort(404);
    }

    $path = Storage::disk('public')->path($product->qr_code_path);
    return response()->file($path);
})->name('product.qr');

// Download product QR image
Route::get('/qr/{product}/download', function (Product $product) {
    if (! $product->qr_code_path || ! Storage::disk('public')->exists($product->qr_code_path)) {
        abort(404);
    }

    $path = Storage::disk('public')->path($product->qr_code_path);
    $downloadName = 'product_' . $product->id . '_qr.png';
    return response()->download($path, $downloadName);
})->name('product.qr.download');
