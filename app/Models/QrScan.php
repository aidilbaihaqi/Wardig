<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrScan extends Model
{
    protected $fillable = [
        'product_id',
        'scanned_at',
        'ip_address',
        'user_agent',
        'location_data'
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
        'location_data' => 'array'
    ];

    /**
     * Get the product that was scanned.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
