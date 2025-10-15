import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, QrCode, ArrowRight, Home } from 'lucide-react';

interface UmkmProfile {
  id?: number;
  name?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  unique_code: string;
  umkmProfile?: UmkmProfile;
}

interface Props {
  product: Product;
}

export default function ScanSuccess({ product }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Scan Berhasil" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            Scan Berhasil
          </h1>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
            <Home className="w-4 h-4 mr-1" /> Beranda
          </Link>
        </div>

        <Card className="rounded-2xl border border-blue-100 shadow-xl bg-white dark:bg-neutral-900 dark:border-blue-900/40">
          <CardHeader className="rounded-t-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-cyan-900/20 border-b">
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <QrCode className="w-5 h-5 mr-2 text-blue-600" />
              Produk Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">UMKM</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.umkmProfile?.name ?? 'UMKM'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Produk</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</p>
                {product.description && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 line-clamp-3">{product.description}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link href={`/product/${product.unique_code}`} className="inline-flex">
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                    Lihat Halaman Produk
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/scan" className="inline-flex">
                  <Button variant="outline" className="bg-white text-gray-900 border-blue-200 hover:bg-blue-50 dark:bg-white dark:text-gray-900">Scan Lagi</Button>
                </Link>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Kode unik: <span className="font-mono">{product.unique_code}</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          Powered by Wardig • Scan untuk temukan produk lokal terbaik
        </div>
      </div>
    </div>
  );
}