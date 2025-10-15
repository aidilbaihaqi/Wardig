import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Package, 
    QrCode, 
    Eye,
    Store,
    Star,
    Download,
    RefreshCw
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    unique_code: string;
    qr_code_path: string | null;
    status: 'active' | 'inactive';
    umkm_profile: {
        id: number;
        name: string;
    };
    images: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
    }>;
    reviews_count: number;
    average_rating: number;
    created_at: string;
}

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    umkm_profiles: Array<{
        id: number;
        name: string;
    }>;
    filters: {
        search?: string;
        status?: string;
        umkm_id?: string;
    };
}

export default function ProductsIndex({ products, umkm_profiles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [umkmId, setUmkmId] = useState(filters.umkm_id || '');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: Product | null }>({
        open: false,
        product: null
    });

    const handleFilter = () => {
        router.get('/admin/products', { 
            search: search || undefined, 
            status: status || undefined,
            umkm_id: umkmId || undefined
        }, { preserveState: true });
    };

    const handleDelete = (product: Product) => {
        setDeleteDialog({ open: true, product });
    };

    const confirmDelete = () => {
        if (deleteDialog.product) {
            router.delete(`/admin/products/${deleteDialog.product.id}`, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, product: null });
                }
            });
        }
    };

    const regenerateQrCode = (productId: number) => {
        router.post(`/admin/products/${productId}/regenerate-qr`, {}, {
            preserveScroll: true
        });
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
        ) : (
            <Badge variant="secondary">Inactive</Badge>
        );
    };

    const getPrimaryImage = (images: Product['images']) => {
        return images.find(img => img.is_primary) || images[0];
    };

    return (
        <AppLayout>
            <Head title="Product Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                        <p className="text-gray-600 mt-1">
                            Manage products and their QR codes
                        </p>
                    </div>
                    <Link href="/admin/products/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={umkmId} onValueChange={setUmkmId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All UMKM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All UMKM</SelectItem>
                                    {umkm_profiles.map((umkm) => (
                                        <SelectItem key={umkm.id} value={umkm.id.toString()}>
                                            {umkm.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter} variant="outline">
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <Package className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{products.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <Eye className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Products</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {products.data.filter(p => p.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <QrCode className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">QR Codes</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {products.data.filter(p => p.qr_code_path).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <Star className="h-8 w-8 text-yellow-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {products.data.reduce((sum, p) => sum + p.reviews_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.data.map((product) => {
                        const primaryImage = getPrimaryImage(product.images);
                        return (
                            <Card key={product.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            {primaryImage ? (
                                                <img
                                                    src={`/storage/${primaryImage.image_path}`}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {getStatusBadge(product.status)}
                                                    <Badge variant="outline" className="text-xs">
                                                        <Store className="w-3 h-3 mr-1" />
                                                        {product.umkm_profile.name}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDelete(product)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mb-4">
                                        {product.description.length > 100 
                                            ? `${product.description.substring(0, 100)}...` 
                                            : product.description
                                        }
                                    </CardDescription>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Price:</span>
                                            <span className="font-semibold text-green-600">
                                                Rp {product.price.toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Reviews:</span>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">
                                                    {product.average_rating.toFixed(1)} ({product.reviews_count})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">QR Code:</span>
                                            <div className="flex items-center space-x-2">
                                                {product.qr_code_path ? (
                                                    <>
                                                        <a 
                                                            href={`/storage/${product.qr_code_path}`}
                                                            download={`${product.name}-qr.png`}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => regenerateQrCode(product.id)}
                                                            className="text-gray-600 hover:text-gray-700"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => regenerateQrCode(product.id)}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">
                                        Code: {product.unique_code} • Created: {new Date(product.created_at).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === products.current_page ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.get('/admin/products', { ...filters, page })}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {products.data.length === 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-6">
                                    {filters.search || filters.status || filters.umkm_id
                                        ? "No products match your search criteria." 
                                        : "Get started by adding your first product."
                                    }
                                </p>
                                <Link href="/admin/products/create">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Product
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, product: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteDialog.product?.name}"? This action cannot be undone.
                            All associated reviews and QR codes will also be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialog({ open: false, product: null })}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}