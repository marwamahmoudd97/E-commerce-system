import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { categoriesApi } from '../lib/api';
import { Category } from '../lib/types';
import { Card } from '../components/ui/card';
import { PageLoader } from '../components/LoadingSpinner';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await categoriesApi.getAll();
    if (response.success) {
      setCategories(response.data);
    }
    setLoading(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
        <p className="text-muted-foreground">Explore our wide range of musical instruments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <Link key={category.id} to={`/shop?category=${category.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <p className="text-xs text-primary">{category.productCount} products</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
