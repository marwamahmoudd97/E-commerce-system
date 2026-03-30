import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { Product } from '../lib/types';
import { productsApi } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { PageLoader } from '../components/LoadingSpinner';

export const Deals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    const response = await productsApi.getAll(1, 24);
    if (response.success) {
      // Filter products with discounts
      const dealsProducts = response.data.filter(p => p.originalPrice && p.originalPrice > p.price);
      setProducts(dealsProducts);
    }
    setLoading(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Special Offers & Deals</h1>
        </div>
        <p className="text-muted-foreground">
          Save big on quality instruments - {products.length} items on sale
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
