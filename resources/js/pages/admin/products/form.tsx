import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Upload, 
    X, 
    Image as ImageIcon, 
    Video, 
    Package,
    AlertCircle,
    Check,
    Star
} from 'lucide-react';

interface UmkmProfile {
    id: number;
    name: string;
    status: string;
}

interface ProductImage {
    id?: number;
    image_path: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    unique_code: string;
    status: string;
    video_path: string | null;
    umkm_profile_id: number;
    images: ProductImage[];
}

interface Props {
    product?: Product;
    umkmProfiles: UmkmProfile[];
}

export default function ProductForm({ product, umkmProfiles }: Props) {
    const isEdit = !!product;
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        product?.images.map(img => `/storage/${img.image_path}`) || []
    );
    const [videoPreviews, setVideoPreviews] = useState<string>(
        product?.video_path ? `/storage/${product.video_path}` : ''
    );
    const [primaryImageIndex, setPrimaryImageIndex] = useState(
        product?.images.findIndex(img => img.is_primary) || 0
    );

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        umkm_profile_id: product?.umkm_profile_id || '',
        status: product?.status || 'active',
        images: [] as File[],
        video: null as File | null,
        primary_image_index: primaryImageIndex,
        _method: isEdit ? 'PUT' : 'POST'
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            alert('Some files were skipped. Please ensure all files are images under 5MB.');
        }

        const newImageFiles = [...imageFiles, ...validFiles];
        const newPreviews = [...imagePreviews];

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string);
                setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });

        setImageFiles(newImageFiles);
        setData('images', newImageFiles);
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('video/')) {
            alert('Please select a valid video file.');
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB
            alert('Video file size must be under 50MB.');
            return;
        }

        setVideoFile(file);
        setData('video', file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setVideoPreviews(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (index: number) => {
        const newImageFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setImageFiles(newImageFiles);
        setImagePreviews(newPreviews);
        setData('images', newImageFiles);

        // Adjust primary image index if necessary
        if (primaryImageIndex >= newPreviews.length && newPreviews.length > 0) {
            setPrimaryImageIndex(0);
            setData('primary_image_index', 0);
        } else if (primaryImageIndex > index) {
            setPrimaryImageIndex(primaryImageIndex - 1);
            setData('primary_image_index', primaryImageIndex - 1);
        }
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreviews('');
        setData('video', null);
    };

    const setPrimaryImage = (index: number) => {
        setPrimaryImageIndex(index);
        setData('primary_image_index', index);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            put(route('admin.products.update', product.id));
        } else {
            post(route('admin.products.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? `Edit Product: ${product.name}` : 'Create Product'} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEdit ? 'Edit Product' : 'Create Product'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isEdit ? 'Update product information and media' : 'Add a new product to the catalog'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>
                                        Enter the basic details about the product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter product name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the product..."
                                            rows={4}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price (Rp)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0"
                                                min="0"
                                                step="1000"
                                                className={errors.price ? 'border-red-500' : ''}
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="umkm_profile_id">UMKM Profile</Label>
                                            <Select
                                                value={data.umkm_profile_id.toString()}
                                                onValueChange={(value) => setData('umkm_profile_id', parseInt(value))}
                                            >
                                                <SelectTrigger className={errors.umkm_profile_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select UMKM Profile" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {umkmProfiles.map((umkm) => (
                                                        <SelectItem key={umkm.id} value={umkm.id.toString()}>
                                                            <div className="flex items-center space-x-2">
                                                                <span>{umkm.name}</span>
                                                                <Badge 
                                                                    variant={umkm.status === 'active' ? 'default' : 'secondary'}
                                                                    className="text-xs"
                                                                >
                                                                    {umkm.status}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.umkm_profile_id && (
                                                <p className="text-sm text-red-600 mt-1">{errors.umkm_profile_id}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Product Images */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Images</CardTitle>
                                    <CardDescription>
                                        Upload product images. The first image will be used as the primary image.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="images">Upload Images</Label>
                                        <div className="mt-2">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB each)</p>
                                                </div>
                                                <input
                                                    id="images"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {errors.images && (
                                            <p className="text-sm text-red-600 mt-1">{errors.images}</p>
                                        )}
                                    </div>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => setPrimaryImage(index)}
                                                            className={primaryImageIndex === index ? 'bg-blue-600 text-white' : ''}
                                                        >
                                                            <Star className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    {primaryImageIndex === index && (
                                                        <Badge className="absolute top-2 left-2 bg-blue-600">
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Product Video */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Video</CardTitle>
                                    <CardDescription>
                                        Upload a video to showcase your product (optional)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {!videoPreviews ? (
                                        <div>
                                            <Label htmlFor="video">Upload Video</Label>
                                            <div className="mt-2">
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Video className="w-8 h-8 mb-2 text-gray-500" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> video
                                                        </p>
                                                        <p className="text-xs text-gray-500">MP4, AVI, MOV (MAX. 50MB)</p>
                                                    </div>
                                                    <input
                                                        id="video"
                                                        type="file"
                                                        accept="video/*"
                                                        onChange={handleVideoUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <video
                                                src={videoPreviews}
                                                controls
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                className="absolute top-2 right-2"
                                                onClick={removeVideo}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {errors.video && (
                                        <p className="text-sm text-red-600 mt-1">{errors.video}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                {isEdit ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                {isEdit ? 'Update Product' : 'Create Product'}
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Product Info */}
                            {isEdit && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Unique Code</Label>
                                            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                                                {product.unique_code}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">QR Code</Label>
                                            <div className="mt-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => window.open(`/admin/products/${product.id}/qr-code`, '_blank')}
                                                >
                                                    View QR Code
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Help */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tips</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            <ul className="space-y-1 mt-2">
                                                <li>• Use high-quality images for better presentation</li>
                                                <li>• The first image will be the primary image</li>
                                                <li>• Videos help customers understand your product better</li>
                                                <li>• Write detailed descriptions to attract customers</li>
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}