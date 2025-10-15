import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Store } from 'lucide-react';

interface OtherProduct {
  id: number;
  name: string;
  unique_code: string;
}

interface UmkmProfile {
  name: string;
  owner_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  established_year?: number | string | null;
  story?: string;
  logo_path?: string | null;
  products?: OtherProduct[];
}

interface Product {
  name: string;
  unique_code: string;
  umkmProfile?: UmkmProfile;
}

interface Props {
  product: Product;
}

export default function MakerProfile({ product }: Props) {
  const maker = product.umkmProfile;

  return (
    <>
      <Head title={`Maker Profile - ${product.name}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              {maker?.logo_path ? (
                <img
                  src={`/storage/${maker.logo_path}`}
                  alt={maker.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-gray-900">Maker Profile</h1>
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

          {/* Profil UMKM */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profil UMKM</CardTitle>
              <CardDescription>Informasi pembuat produk</CardDescription>
            </CardHeader>
            <CardContent>
              {maker ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold text-gray-900">{maker.name}</h2>
                    {maker.owner_name && (
                      <p className="text-gray-700">Pemilik: {maker.owner_name}</p>
                    )}
                    {maker.established_year && (
                      <p className="text-gray-700">Berdiri: {maker.established_year}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {maker.address && (
                      <p className="text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{maker.address}</span>
                      </p>
                    )}
                    {maker.phone && (
                      <p className="text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{maker.phone}</span>
                      </p>
                    )}
                    {maker.email && (
                      <p className="text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{maker.email}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cerita di balik usaha</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {maker.story || 'Cerita usaha belum tersedia.'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Profil UMKM tidak tersedia.</p>
              )}
            </CardContent>
          </Card>

          {/* Produk lainnya */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Produk Lainnya</CardTitle>
              <CardDescription>Produk dari pembuat yang sama</CardDescription>
            </CardHeader>
            <CardContent>
              {maker?.products && maker.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {maker.products.map((p) => (
                    <Link key={p.id} href={`/product/${p.unique_code}`} className="block">
                      <div className="p-3 border rounded-lg hover:bg-gray-50">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">Kode: {p.unique_code}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Belum ada produk lainnya.</p>
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