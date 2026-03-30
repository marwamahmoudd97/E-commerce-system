import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Product } from '../lib/types';
import { productsApi } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { PageLoader } from '../components/LoadingSpinner';
import { Skeleton } from '../components/ui/skeleton';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bestSellersRes, newArrivalsRes, featuredRes] = await Promise.all([
        productsApi.getBestSellers(6),
        productsApi.getNewArrivals(6),
        productsApi.getFeatured(4)
      ]);

      if (bestSellersRes.success) setBestSellers(bestSellersRes.data);
      if (newArrivalsRes.success) setNewArrivals(newArrivalsRes.data);
      if (featuredRes.success) setFeatured(featuredRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 w-fit">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm">New Spring Collection 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Make Music Your Way
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Discover premium musical instruments from the world's leading brands. 
                From guitars to keyboards, find everything you need to create your sound.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/shop')}>
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/categories')}>
                  Browse Categories
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
                alt="Musical instruments"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked favorites from our collection</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-3xl font-bold">Best Sellers</h2>
                <p className="text-muted-foreground">Most popular instruments this month</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/shop?sort=popular')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <p className="text-muted-foreground">Latest additions to our store</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/shop?sort=newest')}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Banner */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore Our Categories</h2>
          <p className="text-lg mb-8 opacity-90">
            From guitars to drums, find instruments for every style
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/categories')}>
            Browse All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-sm text-muted-foreground">
              All instruments are carefully inspected and verified
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Fast Shipping</h3>
            <p className="text-sm text-muted-foreground">
              Free shipping on orders over $99
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              Get help from our team of music professionals
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
