import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heart, ShoppingCart, Share2, Star, Check } from 'lucide-react';
import { Product, Review } from '../lib/types';
import { productsApi, reviewsApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { RatingStars } from '../components/RatingStars';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PageLoader } from '../components/LoadingSpinner';
import { toast } from 'sonner';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [productRes, reviewsRes, relatedRes] = await Promise.all([
        productsApi.getById(id),
        reviewsApi.getByProduct(id),
        productsApi.getRelated(id)
      ]);

      if (productRes.success && productRes.data) {
        setProduct(productRes.data);
      } else {
        navigate('/404');
      }

      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (relatedRes.success) setRelatedProducts(relatedRes.data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Info */}
      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border transition-all ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
              >
              
                <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <RatingStars rating={product.rating} size="lg" showNumber />
              <span className="text-sm text-muted-foreground">
                {product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <Badge variant="destructive">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.isBestSeller && <Badge>Best Seller</Badge>}
            {product.isNewArrival && <Badge variant="secondary">New Arrival</Badge>}
            {product.inStock ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Check className="mr-1 h-3 w-3" />
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="px-4">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              // disabled={!product.inStock}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => toggleWishlist(product.id)}
              className="flex-1"
            >
              <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-current text-destructive' : ''}`} />
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList>

          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        
      
        
        <TabsContent value="reviews" className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
