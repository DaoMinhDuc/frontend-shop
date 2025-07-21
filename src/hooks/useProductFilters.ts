import { useState, useCallback, useEffect, useMemo } from 'react';
import { useProducts } from './useProduct';
import { useCategories } from './useCategory';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ProductFilter } from '../types/product';
import { debounce } from 'lodash';

// Interface cho bộ lọc nâng cao
export interface AdvancedProductFilter extends ProductFilter {
  startDate?: string;
  endDate?: string;
}

export const useProductFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL search params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // State cho các bộ lọc với giá trị ban đầu từ URL params
  const [filters, setFilters] = useState<AdvancedProductFilter>({});
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [stockStatus, setStockStatus] = useState<boolean | null>(
    searchParams.has('inStock') ? searchParams.get('inStock') === 'true' : null
  );
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    searchParams.get('startDate'),
    searchParams.get('endDate')
  ]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 10);

  // Debounce search text to avoid too many API calls
  const debouncedSearchText = useMemo(
      () => debounce((value: string) => {
        setSearchText(value);
        setCurrentPage(1); 
      }, 300), 
      []
    );
    
  // Fetch products with filters
  const { 
    data: productResponse, 
    isLoading: productsLoading,
    refetch 
  } = useProducts({
    ...filters, // Use all current filters
    search: searchText || undefined, // Only include if there is text
    category: selectedCategory || undefined,
    inStock: stockStatus ?? undefined,
    page: currentPage,
    limit: pageSize
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Extract products and pagination from response
  const products = useMemo(() => productResponse?.data || [], [productResponse?.data]);
  
  const pagination = {
    current: productResponse?.page || 1,
    pageSize: productResponse?.limit || 10,
    total: productResponse?.totalCount || 0,
    totalPages: productResponse?.totalPages || 0
  };

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    debouncedSearchText(value);
  }, [debouncedSearchText]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, []);

  // Handle stock status change
  const handleStockStatusChange = useCallback((status: boolean | null) => {
    setStockStatus(status);
    setCurrentPage(1);
  }, []);

  // Handle date range change
  const handleDateRangeChange = useCallback((dates: [string | null, string | null]) => {
    setDateRange(dates);
    setCurrentPage(1);
  }, []);

  // Handle pagination change
  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchText('');
    setSelectedCategory(null);
    setStockStatus(null);
    setDateRange([null, null]);
    setCurrentPage(1);
    setFilters({});
  }, []);

  // Update URL and filters when state changes
  useEffect(() => {
    const newFilters: AdvancedProductFilter = {
      page: currentPage,
      limit: pageSize
    };
    const newSearchParams = new URLSearchParams();
    
    if (searchText) {
      newFilters.search = searchText;
      newSearchParams.set('search', searchText);
    }

    if (selectedCategory) {
      newFilters.category = selectedCategory;
      newSearchParams.set('category', selectedCategory);
    }

    if (stockStatus !== null) {
      newFilters.inStock = stockStatus;
      newSearchParams.set('inStock', String(stockStatus));
    }

    // Handle date range params
    if (dateRange[0]) {
      newFilters.startDate = dateRange[0];
      newSearchParams.set('startDate', dateRange[0]);
    }
    
    if (dateRange[1]) {
      newFilters.endDate = dateRange[1];
      newSearchParams.set('endDate', dateRange[1]);
    }

    // Update pagination params
    if (currentPage > 1) {
      newSearchParams.set('page', String(currentPage));
    }

    if (pageSize !== 10) {
      newSearchParams.set('pageSize', String(pageSize));
    }

    setFilters(newFilters);

    // Update URL without reloading the page
    const search = newSearchParams.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;
    navigate(newUrl, { replace: true });
  }, [debouncedSearchText, selectedCategory, stockStatus, dateRange, currentPage, pageSize, location.pathname, navigate]);

  return {
    // States
    filters,
    searchText,
    selectedCategory,
    stockStatus,
    dateRange,
    currentPage,
    pageSize,
    // Pagination
    totalPages: pagination.totalPages,
    totalCount: pagination.total,
    // Data
    products,
    categories,
    // Loading states
    isLoading: productsLoading || categoriesLoading,
    // Actions 
    handleSearchChange,
    handleCategoryChange,
    handleStockStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    resetFilters,
    refetch
  };
};
