import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { Product } from '../lib/types';
import { searchApi } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { PageLoader } from '../components/LoadingSpinner';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts();
    }
  }, [query]);

  const searchProducts = async () => {
    setLoading(true);
    const response = await searchApi.search(query);
    if (response.success) {
      setProducts(response.data);
    }
    setLoading(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          {products.length} results for "{query}"
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground mb-6">
            Try searching with different keywords
          </p>
          <Button onClick={() => navigate('/shop')}>Browse All Products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
