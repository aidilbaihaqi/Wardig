import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { 
    ArrowLeft, 
    Upload, 
    Store, 
    AlertCircle,
    X
} from 'lucide-react';

interface UmkmProfile {
    id?: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logo_path: string | null;
    status: 'active' | 'inactive';
}

interface Props {
    umkm?: UmkmProfile;
    errors: Record<string, string>;
}

export default function UmkmForm({ umkm, errors }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!umkm;

    const { data, setData, post, processing, reset } = useForm({
        name: umkm?.name || '',
        description: umkm?.description || '',
        address: umkm?.address || '',
        phone: umkm?.phone || '',
        email: umkm?.email || '',
        status: umkm?.status || 'active',
        logo: null as File | null,
        _method: isEditing ? 'PUT' : 'POST'
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('status', data.status);
        
        if (data.logo) {
            formData.append('logo', data.logo);
        }

        if (isEditing) {
            formData.append('_method', 'PUT');
            post(`/admin/umkm/${umkm.id}`, {
                data: formData,
                forceFormData: true,
            });
        } else {
            post('/admin/umkm', {
                data: formData,
                forceFormData: true,
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
        }
    };

    const removeFile = () => {
        setData('logo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout>
            <Head title={isEditing ? `Edit ${umkm.name}` : 'Add New UMKM'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href="/admin/umkm">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to UMKM
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditing ? `Edit ${umkm.name}` : 'Add New UMKM'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isEditing 
                                ? 'Update UMKM profile information' 
                                : 'Create a new UMKM profile for the platform'
                            }
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>
                                        Enter the basic details for the UMKM profile
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">UMKM Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter UMKM name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the UMKM business..."
                                            rows={4}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Address *</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Enter complete address..."
                                            rows={3}
                                            className={errors.address ? 'border-red-500' : ''}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+62 xxx xxxx xxxx"
                                                className={errors.phone ? 'border-red-500' : ''}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="contact@umkm.com"
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Logo</CardTitle>
                                    <CardDescription>
                                        Upload a logo for the UMKM (optional)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Current Logo */}
                                    {isEditing && umkm.logo_path && !data.logo && (
                                        <div className="space-y-2">
                                            <Label>Current Logo</Label>
                                            <div className="relative">
                                                <img
                                                    src={`/storage/${umkm.logo_path}`}
                                                    alt="Current logo"
                                                    className="w-32 h-32 object-cover rounded-lg border"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* New Logo Preview */}
                                    {data.logo && (
                                        <div className="space-y-2">
                                            <Label>New Logo Preview</Label>
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(data.logo)}
                                                    alt="Logo preview"
                                                    className="w-32 h-32 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                    onClick={removeFile}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {data.logo ? 'Change Logo' : 'Upload Logo'}
                                        </Button>
                                        {errors.logo && (
                                            <p className="text-sm text-red-600 mt-1">{errors.logo}</p>
                                        )}
                                    </div>

                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Recommended: Square image, max 2MB, formats: JPG, PNG, WebP
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <Button 
                                            type="submit" 
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            <Store className="w-4 h-4 mr-2" />
                                            {processing 
                                                ? (isEditing ? 'Updating...' : 'Creating...') 
                                                : (isEditing ? 'Update UMKM' : 'Create UMKM')
                                            }
                                        </Button>
                                        
                                        <Link href="/admin/umkm" className="block">
                                            <Button type="button" variant="outline" className="w-full">
                                                Cancel
                                            </Button>
                                        </Link>

                                        {isEditing && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                className="w-full text-gray-600"
                                                onClick={() => reset()}
                                            >
                                                Reset Form
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}