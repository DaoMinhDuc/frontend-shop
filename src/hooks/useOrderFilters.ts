import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAllOrders } from './useOrder';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Order } from '../types/order';
import { debounce } from 'lodash-es';

export interface OrderFilter {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const useOrderFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL search params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  // State for filters with initial values from URL params
  const [filters, setFilters] = useState<OrderFilter>({});
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.get('status'));
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    searchParams.get('startDate'),
    searchParams.get('endDate')
  ]);  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 10);
  
  // Use existing hook with filters
  const { data: orders = [], isLoading, error, refetch } = useAllOrders(filters);

  // Tạo một debounced handler cho việc cập nhật API/URL
  const debouncedUpdateFilters = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    }, 300), // Giảm thời gian debounce xuống 300ms để phản hồi nhanh hơn
    []
  );

  // Handle search change with debounce
  const handleSearchChange = useCallback((value: string) => {
    // Cập nhật UI ngay lập tức để không bị khựng khi nhập
    debouncedUpdateFilters(value);
  }, [debouncedUpdateFilters]);

  // Handle status change
  const handleStatusChange = useCallback((status: string | null) => {
    setStatusFilter(status);
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
    setStatusFilter(null);
    setDateRange([null, null]);
    setCurrentPage(1);
    setFilters({});
  }, []);

  // Apply filters when state changes and update URL
  useEffect(() => {
    const newFilters: OrderFilter = {};
    const newSearchParams = new URLSearchParams();
    
    if (searchText) {
      newFilters.search = searchText;
      newSearchParams.set('search', searchText);
    }
    
    if (statusFilter) {
      newFilters.status = statusFilter;
      newSearchParams.set('status', statusFilter);
    }
    
    if (dateRange[0]) {
      newFilters.startDate = dateRange[0];
      newSearchParams.set('startDate', dateRange[0]);
    }
      if (dateRange[1]) {
      newFilters.endDate = dateRange[1];
      newSearchParams.set('endDate', dateRange[1]);
    }
    
    // Add pagination
    if (currentPage > 1) {
      newFilters.page = currentPage;
      newSearchParams.set('page', String(currentPage));
    }
    
    if (pageSize !== 10) {
      newFilters.pageSize = pageSize;
      newSearchParams.set('pageSize', String(pageSize));
    }
    
    // Add pagination to URL
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
  }, [searchText, statusFilter, dateRange, currentPage, pageSize, location.pathname, navigate]);

  // Helper functions for order ID and customer name
  const shortId = useCallback((id: string, length = 6): string => {
    return id.substring(0, length);
  }, []);

  const getCustomerName = useCallback((order: Order): string => {
    if (typeof order.user === 'object' && order.user && 'name' in order.user) {
      return order.user.name as string;
    }
    return 'Khách lẻ';
  }, []);  // Use server-side filtering directly
  const filteredOrders = useMemo(() => {
    return orders || [];
  }, [orders]);
  // Use server-side pagination directly
  const paginatedData = useMemo(() => {
    return filteredOrders;
  }, [filteredOrders]);

  // Get available order statuses
  const orderStatuses = useMemo(() => 
    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    []
  );

  return {
    // States
    filters,
    searchText,
    statusFilter,
    dateRange,
    currentPage,
    pageSize,
    // Data
    orders,
    filteredOrders,
    paginatedData,
    orderStatuses,
    // Loading/error states
    isLoading,
    error,
    // Actions
    handleSearchChange,
    handleStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    resetFilters,
    refetch,
    // Helper methods
    shortId,
    getCustomerName
  };
};
