import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Row, Col, Typography, Card, Breadcrumb, Select, Space, Button, Tag, Divider } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../../hooks/useProduct';
import { useCategories } from '../../../hooks/useCategory';
import HomeHeader from '../../../components/customer/home/HomeHeader';
import ProductList from '../../../components/customer/products/ProductList';
import { ROUTES } from '../../../constants/routes';
import type { Category } from '../../../types/category';
import './CategoryProducts.css';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const CategoryProductsPage: React.FC = () => {  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Get category ID from URL
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');
    // Filter states
  const [filters, setFilters] = useState({
    category: categoryId || '',
    search: searchQuery || '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sortBy: 'newest',
    inStock: undefined as boolean | undefined
  });
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
    const { data: productResponse, isLoading } = useProducts(filters);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [currentCategory, setCurrentCategory] = useState<{ _id: string; name: string } | null>(null);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);

  // Extract products from response
  const products = productResponse?.data || [];
  
  // Find current category
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const category = categories.find((c: Category) => c._id === categoryId);
      if (category) {
        setCurrentCategory(category);
        document.title = `Danh mục: ${category.name} | Shop`;
      }
    } else if (searchQuery) {
      document.title = `Tìm kiếm: ${searchQuery} | Shop`;
    } else {
      document.title = 'Tất cả sản phẩm | Shop';
    }
  }, [categoryId, categories, searchQuery]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    // Update URL without reloading the page
    const newSearchParams = new URLSearchParams(location.search);
    
    if (value) {
      newSearchParams.set('category', value);
    } else {
      newSearchParams.delete('category');
    }
    
    const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
    navigate(newUrl);
    
    setFilters(prev => ({
      ...prev,
      category: value
    }));
    setPage(1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  // Handle filter change from ProductList component
  const handleFilterChange = (values: Record<string, unknown>) => {
    const newFilters = { ...filters };
    
    // Process availability filter
    if (values.availability === 'inStock') {
      newFilters.inStock = true;
    } else if (values.availability === 'all') {
      newFilters.inStock = undefined;
    }
    
    setFilters(newFilters);
    setPage(1);
  };
  // Handle page change
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Toggle favorite
  const handleToggleFavorite = useCallback((productId: string, isFavorite: boolean) => {
    if (isFavorite) {
      setFavoriteProductIds(prev => [...prev, productId]);
    } else {
      setFavoriteProductIds(prev => prev.filter(id => id !== productId));
    }
  }, []);

  return (
    <Layout>
      <HomeHeader />
      <Content style={{ padding: '0 16px', marginTop: 16 }}>
        <div className="category-page-container">
          {/* Breadcrumb */}          <Breadcrumb
            items={[
              {
                title: <Link to={ROUTES.HOME}><HomeFilled /> Trang chủ</Link>,
              },
              {
                title: currentCategory ? currentCategory.name : (searchQuery ? 'Tìm kiếm' : 'Tất cả sản phẩm'),
              },
            ]}
            style={{ marginBottom: 16 }}
          />

          {/* Page Title */}
          <Title level={2} style={{ marginBottom: 24 }}>
            {currentCategory ? currentCategory.name : (searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả sản phẩm')}
          </Title>

          <Row gutter={[24, 24]}>
            {/* Filter Sidebar */}
            <Col xs={24} sm={24} md={6} lg={5} xl={4}>
              <div className="filter-sidebar">
                <Card title="Bộ lọc" bordered={false}>
                  {/* Category Filter */}
                  <div className="filter-section">
                    <Title level={5}>Danh mục</Title>
                    <Select
                      placeholder="Chọn danh mục"
                      style={{ width: '100%' }}
                      value={filters.category || undefined}
                      onChange={handleCategoryChange}
                      loading={categoriesLoading}
                      allowClear
                    >                      {categories.map((category: Category) => (
                        <Option key={category._id} value={category._id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </div>                  <Divider />

                  {/* Stock Filter */}
                  <div className="filter-section">
                    <Title level={5}>Tình trạng</Title>
                    <Space>
                      <Tag
                        color={filters.inStock === true ? 'blue' : undefined}
                        style={{ cursor: 'pointer', padding: '4px 8px' }}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          inStock: prev.inStock === true ? undefined : true
                        }))}
                      >
                        Còn hàng
                      </Tag>
                      <Tag
                        color={filters.inStock === undefined ? 'blue' : undefined}
                        style={{ cursor: 'pointer', padding: '4px 8px' }}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          inStock: undefined
                        }))}
                      >
                        Tất cả                      </Tag>
                    </Space>
                  </div>
                  
                  <Divider />
                  
                  {/* Clear Filters */}
                  <Button 
                    onClick={() => {                      setFilters({
                        category: '',
                        search: searchQuery || '',
                        minPrice: undefined,
                        maxPrice: undefined,
                        sortBy: 'newest',
                        inStock: undefined
                      });
                      setPage(1);
                      
                      // Clear URL params except search
                      const newSearchParams = new URLSearchParams();
                      if (searchQuery) {
                        newSearchParams.set('search', searchQuery);
                      }
                      navigate(`${ROUTES.PRODUCTS}?${newSearchParams.toString()}`);
                    }}
                    style={{ width: '100%' }}
                  >
                    Xóa bộ lọc
                  </Button>
                </Card>
              </div>
            </Col>

            {/* Product List */}
            <Col xs={24} sm={24} md={18} lg={19} xl={20}>
              <ProductList
                products={products}
                loading={isLoading}
                total={products.length}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onToggleFavorite={handleToggleFavorite}
                favoriteProductIds={favoriteProductIds}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CategoryProductsPage;
