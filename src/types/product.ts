import type { Category } from './category';

// Category reference in product
export type CategoryReference = Pick<Category, '_id' | 'name' | 'slug'>;

// Product interface definition
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string | CategoryReference;
  inStock: boolean;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  discount?: {
    isActive: boolean;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
  };
  isFeatured?: boolean;
  rating?: number;
}

// Filter interface for products
export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  inStock?: boolean;
  featured?: boolean;
  discount?: boolean;
  // Pagination
  page?: number;
  limit?: number;
}

// API response with pagination
export interface ProductResponse {
  status: string;
  results: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Product[];

  sortBy?: string;
  discount?: boolean;
  featured?: boolean;
}