<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    /**
     * Upload UMKM logo
     */
    public function uploadUmkmLogo(UploadedFile $file): string
    {
        $filename = $this->generateUniqueFilename($file, 'umkm_logo');
        return $file->storeAs('umkm/logos', $filename, 'public');
    }

    /**
     * Upload product image
     */
    public function uploadProductImage(UploadedFile $file, int $productId): string
    {
        $filename = $this->generateUniqueFilename($file, "product_{$productId}_image");
        return $file->storeAs('products/images', $filename, 'public');
    }

    /**
     * Upload product video
     */
    public function uploadProductVideo(UploadedFile $file, int $productId): string
    {
        $filename = $this->generateUniqueFilename($file, "product_{$productId}_video");
        return $file->storeAs('products/videos', $filename, 'public');
    }

    /**
     * Upload review image
     */
    public function uploadReviewImage(UploadedFile $file, int $reviewId): string
    {
        $filename = $this->generateUniqueFilename($file, "review_{$reviewId}_image");
        return $file->storeAs('reviews/images', $filename, 'public');
    }

    /**
     * Delete file from storage
     */
    public function deleteFile(?string $path): bool
    {
        if (!$path) {
            return true;
        }

        return Storage::disk('public')->delete($path);
    }

    /**
     * Get file URL
     */
    public function getFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    /**
     * Check if file exists
     */
    public function fileExists(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        return Storage::disk('public')->exists($path);
    }

    /**
     * Get file size in bytes
     */
    public function getFileSize(?string $path): ?int
    {
        if (!$path || !$this->fileExists($path)) {
            return null;
        }

        return Storage::disk('public')->size($path);
    }

    /**
     * Get human readable file size
     */
    public function getHumanFileSize(?string $path): ?string
    {
        $bytes = $this->getFileSize($path);
        
        if ($bytes === null) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $factor = floor((strlen($bytes) - 1) / 3);
        
        return sprintf("%.2f %s", $bytes / pow(1024, $factor), $units[$factor]);
    }

    /**
     * Validate image file
     */
    public function validateImage(UploadedFile $file, int $maxSizeKB = 2048): array
    {
        $errors = [];

        // Check file type
        if (!in_array($file->getClientOriginalExtension(), ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            $errors[] = 'File must be an image (jpg, jpeg, png, gif, webp)';
        }

        // Check file size
        if ($file->getSize() > $maxSizeKB * 1024) {
            $errors[] = "File size must be less than {$maxSizeKB}KB";
        }

        // Check if file is actually an image
        if (!getimagesize($file->getPathname())) {
            $errors[] = 'File is not a valid image';
        }

        return $errors;
    }

    /**
     * Validate video file
     */
    public function validateVideo(UploadedFile $file, int $maxSizeMB = 50): array
    {
        $errors = [];

        // Check file type
        if (!in_array($file->getClientOriginalExtension(), ['mp4', 'mov', 'avi', 'wmv', 'webm'])) {
            $errors[] = 'File must be a video (mp4, mov, avi, wmv, webm)';
        }

        // Check file size
        if ($file->getSize() > $maxSizeMB * 1024 * 1024) {
            $errors[] = "File size must be less than {$maxSizeMB}MB";
        }

        return $errors;
    }

    /**
     * Generate unique filename
     */
    private function generateUniqueFilename(UploadedFile $file, string $prefix = ''): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('Y_m_d_His');
        $random = Str::random(8);
        
        $filename = $prefix ? "{$prefix}_{$timestamp}_{$random}" : "{$timestamp}_{$random}";
        
        return "{$filename}.{$extension}";
    }

    /**
     * Clean up old files (for maintenance)
     */
    public function cleanupOldFiles(string $directory, int $daysOld = 30): int
    {
        $files = Storage::disk('public')->files($directory);
        $deletedCount = 0;
        $cutoffDate = now()->subDays($daysOld);

        foreach ($files as $file) {
            $lastModified = Storage::disk('public')->lastModified($file);
            
            if ($lastModified && $lastModified < $cutoffDate->timestamp) {
                Storage::disk('public')->delete($file);
                $deletedCount++;
            }
        }

        return $deletedCount;
    }
}