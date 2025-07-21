import { message } from 'antd';
import type { NavigateFunction } from 'react-router-dom';
import { adminNavigationHelper } from './navigationHelper';

/**
 * Type definitions for form responses
 */
type FormResponse<R> = {
  success: boolean;
  data?: R;
  error?: Error;
};

/**
 * Generic form submission handler with type-safe error handling
 * @template T - The type of the form values
 * @template R - The type of the response data
 */
export const handleFormSubmit = async <T, R = unknown>(
  submitFn: (values: T) => Promise<R>,
  values: T,
  successMessage: string,
  errorMessage: string,
  navigate: NavigateFunction,
  redirectPath?: string,
  onSuccess?: (data?: R) => void,
  onError?: (error?: Error) => void
): Promise<FormResponse<R>> => {
  try {
    const data = await submitFn(values);
    message.success(successMessage);
    
    if (onSuccess) {
      onSuccess(data);
    }
    
    if (redirectPath) {
      navigate(redirectPath);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error: ${errorMessage}`, error);
    message.error(errorMessage);
    
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

/**
 * Product form submission handler
 */
export const productFormHelper = {
  /**
   * Handle product form submission for adding a new product
   * @template T - Type of the form values
   * @template R - Type of the API response
   */
  handleAddProduct: async <T, R = unknown>(
    addProductFn: (values: T) => Promise<R>,
    values: T,
    navigate: NavigateFunction,
    setLoading?: (loading: boolean) => void
  ): Promise<FormResponse<R>> => {
    if (setLoading) setLoading(true);
    
    try {
      return await handleFormSubmit<T, R>(
        addProductFn,
        values,
        'Thêm sản phẩm thành công',
        'Không thể thêm sản phẩm',
        navigate,
        '/admin/products'
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  },
  
  /**
   * Handle product form submission for updating an existing product
   * @template T - Type of the form values
   * @template R - Type of the API response
   */
  handleUpdateProduct: async <T, R = unknown>(
    updateProductFn: (id: string, values: T) => Promise<R>,
    id: string,
    values: T,
    navigate: NavigateFunction,
    setLoading?: (loading: boolean) => void
  ): Promise<FormResponse<R>> => {
    if (setLoading) setLoading(true);
    
    try {
      return await handleFormSubmit<T, R>(
        (data: T) => updateProductFn(id, data),
        values,
        'Cập nhật sản phẩm thành công',
        'Không thể cập nhật sản phẩm',
        navigate,
        '/admin/products'
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  },
  
  /**
   * Navigate to products list
   */
  navigateToProductsList: (navigate: NavigateFunction): void => {
    adminNavigationHelper.navigateToProducts(navigate);
  }
};

/**
 * Category form submission helper
 */
export const categoryFormHelper = {
  /**
   * Handle category form submission for adding a new category
   * @template T - Type of the form values
   * @template R - Type of the API response
   */
  handleAddCategory: async <T, R = unknown>(
    createCategoryFn: (values: T) => Promise<R>,
    values: T,
    navigate: NavigateFunction,
    setLoading?: (loading: boolean) => void
  ): Promise<FormResponse<R>> => {
    if (setLoading) setLoading(true);
    
    try {
      return await handleFormSubmit<T, R>(
        createCategoryFn,
        values,
        'Thêm danh mục thành công',
        'Có lỗi xảy ra khi thêm danh mục',
        navigate,
        '/admin/categories'
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  },
  
  /**
   * Handle category form submission for updating an existing category
   * @template T - Type of the form values
   * @template R - Type of the API response
   */
  handleUpdateCategory: async <T, R = unknown>(
    updateCategoryFn: (id: string, values: T) => Promise<R>,
    id: string,
    values: T,
    navigate: NavigateFunction,
    setLoading?: (loading: boolean) => void
  ): Promise<FormResponse<R>> => {
    if (setLoading) setLoading(true);
    
    try {
      return await handleFormSubmit<T, R>(
        (data: T) => updateCategoryFn(id, data),
        values,
        'Cập nhật danh mục thành công',
        'Có lỗi xảy ra khi cập nhật danh mục',
        navigate,
        '/admin/categories'
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  },

  /**
   * Navigate to categories list
   */
  navigateToCategoriesList: (navigate: NavigateFunction): void => {
    adminNavigationHelper.navigateToCategories(navigate);
  }
};