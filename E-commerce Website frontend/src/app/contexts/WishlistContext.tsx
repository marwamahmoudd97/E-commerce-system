import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      const response = await wishlistApi.get(user.id);
      if (response.success) {
        setWishlist(response.data);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const response = await wishlistApi.add(user.id, productId);
      if (response.success) {
        setWishlist(response.data);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const response = await wishlistApi.remove(user.id, productId);
      if (response.success) {
        setWishlist(response.data);
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
