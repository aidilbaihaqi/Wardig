<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UmkmProfile;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or find admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@wardig.com'],
            [
                'name' => 'Admin User',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_admin' => true,
            ]
        );

        // Create or find regular users
        $user1 = User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'jane@example.com'],
            [
                'name' => 'Jane Smith',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]
        );

        // Create or find UMKM profiles
        $umkm1 = UmkmProfile::firstOrCreate(
            ['email' => 'gudegbusari@gmail.com'],
            [
                'name' => 'Warung Nasi Gudeg Bu Sari',
                'owner_name' => 'Bu Sari',
                'story' => 'Warung tradisional yang menyajikan gudeg khas Yogyakarta dengan cita rasa autentik turun temurun. Menggunakan bahan-bahan pilihan dan bumbu rahasia keluarga.',
                'address' => 'Jl. Malioboro No. 123, Yogyakarta',
                'phone' => '081234567890',
                'established_year' => 2010,
            ]
        );

        $umkm2 = UmkmProfile::firstOrCreate(
            ['email' => 'batikindah@gmail.com'],
            [
                'name' => 'Kerajinan Batik Indah',
                'owner_name' => 'Pak Bambang',
                'story' => 'Usaha kerajinan batik tulis dan cap dengan motif tradisional dan modern. Melayani pesanan seragam, kain, dan souvenir batik berkualitas tinggi.',
                'address' => 'Jl. Tirtodipuran No. 45, Yogyakarta',
                'phone' => '081987654321',
                'established_year' => 2015,
            ]
        );

        $umkm3 = UmkmProfile::firstOrCreate(
            ['email' => 'oleholejogja@gmail.com'],
            [
                'name' => 'Toko Oleh-oleh Jogja',
                'owner_name' => 'Ibu Ratna',
                'story' => 'Pusat oleh-oleh khas Yogyakarta dengan berbagai pilihan makanan ringan, kerajinan, dan souvenir. Harga terjangkau dengan kualitas terbaik.',
                'address' => 'Jl. Prawirotaman No. 67, Yogyakarta',
                'phone' => '081122334455',
                'established_year' => 2018,
            ]
        );

        // Create or find products for UMKM 1 (Gudeg)
        $product1 = Product::firstOrCreate(
            [
                'umkm_id' => $umkm1->id,
                'name' => 'Paket Gudeg Komplit'
            ],
            [
                'description' => 'Paket gudeg lengkap dengan nasi, ayam, telur, tahu, tempe, dan sambal krecek. Porsi untuk 1 orang dengan cita rasa autentik.',
                'history' => 'Resep turun temurun dari nenek moyang yang telah diwariskan selama puluhan tahun.',
                'philosophy' => 'Menyajikan makanan dengan cinta dan kehangatan keluarga.',
                'status' => 'active',
            ]
        );

        $product2 = Product::firstOrCreate(
            [
                'umkm_id' => $umkm1->id,
                'name' => 'Gudeg Kaleng Bu Sari'
            ],
            [
                'description' => 'Gudeg dalam kemasan kaleng praktis, tahan lama, cocok untuk oleh-oleh. Rasa sama enaknya dengan gudeg segar.',
                'history' => 'Inovasi kemasan untuk memudahkan pelanggan membawa oleh-oleh khas Yogyakarta.',
                'philosophy' => 'Mempertahankan cita rasa tradisional dalam kemasan modern.',
                'status' => 'active',
            ]
        );

        // Create or find products for UMKM 2 (Batik)
        $product3 = Product::firstOrCreate(
            [
                'umkm_id' => $umkm2->id,
                'name' => 'Kain Batik Tulis Motif Parang'
            ],
            [
                'description' => 'Kain batik tulis premium dengan motif parang klasik. Ukuran 2.5 meter, cocok untuk bahan kemeja atau dress.',
                'history' => 'Motif parang merupakan salah satu motif tertua dalam budaya Jawa yang melambangkan kekuatan.',
                'philosophy' => 'Melestarikan warisan budaya melalui karya seni batik berkualitas tinggi.',
                'status' => 'active',
            ]
        );

        $product4 = Product::firstOrCreate(
            [
                'umkm_id' => $umkm2->id,
                'name' => 'Kemeja Batik Pria Motif Kawung'
            ],
            [
                'description' => 'Kemeja batik pria dengan motif kawung, bahan katun halus, tersedia ukuran M, L, XL. Cocok untuk acara formal maupun casual.',
                'history' => 'Motif kawung terinspirasi dari buah aren yang melambangkan kesucian dan kebijaksanaan.',
                'philosophy' => 'Menghadirkan busana tradisional yang tetap relevan di era modern.',
                'status' => 'active',
            ]
        );

        // Create or find products for UMKM 3 (Oleh-oleh)
        $product5 = Product::firstOrCreate(
            [
                'umkm_id' => $umkm3->id,
                'name' => 'Bakpia Pathok 25'
            ],
            [
                'description' => 'Bakpia khas Yogyakarta dengan isian kacang hijau, coklat, dan keju. Kemasan isi 20 buah, cocok untuk oleh-oleh.',
                'history' => 'Bakpia Pathok telah menjadi ikon kuliner Yogyakarta sejak tahun 1948.',
                'philosophy' => 'Mempertahankan resep asli dengan sentuhan inovasi rasa modern.',
                'status' => 'active',
            ]
        );

        $product6 = Product::firstOrCreate(
            [
                'umkm_id' => $umkm3->id,
                'name' => 'Geplak Bantul'
            ],
            [
                'description' => 'Geplak tradisional dari Bantul dengan rasa kelapa murni. Kemasan kotak isi 15 potong, manis dan legit.',
                'history' => 'Geplak merupakan makanan tradisional Bantul yang terbuat dari kelapa dan gula aren.',
                'philosophy' => 'Melestarikan cita rasa tradisional dengan bahan-bahan alami pilihan.',
                'status' => 'inactive',
            ]
        );

        // Create sample reviews
        Review::create([
            'product_id' => $product1->id,
            'customer_name' => 'Budi Santoso',
            'rating' => 5,
            'comment' => 'Gudegnya enak banget! Rasanya autentik dan porsinya pas. Pasti akan pesan lagi.',
            'status' => 'approved',
        ]);

        Review::create([
            'product_id' => $product1->id,
            'customer_name' => 'Siti Nurhaliza',
            'rating' => 4,
            'comment' => 'Rasa gudegnya mantap, cuma agak kemanisan sedikit. Overall recommended!',
            'status' => 'approved',
        ]);

        Review::create([
            'product_id' => $product3->id,
            'customer_name' => 'Ahmad Wijaya',
            'rating' => 5,
            'comment' => 'Kualitas batiknya sangat bagus, motifnya halus dan warnanya tidak luntur. Puas dengan pembelian ini.',
            'status' => 'approved',
        ]);

        Review::create([
            'product_id' => $product4->id,
            'customer_name' => 'Rina Kusuma',
            'rating' => 4,
            'comment' => 'Kemeja batiknya bagus dan nyaman dipakai. Ukurannya pas dan bahannya adem.',
            'status' => 'pending',
        ]);

        Review::create([
            'product_id' => $product5->id,
            'customer_name' => 'Dedi Kurniawan',
            'rating' => 3,
            'comment' => 'Bakpianya lumayan enak, tapi agak kering. Mungkin bisa diperbaiki lagi.',
            'status' => 'pending',
        ]);

        Review::create([
            'product_id' => $product2->id,
            'customer_name' => 'Maya Sari',
            'rating' => 2,
            'comment' => 'Gudeg kalengnya kurang enak, rasanya beda dengan yang segar. Tidak recommended.',
            'status' => 'rejected',
        ]);

        $this->command->info('Sample data seeded successfully!');
        $this->command->info('Admin login: admin@wardig.com / password');
        $this->command->info('User login: john@example.com / password');
        $this->command->info('User login: jane@example.com / password');
    }
}