import React, { useState } from 'react';
import { Row, Col, Pagination, Empty, Select, Space, Typography, Drawer, Button, Form, Checkbox, Radio, Slider, Divider } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import ProductCard from './ProductCard';
import { useResponsive } from '../../../hooks/useResponsive';
import type { Product } from '../../../types/product';
import './ProductList.css';

const { Text } = Typography;
const { Option } = Select;

interface ProductListProps {
  products: Product[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onToggleFavorite?: (productId: string, isFavorite: boolean) => void;
  favoriteProductIds?: string[];
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp đến cao' },
  { value: 'price_desc', label: 'Giá: Cao đến thấp' },
  { value: 'popularity', label: 'Phổ biến' },
  { value: 'rating', label: 'Đánh giá' },
];

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onToggleFavorite,
  favoriteProductIds = [],
  onSortChange,
  onFilterChange,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filterForm] = Form.useForm();
  
  const getColSpan = () => {
    if (isMobile) return 24;
    if (isTablet) return 12;
    return 6;
  };
  
  const handleSortChange = (value: string) => {
    if (onSortChange) {
      onSortChange(value);
    }
  };
  
  const showFilterDrawer = () => {
    setFilterDrawerVisible(true);
  };
  
  const closeFilterDrawer = () => {
    setFilterDrawerVisible(false);
  };
  
  const handleFilterSubmit = () => {
    const values = filterForm.getFieldsValue();
    if (onFilterChange) {
      onFilterChange(values);
    }
    closeFilterDrawer();
  };
  
  const handleResetFilters = () => {
    filterForm.resetFields();
    if (onFilterChange) {
      onFilterChange({});
    }
  };
  
  // Mobile filters drawer
  const filterDrawer = (
    <Drawer
      title="Lọc sản phẩm"
      open={filterDrawerVisible}
      onClose={closeFilterDrawer}
      placement="right"
      width={isMobile ? '85%' : 320}
      extra={
        <Space>
          <Button onClick={handleResetFilters} icon={<ReloadOutlined />}>
            Đặt lại
          </Button>
          <Button type="primary" onClick={handleFilterSubmit}>
            Áp dụng
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={filterForm}>
        <Form.Item name="price" label="Khoảng giá">
          <Slider 
            range 
            min={0} 
            max={10000000} 
            step={100000}
            tipFormatter={(value) => `₫${value?.toLocaleString()}`}
          />
        </Form.Item>
        
        <Divider />
        
        <Form.Item name="rating" label="Đánh giá">
          <Radio.Group>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Radio key={rating} value={rating}>{rating}+ sao</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        
        <Divider />
        
        <Form.Item name="discounts" label="Khuyến mãi">
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="discount">Có khuyến mãi</Checkbox>
              <Checkbox value="freeShipping">Miễn phí vận chuyển</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        
        <Divider />
        
        <Form.Item name="availability" label="Tình trạng">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="inStock">Còn hàng</Radio>
              <Radio value="all">Tất cả</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
  
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={12} sm={14} md={16}>
            <Text type="secondary">
              Hiển thị {products.length} trên {total} sản phẩm
            </Text>
          </Col>
          <Col xs={12} sm={10} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              {isMobile && (
                <Button icon={<FilterOutlined />} onClick={showFilterDrawer}>
                  Lọc
                </Button>
              )}
              <Select 
                placeholder="Sắp xếp theo"
                style={{ width: isMobile ? 120 : 160 }}
                onChange={handleSortChange}
              >
                {sortOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
      </div>
      
      {filterDrawer}
      
      {products.length > 0 ? (
        <>          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col span={getColSpan()} key={product._id}>                
              <ProductCard
                  product={product}
                  loading={loading}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoriteProductIds.includes(product._id)}
                  size="small"
                />
              </Col>
            ))}
          </Row>
          
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              hideOnSinglePage
              showSizeChanger={!isMobile}
              responsive
            />
          </div>
        </>
      ) : (
        <Empty 
          description="Không tìm thấy sản phẩm nào" 
          style={{ margin: '40px 0' }}
        />
      )}
    </>
  );
};

export default ProductList;
