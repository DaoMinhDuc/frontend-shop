import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as productService from '../services/productService';
import type { Product, ProductFilter, ProductResponse } from '../types/product';
import { QUERY_KEYS } from '../lib/query-keys';

// Get products with filters
export const useProducts = (filters: ProductFilter = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT.LIST(filters as Record<string, unknown>),
    queryFn: async (): Promise<ProductResponse> => {
      const response = await productService.getProducts(filters);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get product details
export const useProductDetails = (productId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT.DETAIL(productId),
    queryFn: async (): Promise<Product> => {
      const response = await productService.getProductById(productId);
      return response;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search products
export const useProductSearch = (searchText: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT.SEARCH(searchText),
    queryFn: async (): Promise<Product[]> => {
      const response = await productService.getProducts({ search: searchText });
      return response.data || [];
    },
    enabled: !!searchText && searchText.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};
// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT.FEATURED,
    queryFn: async (): Promise<Product[]> => {
      const response = await productService.getProducts({ featured: true });
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get recommended products
export const useRecommendedProducts = (categoryId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT.RECOMMENDED(categoryId),
    queryFn: async (): Promise<Product[]> => {
      const response = await productService.getProducts({ 
        category: categoryId,
        limit: 8 
      });
      return response.data || [];
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create product mutation (admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
      return await productService.addProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT.ALL });
      toast.success('Thêm sản phẩm thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Thêm sản phẩm thất bại');
    },
  });
};

// Update product mutation (admin)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
      return await productService.updateProduct(id, productData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT.DETAIL(variables.id) });
      toast.success('Cập nhật sản phẩm thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật sản phẩm thất bại');
    },
  });
};

// Delete product mutation (admin)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return await productService.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT.ALL });
      toast.success('Xóa sản phẩm thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa sản phẩm thất bại');
    },
  });
};
