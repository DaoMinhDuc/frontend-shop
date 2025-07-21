import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';
import type { Product, ProductFilter, ProductResponse } from '../types/product';

const createQueryString = (filters: ProductFilter = {}) => {
  const params = new URLSearchParams();
  
  // Search and filtering params
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
  if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
  if (filters.discount !== undefined) params.append('discount', filters.discount.toString());
  
  // Pagination params
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  // Sorting
  if (filters.sortBy) params.append('sort', filters.sortBy);
  
  return params.toString();
};

// Product API endpoints
export const getProducts = async (filters: ProductFilter = {}): Promise<ProductResponse> => {
  try {
    const queryString = createQueryString(filters);
    const response = await axiosInstance.get(`/products/?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to fetch products');
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${id}?populate=category`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    toast.error('Failed to fetch product details');
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  try {
    const response = await axiosInstance.post('/products', product);
    toast.success('Product added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    toast.error('Failed to add product');
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, product);
    toast.success('Product updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    toast.error('Failed to update product');
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    toast.success('Product deleted successfully');
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    toast.error('Failed to delete product');
    throw error;
  }
};

