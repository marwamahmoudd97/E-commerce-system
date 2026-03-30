import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { productsApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function AddProduct() {
  const navigate = useNavigate();
  // We still destructure token for UI checks if needed, 
  // but API calls will use the token from api.ts automatically
  const { token } = useAuth();
  
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
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  const categories = [
    'Guitars',
    'Pianos & Keyboards',
    'Drums & Percussion',
    'Audio Equipment',
    'Studio Gear',
    'Accessories',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate required fields
    if (!formData.name || !formData.price || !formData.category || !formData.brand) {
      toast.error('Please fill in all required fields (Name, Price, Category, Brand)');
      return;
    }

    // 2. Validate price is a positive number
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    // 3. Validate stock is a non-negative number
    const stock = formData.stock ? parseInt(formData.stock) : 0;
    if (isNaN(stock) || stock < 0) {
      toast.error('Stock must be a valid non-negative number');
      return;
    }

    try {
      setUploading(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: price,
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        brand: formData.brand,
        stock: stock,
        in_stock: formData.inStock,
        is_best_seller: formData.isBestSeller,
        is_new_arrival: formData.isNewArrival,
        is_featured: formData.isFeatured,
        images: images.length > 0 ? images : [],
        tags: tags,
        specifications: specifications
      };

      console.log('Submitting payload:', payload);
      
      // Call the API. The token is handled automatically in api.ts
      const response = await productsApi.create(payload);
      
      console.log('API response:', response);
      
      if (response.success) {
        toast.success('Product added successfully!');
        navigate('/admin/products');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'An error occurred while adding the product');
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      const files = Array.from(e.target.files);
      
      // Convert images to Base64 strings
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-2">
            Create a new product listing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
                  placeholder="e.g., Fender Stratocaster"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Fender"
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
                placeholder="Describe the product..."
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
                  placeholder="0.00"
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
                  placeholder="0.00"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
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

        {/* Product Flags */}
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

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add searchable tags for this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="size-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>Technical specifications and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Key (e.g., Color)"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="Value (e.g., Sunburst)"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpecification(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSpecification}>
              <Plus className="size-4 mr-2" />
              Add Specification
            </Button>
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
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
                <div className="grid grid-cols-3 gap-4">
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
            {uploading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
