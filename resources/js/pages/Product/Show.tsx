import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
    Star, 
    MapPin, 
    Phone, 
    Mail, 
    Store, 
    Package,
    Calendar,
    User,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price?: number;
    unique_code: string;
    status: string;
    video_path: string | null;
    umkmProfile: {
        id: number;
        name: string;
        description: string;
        address: string;
        phone: string;
        email: string;
        logo_path: string | null;
    };
    images: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
    }>;
    approvedReviews: Array<{
        id: number;
        rating: number;
        comment: string;
        customer_name: string;
        created_at: string;
        review_images?: string[];
    }>;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        rating: 5,
        comment: '',
        review_images: [] as File[],
    });

    // Safeguards for possible snake_cased keys from Laravel JSON
    const images = (product as any).images ?? [];
    const approvedReviews = (product as any).approvedReviews ?? (product as any).approved_reviews ?? [];

    const averageRating = approvedReviews.length > 0 
        ? approvedReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / approvedReviews.length 
        : 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

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

    const shareProduct = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} from ${product.umkmProfile?.name ?? 'UMKM'}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const displayedReviews = showAllReviews 
        ? approvedReviews 
        : approvedReviews.slice(0, 3);

    return (
        <>
            <Head title={`${product.name} - ${product.umkmProfile?.name ?? 'UMKM'}`} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {product.umkmProfile?.logo_path ? (
                                    <img
                                        src={`/storage/${product.umkmProfile?.logo_path}`}
                                        alt={product.umkmProfile?.name ?? 'UMKM'}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Store className="w-5 h-5 text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="font-semibold text-gray-900">{product.umkmProfile?.name ?? 'UMKM'}</h1>
                                    <p className="text-sm text-gray-600">UMKM Profile</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={shareProduct}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                    {/* Product Images/Video */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative">
                                {images.length > 0 ? (
                                    <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                                        <img
                                            src={`/storage/${images[currentImageIndex].image_path}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {images.length > 1 && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                                    onClick={prevImage}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                                    onClick={nextImage}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                                
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                    {images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            className={`w-2 h-2 rounded-full ${
                                                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                            }`}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}

                                {/* Video Section */}
                                {product.video_path && (
                                    <div className="p-4 border-t">
                                        <h3 className="font-medium text-gray-900 mb-3">Product Video</h3>
                                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                            <video
                                                className="w-full h-full"
                                                controls
                                                poster={images[0] ? `/storage/${images[0].image_path}` : undefined}
                                            >
                                                <source src={`/storage/${product.video_path}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                                <span className="font-medium">{averageRating.toFixed(1)}</span>
                                                <span className="text-gray-600">({approvedReviews.length} reviews)</span>
                                            </div>
                                        {typeof product.price === 'number' && (
                                            <Badge className="bg-green-100 text-green-800">
                                                Rp {product.price.toLocaleString()}
                                            </Badge>
                                        )}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Heart className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-base leading-relaxed">
                                {product.description}
                            </CardDescription>
                        </CardContent>
                    </Card>

                    {/* UMKM Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Store className="w-5 h-5 mr-2 text-blue-600" />
                                About {product.umkmProfile?.name ?? 'UMKM'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700">{product.umkmProfile?.description ?? 'Belum ada deskripsi untuk UMKM ini.'}</p>
                            
                            <Separator />
                            
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-3" />
                                    <span className="text-sm">{product.umkmProfile?.address ?? 'Alamat tidak tersedia'}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-3" />
                                    <a href={product.umkmProfile?.phone ? `tel:${product.umkmProfile.phone}` : undefined} className="text-sm hover:text-blue-600">
                                        {product.umkmProfile?.phone ?? 'Telepon tidak tersedia'}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-3" />
                                    <a href={product.umkmProfile?.email ? `mailto:${product.umkmProfile.email}` : undefined} className="text-sm hover:text-blue-600">
                                        {product.umkmProfile?.email ?? 'Email tidak tersedia'}
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews */}
                    {approvedReviews.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Customer Reviews</span>
                                    <Badge variant="outline">{approvedReviews.length} reviews</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {displayedReviews.map((review) => (
                                    <div key={review.id} className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{review.customer_name}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center">
                                                            {Array.from({ length: 5 }, (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${
                                                                        i < review.rating 
                                                                            ? 'text-yellow-500 fill-current' 
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-700 ml-13">{review.comment}</p>
                                        
                                        {Array.isArray(review.review_images) && review.review_images.length > 0 && (
                                            <div className="flex space-x-2 ml-13">
                                                {review.review_images.map((imagePath, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={`/storage/${imagePath}`}
                                                        alt="Review"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        
                                        <Separator />
                                    </div>
                                ))}
                                
                                {approvedReviews.length > 3 && !showAllReviews && (
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => setShowAllReviews(true)}
                                    >
                                        Show All Reviews ({approvedReviews.length})
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Add Review Form */}
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
                                                type="button"
                                                key={i}
                                                onClick={() => setData('rating', i + 1)}
                                                className="p-1"
                                                aria-label={`Pilih rating ${i + 1}`}
                                            >
                                                <Star className={`w-5 h-5 ${i < data.rating ? 'text-amber-500' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    {errors.rating && (
                                        <p className="text-xs text-red-600">{errors.rating}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Komentar</label>
                                    <Textarea
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        placeholder="Tulis komentar Anda"
                                        rows={4}
                                    />
                                    {errors.comment && (
                                        <p className="text-xs text-red-600">{errors.comment}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Foto (opsional)</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => onSelectImages(e.target.files)}
                                        className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    {errors.review_images && (
                                        <p className="text-xs text-red-600">{errors.review_images}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button type="submit" disabled={processing}>
                                        Kirim Review
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
                        <p className="text-xs mt-1">
                            Scan QR codes to discover amazing local products
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}