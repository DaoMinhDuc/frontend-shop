import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategoryFilters } from '../../../hooks/useCategoryFilters';
import { PageHeader, TablePagination, CustomCard } from '../../../components/shared';
import CategoryFilter from '../../../components/admin/categories/CategoryFilter';
import CategoryTable from '../../../components/admin/categories/CategoryTable';
import { ROUTES } from '../../../constants/routes';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const {
    paginatedData,
    filteredCategories,
    isLoading,
    searchText,
    activeStatus,
    dateRange,
    currentPage,
    pageSize,
    handleSearchChange,
    handleActiveStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    handleDeleteCategory,
    resetFilters
  } = useCategoryFilters();

  const handleAddCategory = () => {
    navigate(ROUTES.ADMIN.CATEGORIES.ADD);
  };
  
  const handleViewCategory = (id: string) => {
    navigate(ROUTES.ADMIN.CATEGORIES.DETAIL(id));
  };

  const handleEditCategory = (id: string) => {
    navigate(ROUTES.ADMIN.CATEGORIES.EDIT(id));
  };

  const onDeleteCategory = async (categoryId: string) => {
    const success = await handleDeleteCategory(categoryId);
    if (success) {
      message.success('Xóa danh mục thành công');
    } else {
      message.error('Không thể xóa danh mục');
    }
  };

  return (
    <CustomCard>
      <PageHeader 
        title="Danh sách danh mục"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddCategory}
          >
            Thêm danh mục
          </Button>
        }
        showBackButton={false}
      />
      
      <CategoryFilter
        searchText={searchText}
        activeStatus={activeStatus}
        dateRange={dateRange}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onActiveStatusChange={handleActiveStatusChange}
        onDateRangeChange={handleDateRangeChange}
        onResetFilters={resetFilters}
      />
      
      <CategoryTable
        categories={paginatedData}
        isLoading={isLoading}
        onEdit={handleEditCategory}
        onDelete={onDeleteCategory}
        onView={handleViewCategory}
      />
      
      <TablePagination
        total={filteredCategories.length}
        pageSize={pageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
    </CustomCard>
  );
};

export default CategoryList;
