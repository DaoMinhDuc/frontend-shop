import React, { useMemo } from 'react';
import { Row, Col, Select, DatePicker, Space, Card, Tag } from 'antd';
import type { Category } from '../../../types/category';
import { SearchBar } from '../../shared';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ProductFilterProps {
  searchText: string;
  selectedCategory: string | null;
  stockStatus: boolean | null;
  dateRange: [string | null, string | null];
  categories: Category[];
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onStockStatusChange: (value: boolean | null) => void;
  onDateRangeChange: (dates: [string | null, string | null]) => void;
  onResetFilters: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  searchText,
  selectedCategory,
  stockStatus,
  dateRange,
  categories,
  isLoading,
  onSearchChange,
  onCategoryChange,
  onStockStatusChange,
  onDateRangeChange,
  onResetFilters
}) => {
  // Convert date strings to dayjs objects
  const dateRangeDayjs = useMemo(() => [
    dateRange[0] ? dayjs(dateRange[0]) : null,
    dateRange[1] ? dayjs(dateRange[1]) : null,
  ] as [dayjs.Dayjs | null, dayjs.Dayjs | null], [dateRange]);

  // Get selected category name
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return null;
    const category = categories.find(c => c._id === selectedCategory);
    return category ? category.name : null;
  }, [selectedCategory, categories]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    searchText || selectedCategory || stockStatus !== null || dateRange[0] || dateRange[1], 
    [searchText, selectedCategory, stockStatus, dateRange]
  );
  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">        <Row gutter={[16, 16]} align="middle">          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <SearchBar
                placeholder="Tìm kiếm theo tên, mô tả..."
                value={searchText}
                onChange={onSearchChange}
                style={{ marginBottom: 0, width: '100%' }} 
              />
            </div>
          </Col><Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <Select
                placeholder="Danh mục"
                style={{ width: '100%' }}
                allowClear
                value={selectedCategory}
                onChange={onCategoryChange}
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <Select
                placeholder="Trạng thái kho"
                style={{ width: '100%' }}
                allowClear
                value={stockStatus === null ? undefined : stockStatus}
                onChange={(value) => onStockStatusChange(value === undefined ? null : value)}
                disabled={isLoading}
              >
                <Option value={true}>Còn hàng</Option>
                <Option value={false}>Hết hàng</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]} align="middle">          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <RangePicker 
                value={dateRangeDayjs}
                onChange={(dates) => {
                  if (dates) {
                    onDateRangeChange([
                      dates[0] ? dates[0].format('YYYY-MM-DD') : null,
                      dates[1] ? dates[1].format('YYYY-MM-DD') : null
                    ]);
                  } else {
                    onDateRangeChange([null, null]);
                  }
                }}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                disabled={isLoading}
                style={{ width: '100%' }}
              />
            </div>
          </Col>
        </Row>

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div style={{ marginTop: 8 }}>
            {searchText && (
              <Tag closable onClose={() => onSearchChange('')} color="blue" style={{ marginRight: 8, marginBottom: 8 }}>
                Tìm kiếm: {searchText}
              </Tag>
            )}
            {selectedCategory && selectedCategoryName && (
              <Tag closable onClose={() => onCategoryChange(null)} color="green" style={{ marginRight: 8, marginBottom: 8 }}>
                Danh mục: {selectedCategoryName}
              </Tag>
            )}
            {stockStatus !== null && (
              <Tag closable onClose={() => onStockStatusChange(null)} color={stockStatus ? 'success' : 'error'} style={{ marginRight: 8, marginBottom: 8 }}>
                Trạng thái: {stockStatus ? 'Còn hàng' : 'Hết hàng'}
              </Tag>
            )}
            {dateRange[0] && (
              <Tag closable onClose={() => onDateRangeChange([null, dateRange[1]])} color="orange" style={{ marginRight: 8, marginBottom: 8 }}>
                Từ ngày: {dayjs(dateRange[0]).format('DD/MM/YYYY')}
              </Tag>
            )}
            {dateRange[1] && (
              <Tag closable onClose={() => onDateRangeChange([dateRange[0], null])} color="orange" style={{ marginRight: 8, marginBottom: 8 }}>
                Đến ngày: {dayjs(dateRange[1]).format('DD/MM/YYYY')}
              </Tag>
            )}
            <Tag 
              closable 
              onClose={onResetFilters} 
              color="purple"
              style={{ fontWeight: 'bold', marginRight: 8, marginBottom: 8 }}
            >
              Xóa tất cả
            </Tag>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ProductFilter;
