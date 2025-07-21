import { useState, useCallback, useEffect, useMemo } from 'react';
import { useUsers } from './useUserQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash-es';
import type { UserParams } from '../services/userService';

export type UserFilter = UserParams;

export const useUserFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL search params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [filters, setFilters] = useState<UserFilter>({});
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [roleFilter, setRoleFilter] = useState<string | null>(searchParams.get('role'));
  const [activeStatus, setActiveStatus] = useState<boolean | null>(
    searchParams.has('isActive') ? searchParams.get('isActive') === 'true' : null
  );
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    searchParams.get('startDate'),
    searchParams.get('endDate')
  ]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('limit')) || 10);

  // Prepare query params for API
  const queryParams = useMemo(() => {
    const params: UserParams = {
      page: currentPage,
      limit: pageSize
    };

    if (searchText) params.search = searchText;
    if (roleFilter) params.role = roleFilter;
    if (activeStatus !== null) params.isActive = activeStatus;
    if (dateRange[0]) params.startDate = dateRange[0];
    if (dateRange[1]) params.endDate = dateRange[1];

    return params;
  }, [searchText, roleFilter, activeStatus, dateRange, currentPage, pageSize]);

  // Fetch users with query params
  const { data: response, isLoading, error, refetch } = useUsers(queryParams);

  const debouncedUpdateFilters = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle search change with debounce
  const handleSearchChange = useCallback((value: string) => {
    debouncedUpdateFilters(value);
  }, [debouncedUpdateFilters]);

  // Handle role change
  const handleRoleChange = useCallback((role: string | null) => {
    setRoleFilter(role);
    setCurrentPage(1);
  }, []);

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

  // Handle pagination change
  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchText('');
    setRoleFilter(null);
    setActiveStatus(null);
    setDateRange([null, null]);
    setCurrentPage(1);
    setFilters({});
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newFilters: UserFilter = {};
    const newSearchParams = new URLSearchParams();
    
    if (searchText) {
      newFilters.search = searchText;
      newSearchParams.set('search', searchText);
    }
    
    if (roleFilter) {
      newFilters.role = roleFilter;
      newSearchParams.set('role', roleFilter);
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
      newFilters.limit = pageSize;
      newSearchParams.set('limit', String(pageSize));
    }
    
    setFilters(newFilters);
    
    const search = newSearchParams.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;
    navigate(newUrl, { replace: true });
  }, [searchText, roleFilter, activeStatus, dateRange, currentPage, pageSize, location.pathname, navigate]);

  // Available roles
  const userRoles = useMemo(() => ['admin', 'customer'], []);

  const paginatedData = response?.data || [];
  const totalCount = response?.totalCount || 0;

  return {
    filters,
    searchText,
    roleFilter,
    activeStatus,
    dateRange,
    currentPage,
    pageSize,
    paginatedData,
    totalCount,
    userRoles,
    isLoading,
    error,
    handleSearchChange,
    handleRoleChange,
    handleActiveStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    resetFilters,
    refetch
  };
};
