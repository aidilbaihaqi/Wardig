import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    price: number;
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
        reviewer_name: string;
        created_at: string;
        images: Array<{
            id: number;
            image_path: string;
        }>;
    }>;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const averageRating = product.approvedReviews.length > 0 
        ? product.approvedReviews.reduce((sum, review) => sum + review.rating, 0) / product.approvedReviews.length 
        : 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const shareProduct = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} from ${product.umkmProfile.name}`,
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
        ? product.approvedReviews 
        : product.approvedReviews.slice(0, 3);

    return (
        <>
            <Head title={`${product.name} - ${product.umkmProfile.name}`} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {product.umkmProfile.logo_path ? (
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
                                    <h1 className="font-semibold text-gray-900">{product.umkmProfile.name}</h1>
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
                                {product.images.length > 0 ? (
                                    <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                                        <img
                                            src={`/storage/${product.images[currentImageIndex].image_path}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {product.images.length > 1 && (
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
                                                    {product.images.map((_, index) => (
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
                                                poster={product.images[0] ? `/storage/${product.images[0].image_path}` : undefined}
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
                                            <span className="text-gray-600">({product.approvedReviews.length} reviews)</span>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">
                                            Rp {product.price.toLocaleString()}
                                        </Badge>
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
                                About {product.umkmProfile.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700">{product.umkmProfile.description}</p>
                            
                            <Separator />
                            
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-3" />
                                    <span className="text-sm">{product.umkmProfile.address}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-3" />
                                    <a href={`tel:${product.umkmProfile.phone}`} className="text-sm hover:text-blue-600">
                                        {product.umkmProfile.phone}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-3" />
                                    <a href={`mailto:${product.umkmProfile.email}`} className="text-sm hover:text-blue-600">
                                        {product.umkmProfile.email}
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews */}
                    {product.approvedReviews.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Customer Reviews</span>
                                    <Badge variant="outline">{product.approvedReviews.length} reviews</Badge>
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
                                                    <p className="font-medium text-gray-900">{review.reviewer_name}</p>
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
                                        
                                        {review.images.length > 0 && (
                                            <div className="flex space-x-2 ml-13">
                                                {review.images.map((image) => (
                                                    <img
                                                        key={image.id}
                                                        src={`/storage/${image.image_path}`}
                                                        alt="Review"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        
                                        <Separator />
                                    </div>
                                ))}
                                
                                {product.approvedReviews.length > 3 && !showAllReviews && (
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => setShowAllReviews(true)}
                                    >
                                        Show All Reviews ({product.approvedReviews.length})
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

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