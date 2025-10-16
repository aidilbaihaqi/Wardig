import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

interface ProductImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

interface Product {
  name: string;
  unique_code: string;
  history?: string;
  philosophy?: string;
  images: ProductImage[];
  umkmProfile?: {
    name: string;
    logo_path: string | null;
  };
}

interface Props {
  product: Product;
}

export default function ProductStory({ product }: Props) {
  const processImages = product.images.filter((img) => !img.is_primary);

  return (
    <>
      <Head title={`Product Story - ${product.name}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Header sederhana */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              {product.umkmProfile?.logo_path ? (
                <img
                  src={`/storage/${product.umkmProfile.logo_path}`}
                  alt={product.umkmProfile.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-gray-900">Product Story</h1>
                <p className="text-sm text-gray-600">{product.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Navigasi kembali */}
          <div className="flex justify-between items-center">
            <Link href={`/product/${product.unique_code}`}>
              <Button variant="outline">Kembali ke Product Landing</Button>
            </Link>
          </div>

          {/* Sejarah produk */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sejarah Produk</CardTitle>
              <CardDescription>Kisah latar belakang dan perjalanan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.history || 'Sejarah produk belum tersedia.'}
              </p>
            </CardContent>
          </Card>

          {/* Proses pembuatan (step-by-step) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Proses Pembuatan</CardTitle>
              <CardDescription>Langkah-langkah pembuatan secara ringkas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Konten proses step-by-step belum tersedia.
              </p>
            </CardContent>
          </Card>

          {/* Filosofi & nilai budaya */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Filosofi & Nilai Budaya</CardTitle>
              <CardDescription>Makna di balik produk</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.philosophy || 'Filosofi produk belum tersedia.'}
              </p>
            </CardContent>
          </Card>

          {/* Galeri foto proses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Galeri Proses</CardTitle>
              <CardDescription>Foto di balik pembuatan</CardDescription>
            </CardHeader>
            <CardContent>
              {processImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {processImages.map((img) => (
                    <img
                      key={img.id}
                      src={`/storage/${img.image_path}`}
                      alt="Proses"
                      className="w-full h-32 sm:h-40 rounded-lg object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Belum ada foto proses.</p>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">
              Powered by <span className="font-semibold text-blue-600">Wardig</span>
            </p>
            <p className="text-xs mt-1">Scan QR codes to discover amazing local products</p>
          </div>
        </div>
      </div>
    </>
  );
}