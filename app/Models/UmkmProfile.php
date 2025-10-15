<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UmkmProfile extends Model
{
    protected $fillable = [
        'name',
        'owner_name',
        'address',
        'phone',
        'email',
        'story',
        'established_year',
        'logo_path'
    ];

    protected $casts = [
        'established_year' => 'integer'
    ];

    /**
     * Get the products for the UMKM profile.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'umkm_id');
    }
}
