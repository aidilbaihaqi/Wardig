<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\UmkmProfile;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $umkmProfiles = UmkmProfile::all();
        
        if ($umkmProfiles->isEmpty()) {
            $this->command->info('No UMKM profiles found. Please run UmkmSeeder first.');
            return;
        }

        $products = [
            [
                'name' => 'Nasi Gudeg Jogja',
                'description' => 'Gudeg khas Yogyakarta dengan cita rasa manis dan gurih yang autentik.',
                'history' => 'Resep gudeg ini telah diwariskan turun temurun selama 3 generasi dalam keluarga Bu Sari.',
                'philosophy' => 'Kami percaya bahwa makanan adalah cara terbaik untuk menyatukan keluarga dan menciptakan kenangan indah.',
                'status' => 'active',
            ],
            [
                'name' => 'Keranjang Bambu Anyaman',
                'description' => 'Keranjang bambu berkualitas tinggi dengan anyaman tradisional yang kuat dan tahan lama.',
                'history' => 'Kerajinan bambu ini menggunakan teknik anyaman yang telah dipelajari selama puluhan tahun.',
                'philosophy' => 'Produk ramah lingkungan yang mendukung kelestarian alam dan tradisi lokal.',
                'status' => 'active',
            ],
            [
                'name' => 'Kue Klepon',
                'description' => 'Kue klepon tradisional dengan isian gula merah dan taburan kelapa parut segar.',
                'history' => 'Resep klepon ini adalah warisan nenek yang telah berusia lebih dari 50 tahun.',
                'philosophy' => 'Mempertahankan cita rasa tradisional dengan bahan-bahan alami pilihan.',
                'status' => 'active',
            ],
            [
                'name' => 'Batik Tulis Motif Parang',
                'description' => 'Batik tulis dengan motif parang klasik yang dikerjakan dengan teknik tradisional.',
                'history' => 'Motif parang merupakan salah satu motif batik tertua yang memiliki makna filosofis mendalam.',
                'philosophy' => 'Melestarikan seni batik tradisional dengan sentuhan desain modern.',
                'status' => 'active',
            ],
            [
                'name' => 'Rendang Daging Sapi',
                'description' => 'Rendang daging sapi dengan bumbu rempah pilihan dan proses memasak tradisional.',
                'history' => 'Resep rendang keluarga yang telah disempurnakan selama bertahun-tahun.',
                'philosophy' => 'Menghadirkan cita rasa Minang yang autentik dengan kualitas terbaik.',
                'status' => 'active',
            ],
        ];

        foreach ($products as $index => $productData) {
            // Assign to UMKM profiles cyclically
            $umkmProfile = $umkmProfiles[$index % $umkmProfiles->count()];
            
            Product::firstOrCreate(
                [
                    'name' => $productData['name'],
                    'umkm_id' => $umkmProfile->id,
                ],
                array_merge($productData, [
                    'umkm_id' => $umkmProfile->id,
                    'unique_code' => Str::random(10),
                ])
            );
        }
    }
}
