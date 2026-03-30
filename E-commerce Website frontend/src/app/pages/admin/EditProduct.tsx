import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Upload, Plus, X, Trash2 } from 'lucide-react';
import { productsApi } from '../../lib/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();

  // Fallback: Check localStorage directly if context token is missing
  const token = contextToken || localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    inStock: true,
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
  });

  const [images, setImages] = useState<string[]>([]);

  const categories = [
    'Guitars',
    'Pianos & Keyboards',
    'Drums & Percussion',
    'Audio Equipment',
    'Studio Gear',
    'Accessories',
  ];

  useEffect(() => {
    if (id) loadProduct(id);
    else {
        toast.error("Product ID is missing");
        navigate('/admin/products');
    }
  }, [id, navigate]);

  const loadProduct = async (id: string) => {
    try {
      const res = await productsApi.getById(id);
      const data = res.data;

      setProduct(data);
      setImages(data.images || []); 

      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        originalPrice: data.original_price?.toString() || '',
        category: data.category || '',
        brand: data.brand || '',
        stock: data.stock?.toString() || '',
        inStock: data.in_stock,
        isBestSeller: data.is_best_seller,
        isNewArrival: data.is_new_arrival,
        isFeatured: data.is_featured,
      });
    } catch (err) {
      toast.error('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if ID exists
    if (!id) {
        toast.error("Product ID is missing");
        return;
    }

    // Check if token exists
    if (!token) {
        console.error("Token is missing in EditProduct");
        toast.error("Authentication token missing");
        return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock) || 0,
        in_stock: formData.inStock,
        is_best_seller: formData.isBestSeller,
        is_new_arrival: formData.isNewArrival,
        is_featured: formData.isFeatured,
        images: images
      };

      console.log('Submitting payload:', payload);
      console.log('Using token:', token ? 'Present' : 'Missing');

      await productsApi.update(id, payload, token);

      toast.success('Product updated successfully');
      navigate('/admin/products');

    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    // Check if ID exists
    if (!id) {
        toast.error("Product ID is missing");
        return;
    }

    // Check if token exists
    if (!token) {
        console.error("Token is missing in EditProduct Delete");
        toast.error("Authentication token missing");
        return;
    }

    try {
      await productsApi.delete(id, token);

      toast.success('Product deleted successfully');
      navigate('/admin/products');

    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
      console.error('Delete error:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      const files = Array.from(e.target.files);
      
      const newImages = await Promise.all(
        files.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      setImages([...images, ...newImages]);
      setUploading(false);
    }
  };

  const removeImage = (imageToRemove: string) => {
    setImages(images.filter(img => img !== imageToRemove));
  };

  if (loading) return <LoadingSpinner />;

  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete Product
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>Set pricing and stock information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inStock">In Stock</Label>
                <p className="text-sm text-muted-foreground">Product is available for purchase</p>
              </div>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Flags */}
        <Card>
          <CardHeader>
            <CardTitle>Product Flags</CardTitle>
            <CardDescription>Special product indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isBestSeller">Best Seller</Label>
                <p className="text-sm text-muted-foreground">Mark as a best-selling product</p>
              </div>
              <Switch
                id="isBestSeller"
                checked={formData.isBestSeller}
                onCheckedChange={(checked) => setFormData({ ...formData, isBestSeller: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isNewArrival">New Arrival</Label>
                <p className="text-sm text-muted-foreground">Mark as a new arrival</p>
              </div>
              <Switch
                id="isNewArrival"
                checked={formData.isNewArrival}
                onCheckedChange={(checked) => setFormData({ ...formData, isNewArrival: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured</Label>
                <p className="text-sm text-muted-foreground">Display on homepage</p>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Product images (up to 5 images)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors">
                    <Upload className="size-4" />
                    <span>Upload Images</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </Label>
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={img} alt={`Product image ${i + 1}`} className="w-full h-full object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
