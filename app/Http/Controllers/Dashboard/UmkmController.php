<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UmkmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $umkmProfiles = UmkmProfile::withCount('products')
            ->latest()
            ->paginate(10);

        return Inertia::render('Dashboard/Umkm/Index', [
            'umkmProfiles' => $umkmProfiles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/Umkm/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'story' => 'required|string',
            'established_year' => 'required|integer|min:1900|max:' . date('Y'),
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('umkm/logos', 'public');
        }

        UmkmProfile::create($validated);

        return redirect()->route('admin.umkm.index')
            ->with('success', 'UMKM profile created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(UmkmProfile $umkm)
    {
        $umkm->load(['products' => function($query) {
            $query->withCount('qrScans', 'reviews');
        }]);

        return Inertia::render('Dashboard/Umkm/Show', [
            'umkm' => $umkm
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UmkmProfile $umkm)
    {
        return Inertia::render('Dashboard/Umkm/Edit', [
            'umkm' => $umkm
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UmkmProfile $umkm)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'story' => 'required|string',
            'established_year' => 'required|integer|min:1900|max:' . date('Y'),
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($umkm->logo_path) {
                Storage::disk('public')->delete($umkm->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('umkm/logos', 'public');
        }

        $umkm->update($validated);

        return redirect()->route('admin.umkm.index')
            ->with('success', 'UMKM profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UmkmProfile $umkm)
    {
        // Delete logo if exists
        if ($umkm->logo_path) {
            Storage::disk('public')->delete($umkm->logo_path);
        }

        $umkm->delete();

        return redirect()->route('admin.umkm.index')
            ->with('success', 'UMKM profile deleted successfully.');
    }
}