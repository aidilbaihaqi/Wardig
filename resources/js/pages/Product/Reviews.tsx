import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  review_images?: string[] | null;
  created_at?: string;
}

interface Product {
  name: string;
  unique_code: string;
  approvedReviews: Review[];
}

interface Props {
  product: Product;
}

export default function ProductReviews({ product }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    customer_name: '',
    rating: 5,
    comment: '',
    review_images: [] as File[],
  });

  const onSelectImages = (files: FileList | null) => {
    if (!files) return;
    setData('review_images', Array.from(files));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/product/${product.unique_code}/reviews`, {
      forceFormData: true,
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <>
      <Head title={`Reviews - ${product.name}`} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Ulasan Pelanggan</h1>
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

          {/* Daftar ulasan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Customer Reviews</CardTitle>
              <CardDescription>Ulasan yang disetujui</CardDescription>
            </CardHeader>
            <CardContent>
              {product.approvedReviews && product.approvedReviews.length > 0 ? (
                <div className="space-y-4">
                  {product.approvedReviews.map((r) => (
                    <div key={r.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{r.customer_name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2 whitespace-pre-line">{r.comment}</p>
                      {r.review_images && r.review_images.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {r.review_images.map((img, idx) => (
                            <img
                              key={idx}
                              src={`/storage/${img}`}
                              alt="Review"
                              className="w-full h-24 sm:h-28 rounded-lg object-cover border"
                            />
                          ))}
                        </div>
                      )}
                      {r.created_at && (
                        <p className="text-xs text-gray-500 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Belum ada ulasan.</p>
              )}
            </CardContent>
          </Card>

          {/* Form tambah ulasan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tambah Review</CardTitle>
              <CardDescription>Nama, rating, komentar, dan foto (opsional)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nama</label>
                  <Input
                    value={data.customer_name}
                    onChange={(e) => setData('customer_name', e.target.value)}
                    placeholder="Nama Anda"
                  />
                  {errors.customer_name && (
                    <p className="text-xs text-red-600">{errors.customer_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setData('rating', i + 1)}
                        className="p-1"
                      >
                        <Star className={`w-6 h-6 ${i < data.rating ? 'text-amber-500' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <p className="text-xs text-red-600">{errors.rating}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Komentar</label>
                  <Textarea
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Tulis pengalaman Anda..."
                    rows={4}
                  />
                  {errors.comment && <p className="text-xs text-red-600">{errors.comment}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Foto (opsional)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onSelectImages(e.target.files)}
                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {errors.review_images && (
                    <p className="text-xs text-red-600">{errors.review_images}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={processing}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Kirim
                  </Button>
                  {processing && <p className="text-sm text-gray-500">Mengirim ulasan...</p>}
                </div>
              </form>
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