import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { 
    Package, 
    Store, 
    MessageSquare, 
    QrCode, 
    TrendingUp,
    Eye,
    Calendar,
    Activity,
    Clock
} from 'lucide-react';

interface DashboardStats {
    total_umkm: number;
    total_products: number;
    total_reviews: number;
    total_scans: number;
    pending_reviews: number;
    active_products: number;
}

interface RecentActivity {
    id: number;
    type: 'scan' | 'review';
    product_name: string;
    umkm_name: string;
    created_at: string;
    rating?: number;
}

interface ScanAnalytics {
    daily_scans: Array<{
        date: string;
        count: number;
    }>;
    top_products: Array<{
        name: string;
        scan_count: number;
    }>;
}

interface Props {
    stats: DashboardStats;
    recent_activities: RecentActivity[];
    scan_analytics: ScanAnalytics;
}

export default function AdminDashboard({ stats, recent_activities, scan_analytics }: Props) {
    const statCards = [
        {
            title: 'Total UMKM',
            value: stats.total_umkm,
            icon: Store,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Products',
            value: stats.total_products,
            icon: Package,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Active Products',
            value: stats.active_products,
            icon: Activity,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Total Reviews',
            value: stats.total_reviews,
            icon: MessageSquare,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Pending Reviews',
            value: stats.pending_reviews,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'QR Code Scans',
            value: stats.total_scans,
            icon: QrCode,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
    ];

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome to the Wardig admin panel. Monitor your platform's performance.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date().toLocaleDateString()}
                        </Badge>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <IconComponent className={`h-4 w-4 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stat.value.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                                Recent Activities
                            </CardTitle>
                            <CardDescription>
                                Latest QR scans and reviews from your platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_activities.length > 0 ? (
                                    recent_activities.map((activity) => (
                                        <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                                            <div className={`p-2 rounded-full ${
                                                activity.type === 'scan' ? 'bg-blue-100' : 'bg-purple-100'
                                            }`}>
                                                {activity.type === 'scan' ? (
                                                    <QrCode className={`w-4 h-4 ${
                                                        activity.type === 'scan' ? 'text-blue-600' : 'text-purple-600'
                                                    }`} />
                                                ) : (
                                                    <MessageSquare className="w-4 h-4 text-purple-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.product_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {activity.umkm_name} • {activity.type === 'scan' ? 'QR Scanned' : `Review ${activity.rating}★`}
                                                </p>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No recent activities</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products by Scans */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                                Top Products
                            </CardTitle>
                            <CardDescription>
                                Most scanned products this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {scan_analytics.top_products.length > 0 ? (
                                    scan_analytics.top_products.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">
                                                    {product.scan_count}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No scan data available</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-200"
                                onClick={() => window.location.href = '/admin/umkm/create'}
                            >
                                <Store className="w-6 h-6 text-blue-600" />
                                <span className="text-sm font-medium">Add UMKM</span>
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-50 hover:border-green-200"
                                onClick={() => window.location.href = '/admin/products/create'}
                    >
                        <Package className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-medium">Add Product</span>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-200"
                        onClick={() => window.location.href = '/admin/reviews'}
                    >
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                        <span className="text-sm font-medium">Manage Reviews</span>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-indigo-50 hover:border-indigo-200"
                        onClick={() => window.location.href = '/admin/products'}
                            >
                                <QrCode className="w-6 h-6 text-indigo-600" />
                                <span className="text-sm font-medium">QR Codes</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}