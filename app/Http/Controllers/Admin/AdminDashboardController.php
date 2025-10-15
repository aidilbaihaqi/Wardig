<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\QrScan;
use App\Models\Review;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get dashboard statistics
        $stats = [
            'total_umkm' => UmkmProfile::count(),
            'total_products' => Product::count(),
            'total_scans' => QrScan::count(),
            'pending_reviews' => Review::where('status', 'pending')->count(),
        ];

        // Get recent activities
        $recentScans = QrScan::with('product.umkmProfile')
            ->latest('scanned_at')
            ->take(10)
            ->get();

        $recentReviews = Review::with('product.umkmProfile')
            ->latest()
            ->take(5)
            ->get();

        // Get scan analytics for charts
        $scansByDay = QrScan::selectRaw('DATE(scanned_at) as date, COUNT(*) as count')
            ->where('scanned_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = Product::withCount('qrScans')
            ->with('umkmProfile')
            ->orderBy('qr_scans_count', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentScans' => $recentScans,
            'recentReviews' => $recentReviews,
            'scansByDay' => $scansByDay,
            'topProducts' => $topProducts,
        ]);
    }
}
