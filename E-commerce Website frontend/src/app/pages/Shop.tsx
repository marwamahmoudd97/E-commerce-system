import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Product, FilterOptions, SortOption } from '../lib/types';
import { productsApi, categoriesApi, brandsApi } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Skeleton } from '../components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';

const sortOptions: SortOption[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategories([category]);

    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);

    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategories, selectedBrands, priceRange, minRating, inStockOnly, sortBy]);

  
  const loadInitialData = async () => {
    try {
      const catRes = await categoriesApi.getAll();
      if (catRes.success) setCategories(catRes.data);

      const brandRes = await brandsApi.getAll();
      if (brandRes.success) setBrands(brandRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters: FilterOptions = {
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        brands: selectedBrands.length > 0 ? selectedBrands : undefined,
        priceRange: priceRange[0] > 0 || priceRange[1] < 5000 ? priceRange : undefined,
        rating: minRating > 0 ? minRating : undefined,
        inStock: inStockOnly || undefined
      };

      const response = await productsApi.getAll(currentPage, 12, filters, sortBy);

      if (response.success) {
        setProducts(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotal(response.pagination.total);
        }
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label className="text-sm cursor-pointer flex-1">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label className="text-sm cursor-pointer flex-1">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={5000}
          step={100}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Rating */}
      <Select value={minRating.toString()} onValueChange={(val) => setMinRating(Number(val))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All</SelectItem>
          <SelectItem value="4">4+</SelectItem>
          <SelectItem value="4.5">4.5+</SelectItem>
        </SelectContent>
      </Select>

      {/* Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(!!checked)}
        />
        <Label>In Stock</Label>
      </div>

      <Button onClick={clearFilters} variant="outline">Clear</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64">
          <FiltersContent />
        </aside>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Shop</h1>

          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                  Prev
                </Button>
                <span>{currentPage} / {totalPages}</span>
                <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};