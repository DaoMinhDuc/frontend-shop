import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProductFilters } from '../../../hooks/useProductFilters';
import { useDeleteProduct } from '../../../hooks/useProduct';
import { PageHeader, TablePagination, CustomCard } from '../../../components/shared';
import ProductFilter from '../../../components/admin/products/ProductFilter';
import ProductTable from '../../../components/admin/products/ProductTable';
import { ROUTES } from '../../../constants/routes';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: deleteProduct } = useDeleteProduct();
  
  const {
    searchText,
    selectedCategory,
    stockStatus,
    dateRange,
    categories,
    products,
    isLoading,
    totalCount,
    currentPage,
    pageSize,
    handleSearchChange,
    handleCategoryChange,
    handleStockStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    resetFilters,
    refetch
  } = useProductFilters();
  // Handle product actions
  const handleAddProduct = () => {
    navigate(ROUTES.ADMIN.PRODUCTS.ADD);
  };
  
  const handleViewProduct = (id: string) => {
    navigate(ROUTES.ADMIN.PRODUCTS.DETAIL(id));
  };

  const handleEditProduct = (id: string) => {
    navigate(ROUTES.ADMIN.PRODUCTS.EDIT(id));
  };  const onDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refetch(); // Refresh data after deletion
      message.success('Xóa sản phẩm thành công');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể xóa sản phẩm';
      message.error(errorMessage);
    }
  };

  return (
    <CustomCard>
      <PageHeader 
        title="Danh sách sản phẩm"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddProduct}
          >
            Thêm sản phẩm
          </Button>
        }
        showBackButton={false}
      />
      
      <ProductFilter
        searchText={searchText}
        selectedCategory={selectedCategory}
        stockStatus={stockStatus}
        dateRange={dateRange}
        categories={categories}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStockStatusChange={handleStockStatusChange}
        onDateRangeChange={handleDateRangeChange}
        onResetFilters={resetFilters}
      />
        <ProductTable
        products={products}
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEditProduct}
        onDelete={onDeleteProduct}
        onView={handleViewProduct}
      />
      
      <TablePagination
        total={totalCount}
        pageSize={pageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
    </CustomCard>
  );
};

export default ProductList;
