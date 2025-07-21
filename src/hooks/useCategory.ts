import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as categoryService from '../services/categoryService';
import type { Category, CategoryFormData } from '../types/category';
import { QUERY_KEYS } from '../lib/query-keys';
import { useAuth } from './useAuth';
import type { CategoryFilter } from './useCategoryFilters';

// Get all categories with filters support
export const useCategories = (filters?: CategoryFilter) => {
  return useQuery<Category[], Error>({
    queryKey: [QUERY_KEYS.CATEGORY.ALL, filters],
    queryFn: async () => {
      const response = await categoryService.getCategories(filters);
      return response.data; // Return the data array from the response
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

// Get category by id
export const useCategory = (categoryId: string) => {
  return useQuery<Category, Error>({
    queryKey: QUERY_KEYS.CATEGORY.DETAIL(categoryId),
    queryFn: async () => {
      const response = await categoryService.getCategoryById(categoryId);
      return response;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create category mutation (admin)
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation<Category, Error, CategoryFormData>({
    mutationFn: async (categoryData) => {
      if (!isAdmin) throw new Error('Unauthorized');
      return await categoryService.createCategory(categoryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY.ALL] });
      toast.success('Tạo danh mục thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Tạo danh mục thất bại');
    },
  });
};

// Update category mutation (admin) 
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation<Category, Error, { id: string; categoryData: CategoryFormData }>({
    mutationFn: async ({ id, categoryData }) => {
      if (!isAdmin) throw new Error('Unauthorized');
      return await categoryService.updateCategory(id, categoryData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY.ALL] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY.DETAIL(variables.id) });
      toast.success('Cập nhật danh mục thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật danh mục thất bại');
    },
  });
};

// Delete category mutation (admin)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (categoryId) => {
      if (!isAdmin) throw new Error('Unauthorized');
      return await categoryService.deleteCategory(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY.ALL] });
      toast.success('Xóa danh mục thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa danh mục thất bại');
    },
  });
};
