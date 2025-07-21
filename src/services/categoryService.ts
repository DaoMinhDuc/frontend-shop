// filepath: d:\Code\project\frontend\src\services\categoryService.ts
import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';
import type { Category, CategoryFormData, CategoryFilter, CategoryResponse } from '../types/category';

const createQueryString = (filters: CategoryFilter = {}) => {
  const params = new URLSearchParams();
  
  // Search and filtering params
  if (filters.search) params.append('search', filters.search);
  if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  // Pagination params
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  // Sorting
  if (filters.sortBy) params.append('sort', filters.sortBy);
  
  return params.toString();
};

// Category API endpoints
export const getCategories = async (filters: CategoryFilter = {}): Promise<CategoryResponse> => {
  try {
    const queryString = createQueryString(filters);
    const response = await axiosInstance.get(`/categories?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error('Failed to fetch categories');
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error(`Error fetching category ${id}:`, err);
    const errorMessage = err?.response?.data?.message || 'Failed to fetch category details';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const createCategory = async (category: CategoryFormData): Promise<Category> => {
  try {
    const response = await axiosInstance.post('/categories', category);
    toast.success('Category created successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to create category');
    throw error;
  }
};

export const updateCategory = async (id: string, category: CategoryFormData): Promise<Category> => {
  try {
    const response = await axiosInstance.patch(`/categories/${id}`, category);
    toast.success('Cập nhật danh mục thành công');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error(`Error updating category ${id}:`, err);
    const errorMessage = err?.response?.data?.message || 'Không thể cập nhật danh mục';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteCategory = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    toast.success('Category deleted successfully');
    return { success: response.data.status === 'success' };
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    toast.error('Failed to delete category');
    throw error;
  }
};
