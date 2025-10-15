<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UmkmProfile;

class UmkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $umkmData = [
            [
                'name' => 'Warung Makan Bu Sari',
                'owner_name' => 'Sari Wulandari',
                'story' => 'Warung makan tradisional dengan cita rasa autentik Indonesia. Menyajikan berbagai masakan rumahan yang lezat dan bergizi.',
                'address' => 'Jl. Merdeka No. 123, Jakarta Pusat',
                'phone' => '081234567890',
                'email' => 'busari@warung.com',
                'established_year' => 2015,
            ],
            [
                'name' => 'Toko Kerajinan Bambu Pak Joko',
                'owner_name' => 'Joko Susanto',
                'story' => 'Produsen kerajinan bambu berkualitas tinggi. Menyediakan berbagai produk ramah lingkungan dari bambu pilihan.',
                'address' => 'Jl. Bambu Raya No. 45, Yogyakarta',
                'phone' => '087654321098',
                'email' => 'joko@bamboo.com',
                'established_year' => 2010,
            ],
            [
                'name' => 'Kue Tradisional Ibu Ani',
                'owner_name' => 'Ani Suryani',
                'story' => 'Spesialis kue tradisional Indonesia dengan resep turun temurun. Menggunakan bahan-bahan alami dan berkualitas.',
                'address' => 'Jl. Manis No. 67, Surabaya',
                'phone' => '089876543210',
                'email' => 'ani@kuetraditional.com',
                'established_year' => 2018,
            ],
            [
                'name' => 'Fashion Batik Modern',
                'owner_name' => 'Dewi Kartika',
                'story' => 'Desainer batik modern yang memadukan motif tradisional dengan gaya kontemporer.',
                'address' => 'Jl. Batik Indah No. 89, Solo',
                'phone' => '085432109876',
                'email' => 'info@batikmodern.com',
                'established_year' => 2020,
            ],
        ];

        foreach ($umkmData as $data) {
            UmkmProfile::firstOrCreate(
                ['email' => $data['email']],
                $data
            );
        }
    }
}
