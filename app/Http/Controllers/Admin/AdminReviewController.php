<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Review::with(['product.umkmProfile']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by product
        if ($request->has('product_id') && $request->product_id) {
            $query->where('product_id', $request->product_id);
        }

        // Search by customer name or comment
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhere('comment', 'like', '%' . $request->search . '%');
            });
        }

        $reviews = $query->latest()->paginate(15);
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'products' => $products,
            'filters' => $request->only(['status', 'product_id', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/Reviews/Create', [
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            'status' => 'required|in:pending,approved,rejected',
            'review_images' => 'nullable|array',
            'review_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle image uploads
        if ($request->hasFile('review_images')) {
            $imagePaths = [];
            foreach ($request->file('review_images') as $image) {
                $imagePaths[] = $image->store('reviews/images', 'public');
            }
            $validated['review_images'] = $imagePaths;
        }

        Review::create($validated);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        $review->load(['product.umkmProfile']);

        return Inertia::render('Admin/Reviews/Show', [
            'review' => $review
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/Reviews/Edit', [
            'review' => $review,
            'products' => $products
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            'status' => 'required|in:pending,approved,rejected',
            'review_images' => 'nullable|array',
            'review_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle new image uploads
        if ($request->hasFile('review_images')) {
            $imagePaths = $review->review_images ?? [];
            foreach ($request->file('review_images') as $image) {
                $imagePaths[] = $image->store('reviews/images', 'public');
            }
            $validated['review_images'] = $imagePaths;
        }

        $review->update($validated);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        // Delete review images if they exist
        if ($review->review_images) {
            foreach ($review->review_images as $imagePath) {
                \Storage::disk('public')->delete($imagePath);
            }
        }

        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review deleted successfully.');
    }

    /**
     * Approve a review
     */
    public function approve(Review $review)
    {
        $review->update(['status' => 'approved']);

        return redirect()->back()
            ->with('success', 'Review approved successfully.');
    }

    /**
     * Reject a review
     */
    public function reject(Review $review)
    {
        $review->update(['status' => 'rejected']);

        return redirect()->back()
            ->with('success', 'Review rejected successfully.');
    }

    /**
     * Bulk approve reviews
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'review_ids' => 'required|array',
            'review_ids.*' => 'exists:reviews,id'
        ]);

        Review::whereIn('id', $request->review_ids)
            ->update(['status' => 'approved']);

        return redirect()->back()
            ->with('success', count($request->review_ids) . ' reviews approved successfully.');
    }

    /**
     * Bulk reject reviews
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'review_ids' => 'required|array',
            'review_ids.*' => 'exists:reviews,id'
        ]);

        Review::whereIn('id', $request->review_ids)
            ->update(['status' => 'rejected']);

        return redirect()->back()
            ->with('success', count($request->review_ids) . ' reviews rejected successfully.');
    }
}
