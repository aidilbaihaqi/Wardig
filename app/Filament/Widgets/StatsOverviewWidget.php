<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use App\Models\Review;
use App\Models\UmkmProfile;
use Filament\Widgets\StatsOverviewWidget as BaseStatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseStatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalUmkm = UmkmProfile::count();
        $totalProducts = Product::count();
        $totalReviews = Review::count();
        $averageRating = Review::avg('rating') ?? 0;
        $pendingReviews = Review::where('status', 'pending')->count();

        return [
            Stat::make('Total UMKM', $totalUmkm)
                ->description('Jumlah UMKM terdaftar')
                ->descriptionIcon('heroicon-m-building-storefront')
                ->color('success'),
            
            Stat::make('Total Produk', $totalProducts)
                ->description('Produk yang tersedia')
                ->descriptionIcon('heroicon-m-cube')
                ->color('info'),
            
            Stat::make('Total Review', $totalReviews)
                ->description('Review dari pelanggan')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('warning'),
            
            Stat::make('Rating Rata-rata', number_format($averageRating, 1))
                ->description('Rating keseluruhan')
                ->descriptionIcon('heroicon-m-star')
                ->color($averageRating >= 4 ? 'success' : ($averageRating >= 3 ? 'warning' : 'danger')),
            
            Stat::make('Review Pending', $pendingReviews)
                ->description('Menunggu moderasi')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingReviews > 0 ? 'danger' : 'success'),
        ];
    }
}
