import React, { useMemo } from 'react';
import { Row, Col, Select, DatePicker, Space, Card, Tag } from 'antd';
import { SearchBar } from '../../shared';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OrderFilterProps {
  searchText: string;
  statusFilter: string | null;
  dateRange: [string | null, string | null];
  orderStatuses: string[];
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  onDateRangeChange: (dates: [string | null, string | null]) => void;
  onResetFilters: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  searchText,
  statusFilter,
  dateRange,
  orderStatuses,
  isLoading,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onResetFilters
}) => {
  // Convert date strings to dayjs objects with useMemo
  const dateRangeDayjs = useMemo(() => [
    dateRange[0] ? dayjs(dateRange[0]) : null,
    dateRange[1] ? dayjs(dateRange[1]) : null,
  ] as [dayjs.Dayjs | null, dayjs.Dayjs | null], [dateRange]);

  // Format status for display
  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đã giao hàng',
      'delivered': 'Đã nhận hàng',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    searchText || statusFilter || dateRange[0] || dateRange[1], 
    [searchText, statusFilter, dateRange]
  );

  // Get status color based on status
  const getStatusColor = (status: string): string => {
    const statusColorMap: Record<string, string> = {
      'pending': 'blue',
      'processing': 'orange',
      'shipped': 'purple',
      'delivered': 'green',
      'cancelled': 'red'
    };
    return statusColorMap[status] || 'default';
  };
  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Row gutter={[16, 16]} align="middle">          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <SearchBar
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng"
                value={searchText}
                onChange={onSearchChange}
                style={{ marginBottom: 0, width: '100%' }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <Select
                placeholder="Trạng thái đơn hàng"
                style={{ width: '100%' }}
                allowClear
                value={statusFilter}
                onChange={onStatusChange}
                disabled={isLoading}
              >
                {orderStatuses.map(status => (
                  <Option key={status} value={status}>
                    {formatStatus(status)}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>              <RangePicker 
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
                allowEmpty={[true, true]}
                style={{ width: '100%' }}              />
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
            {statusFilter && (
              <Tag 
                closable 
                onClose={() => onStatusChange(null)} 
                color={getStatusColor(statusFilter)} 
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                Trạng thái: {formatStatus(statusFilter)}
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

export default OrderFilter;
