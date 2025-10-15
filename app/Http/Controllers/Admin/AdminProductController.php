<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;

class AdminProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['umkmProfile', 'images'])
            ->withCount('qrScans', 'reviews')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $umkmProfiles = UmkmProfile::select('id', 'name')->get();

        return Inertia::render('Admin/Products/Create', [
            'umkmProfiles' => $umkmProfiles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'umkm_id' => 'required|exists:umkm_profiles,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'history' => 'nullable|string',
            'philosophy' => 'nullable|string',
            'video' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:51200', // 50MB max
            'status' => 'required|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle video upload
        if ($request->hasFile('video')) {
            $validated['video_path'] = $request->file('video')->store('products/videos', 'public');
        }

        $product = Product::create($validated);

        // Generate QR Code
        $this->generateQrCode($product);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('products/images', 'public');
                $product->images()->create([
                    'image_path' => $imagePath,
                    'alt_text' => $product->name . ' - Image ' . ($index + 1),
                    'sort_order' => $index,
                    'is_featured' => $index === 0
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['umkmProfile', 'images', 'qrScans' => function($query) {
            $query->latest()->take(10);
        }, 'reviews' => function($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load('images');
        $umkmProfiles = UmkmProfile::select('id', 'name')->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'umkmProfiles' => $umkmProfiles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'umkm_id' => 'required|exists:umkm_profiles,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'history' => 'nullable|string',
            'philosophy' => 'nullable|string',
            'video' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:51200',
            'status' => 'required|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle video upload
        if ($request->hasFile('video')) {
            // Delete old video if exists
            if ($product->video_path) {
                Storage::disk('public')->delete($product->video_path);
            }
            $validated['video_path'] = $request->file('video')->store('products/videos', 'public');
        }

        $product->update($validated);

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $currentImageCount = $product->images()->count();
            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('products/images', 'public');
                $product->images()->create([
                    'image_path' => $imagePath,
                    'alt_text' => $product->name . ' - Image ' . ($currentImageCount + $index + 1),
                    'sort_order' => $currentImageCount + $index,
                    'is_featured' => false
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete video if exists
        if ($product->video_path) {
            Storage::disk('public')->delete($product->video_path);
        }

        // Delete QR code if exists
        if ($product->qr_code_path) {
            Storage::disk('public')->delete($product->qr_code_path);
        }

        // Delete product images
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Generate QR code for product
     */
    private function generateQrCode(Product $product)
    {
        $url = route('product.show', $product->unique_code);
        
        $result = Builder::create()
            ->writer(new PngWriter())
            ->data($url)
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(ErrorCorrectionLevel::High)
            ->size(500)
            ->margin(10)
            ->roundBlockSizeMode(RoundBlockSizeMode::Margin)
            ->build();

        $fileName = 'qr_codes/product_' . $product->id . '_' . time() . '.png';
        Storage::disk('public')->put($fileName, $result->getString());

        $product->update(['qr_code_path' => $fileName]);
    }

    /**
     * Regenerate QR code for product
     */
    public function regenerateQrCode(Product $product)
    {
        // Delete old QR code if exists
        if ($product->qr_code_path) {
            Storage::disk('public')->delete($product->qr_code_path);
        }

        $this->generateQrCode($product);

        return redirect()->back()
            ->with('success', 'QR code regenerated successfully.');
    }
}
