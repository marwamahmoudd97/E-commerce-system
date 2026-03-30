import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { Product } from '../../lib/types';
import { productsApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { PageLoader } from '../../components/LoadingSpinner';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadWishlistProducts();
  }, [isAuthenticated, wishlist]);

  const loadWishlistProducts = async () => {
    setLoading(true);
    try {
      const productsPromises = wishlist.map(id => productsApi.getById(id));
      const responses = await Promise.all(productsPromises);
      const loadedProducts = responses
        .filter(res => res.success && res.data)
        .map(res => res.data!);
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save your favorite instruments to your wishlist"
          action={{ label: 'Browse Products', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">{products.length} items</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
