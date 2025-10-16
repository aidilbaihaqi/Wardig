import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { 
    Star, 
    Search, 
    Filter, 
    Eye, 
    Edit, 
    Trash2, 
    Check, 
    X, 
    MessageSquare,
    User,
    Calendar,
    Store,
    CheckSquare,
    XSquare,
    
} from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    reviewer_name: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    product: {
        id: number;
        name: string;
        umkmProfile: {
            id: number;
            name: string;
        };
    };
    images: Array<{
        id: number;
        image_path: string;
    }>;
}

interface Props {
    reviews: {
        data: Review[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        rating?: string;
        product_id?: string;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        average_rating: number;
    };
}

export default function ReviewIndex({ reviews, filters, stats }: Props) {
    const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [ratingFilter, setRatingFilter] = useState(filters.rating || '');

    const handleSearch = () => {
        router.get(route('admin.reviews.index'), {
            search: searchTerm,
            status: statusFilter,
            rating: ratingFilter,
        }, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReviews(reviews.data.map(review => review.id));
        } else {
            setSelectedReviews([]);
        }
    };

    const handleSelectReview = (reviewId: number, checked: boolean) => {
        if (checked) {
            setSelectedReviews([...selectedReviews, reviewId]);
        } else {
            setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
        }
    };

    const handleApprove = (reviewId: number) => {
        router.post(route('admin.reviews.approve', reviewId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
            }
        });
    };

    const handleReject = (reviewId: number) => {
        router.post(route('admin.reviews.reject', reviewId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
            }
        });
    };

    const handleBulkApprove = () => {
        router.post(route('admin.reviews.bulk-approve'), {
            review_ids: selectedReviews
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedReviews([]);
            }
        });
    };

    const handleBulkReject = () => {
        router.post(route('admin.reviews.bulk-reject'), {
            review_ids: selectedReviews
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedReviews([]);
            }
        });
    };

    const handleDelete = (review: Review) => {
        setReviewToDelete(review);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (reviewToDelete) {
            router.delete(route('admin.reviews.destroy', reviewToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setReviewToDelete(null);
                    setSelectedReviews(selectedReviews.filter(id => id !== reviewToDelete.id));
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <AppLayout>
            <Head title="Review Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
                        <p className="text-gray-600 mt-2">Manage customer reviews and feedback</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <MessageSquare className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Check className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <X className="h-8 w-8 text-red-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-yellow-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Star className="h-8 w-8 text-yellow-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.average_rating.toFixed(1)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search reviews..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={ratingFilter} onValueChange={setRatingFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Ratings</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedReviews.length > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    {selectedReviews.length} review(s) selected
                                </span>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        onClick={handleBulkApprove}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckSquare className="w-4 h-4 mr-2" />
                                        Approve Selected
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleBulkReject}
                                    >
                                        <XSquare className="w-4 h-4 mr-2" />
                                        Reject Selected
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Reviews Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reviews</CardTitle>
                        <CardDescription>
                            Manage customer reviews and feedback for products
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedReviews.length === reviews.data.length && reviews.data.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Reviewer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.data.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedReviews.includes(review.id)}
                                                onCheckedChange={(checked) => 
                                                    handleSelectReview(review.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium">{review.reviewer_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{review.product.name}</p>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <Store className="w-3 h-3 mr-1" />
                                                    {review.product.umkmProfile.name}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                {renderStars(review.rating)}
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({review.rating}/5)
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="text-sm text-gray-900 truncate">
                                                    {review.comment}
                                                </p>
                                                {review.images.length > 0 && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {review.images.length} image(s) attached
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(review.status)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link href={route('admin.reviews.show', review.id)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                
                                                {review.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove(review.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleReject(review.id)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link href={route('admin.reviews.edit', review.id)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(review)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {reviews.data.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No reviews match your current filters.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {reviews.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {((reviews.current_page - 1) * reviews.per_page) + 1} to{' '}
                            {Math.min(reviews.current_page * reviews.per_page, reviews.total)} of{' '}
                            {reviews.total} results
                        </div>
                        <div className="flex space-x-2">
                            {Array.from({ length: reviews.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === reviews.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get(route('admin.reviews.index'), { 
                                        ...filters, 
                                        page 
                                    })}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this review from {reviewToDelete?.reviewer_name}? 
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}