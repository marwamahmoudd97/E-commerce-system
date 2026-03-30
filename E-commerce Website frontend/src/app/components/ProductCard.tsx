import React from 'react';
import { Link } from 'react-router';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../lib/types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  // Helper function: Safely get price as a number
  const getSafePrice = (price: any): number => {
    return typeof price === 'number' ? price : parseFloat(price || '0');
  };

  // Calculate safe price values
  const currentPrice = getSafePrice(product.price);
  const originalPrice = product.originalPrice ? getSafePrice(product.originalPrice) : null;

  const discountPercentage = product.discount || (
    originalPrice ? 
    Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 
    0
  );

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images && product.images[0] ? product.images[0] : '/placeholder.png'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Badges (Discount, New, Best Seller) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discountPercentage}%
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="secondary">New</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-primary text-primary-foreground">Best Seller</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100",
            inWishlist && "opacity-100"
          )}
          onClick={handleToggleWishlist}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current text-destructive")} />
        </Button>

        {/* {/* Stock Status Overlay
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )} */}
      </div> 

      {/* Product Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand Name */}
        <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>

        {/* Product Name */}
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold">
            ${currentPrice.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          // disabled={!product.inStock}
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};
