import { useState, useCallback, useEffect, useMemo } from 'react';
import { useCategories, useDeleteCategory } from './useCategory';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash-es';

export interface CategoryFilter {
  search?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const useCategoryFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const [filters, setFilters] = useState<CategoryFilter>({});
  
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [activeStatus, setActiveStatus] = useState<boolean | null>(
    searchParams.has('isActive') ? searchParams.get('isActive') === 'true' : null
  );
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    searchParams.get('startDate'),
    searchParams.get('endDate')
  ]);  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 10);

  // Use existing hooks with filter support
  const { data: categories = [], isLoading, refetch } = useCategories(filters);
  const { mutate: deleteCategory, isPending: deleteLoading } = useDeleteCategory();

  // Tạo một debounced handler cho việc cập nhật API/URL
  const debouncedUpdateFilters = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      setCurrentPage(1); 
    }, 300), 
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    debouncedUpdateFilters(value);
  }, [debouncedUpdateFilters]);

  // Handle status change
  const handleActiveStatusChange = useCallback((status: boolean | null) => {
    setActiveStatus(status);
    setCurrentPage(1);
  }, []);

  // Handle date range change
  const handleDateRangeChange = useCallback((dates: [string | null, string | null]) => {
    setDateRange(dates);
    setCurrentPage(1);
  }, []);

  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchText('');
    setActiveStatus(null);
    setDateRange([null, null]);
    setCurrentPage(1);
    setFilters({});
  }, []);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      refetch();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }, [deleteCategory, refetch]);
  useEffect(() => {
    const newFilters: CategoryFilter = {};
    const newSearchParams = new URLSearchParams();
    
    if (searchText) {
      newFilters.search = searchText;
      newSearchParams.set('search', searchText);
    }
    
    if (activeStatus !== null) {
      newFilters.isActive = activeStatus;
      newSearchParams.set('isActive', String(activeStatus));
    }
    
    if (dateRange[0]) {
      newFilters.startDate = dateRange[0];
      newSearchParams.set('startDate', dateRange[0]);
    }
    
    if (dateRange[1]) {
      newFilters.endDate = dateRange[1];
      newSearchParams.set('endDate', dateRange[1]);
    }
      if (currentPage > 1) {
      newFilters.page = currentPage;
      newSearchParams.set('page', String(currentPage));
    }
    
    if (pageSize !== 10) {
      newFilters.pageSize = pageSize;
      newSearchParams.set('pageSize', String(pageSize));
    }
    
    setFilters(newFilters);
    
    const search = newSearchParams.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;
    navigate(newUrl, { replace: true });
  }, [searchText, activeStatus, dateRange, currentPage, pageSize, location.pathname, navigate]);  // Dữ liệu đã được lọc bởi API, chỉ cần phân trang trên client nếu cần
  const filteredCategories = useMemo(() => {
    return categories || [];
  }, [categories]);

  const paginatedData = useMemo(() => {
    // Nếu API đã hỗ trợ phân trang, trả về toàn bộ data từ API
    // Nếu không, thực hiện phân trang trên client
    if (filters.page && filters.pageSize) {
      return filteredCategories;
    } else {
      return filteredCategories.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
    }
  }, [filteredCategories, currentPage, pageSize, filters]);

  return {
    filters,
    searchText,
    activeStatus,
    dateRange,
    currentPage,
    pageSize,
    categories,
    filteredCategories,
    paginatedData,
    isLoading: isLoading || deleteLoading,    handleSearchChange,
    handleActiveStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    handleDeleteCategory,
    resetFilters,
    refetch
  };
};
