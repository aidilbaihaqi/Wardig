import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    Store, 
    MapPin, 
    Phone,
    Mail,
    Eye,
    Package
} from 'lucide-react';

interface UmkmProfile {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logo_path: string | null;
    status: 'active' | 'inactive';
    products_count: number;
    created_at: string;
}

interface Props {
    umkm_profiles: {
        data: UmkmProfile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function UmkmIndex({ umkm_profiles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; umkm: UmkmProfile | null }>({
        open: false,
        umkm: null
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/umkm', { search }, { preserveState: true });
    };

    const handleDelete = (umkm: UmkmProfile) => {
        setDeleteDialog({ open: true, umkm });
    };

    const confirmDelete = () => {
        if (deleteDialog.umkm) {
            router.delete(`/admin/umkm/${deleteDialog.umkm.id}`, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, umkm: null });
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
        ) : (
            <Badge variant="secondary">Inactive</Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="UMKM Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">UMKM Management</h1>
                        <p className="text-gray-600 mt-1">
                            Manage UMKM profiles and their information
                        </p>
                    </div>
                    <Link href="/admin/umkm/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add UMKM
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search UMKM by name, email, or address..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" variant="outline">
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <Store className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total UMKM</p>
                                    <p className="text-2xl font-bold text-gray-900">{umkm_profiles.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <Package className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {umkm_profiles.data.reduce((sum, umkm) => sum + umkm.products_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <Eye className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active UMKM</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {umkm_profiles.data.filter(umkm => umkm.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* UMKM List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {umkm_profiles.data.map((umkm) => (
                        <Card key={umkm.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        {umkm.logo_path ? (
                                            <img
                                                src={`/storage/${umkm.logo_path}`}
                                                alt={umkm.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Store className="w-6 h-6 text-blue-600" />
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-lg">{umkm.name}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {getStatusBadge(umkm.status)}
                                                <Badge variant="outline">
                                                    {umkm.products_count} products
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link href={`/admin/umkm/${umkm.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/umkm/${umkm.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleDelete(umkm)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">
                                    {umkm.description.length > 100 
                                        ? `${umkm.description.substring(0, 100)}...` 
                                        : umkm.description
                                    }
                                </CardDescription>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="truncate">{umkm.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span>{umkm.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="truncate">{umkm.email}</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-xs text-gray-500">
                                    Created: {new Date(umkm.created_at).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {umkm_profiles.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {Array.from({ length: umkm_profiles.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === umkm_profiles.current_page ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.get('/admin/umkm', { ...filters, page })}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {umkm_profiles.data.length === 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No UMKM found</h3>
                                <p className="text-gray-600 mb-6">
                                    {filters.search 
                                        ? "No UMKM profiles match your search criteria." 
                                        : "Get started by adding your first UMKM profile."
                                    }
                                </p>
                                <Link href="/admin/umkm/create">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First UMKM
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, umkm: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete UMKM Profile</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteDialog.umkm?.name}"? This action cannot be undone.
                            All associated products will also be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialog({ open: false, umkm: null })}
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