// Core types for the e-commerce platform

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  specifications?: Record<string, string>;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  parentId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}



export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt?: string; 
}

export interface FilterOptions {
  categories?: string[];
  brands?: string[];
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationData;
  success: boolean;
  message?: string;
}
