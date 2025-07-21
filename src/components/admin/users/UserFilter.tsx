import React, { useMemo } from 'react';
import { Row, Col, Select, DatePicker, Space, Card, Tag } from 'antd';
import { SearchBar } from '../../shared';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface UserFilterProps {
  searchText: string;
  roleFilter: string | null;
  activeStatus: boolean | null;
  dateRange: [string | null, string | null];
  userRoles: string[];
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string | null) => void;
  onActiveStatusChange: (value: boolean | null) => void;
  onDateRangeChange: (dates: [string | null, string | null]) => void;
  onResetFilters: () => void;
}

const UserFilter: React.FC<UserFilterProps> = ({
  searchText,
  roleFilter,
  activeStatus,
  dateRange,
  userRoles,
  isLoading,
  onSearchChange,
  onRoleChange,
  onActiveStatusChange,
  onDateRangeChange,
  onResetFilters
}) => {
  const dateRangeDayjs = useMemo(() => [
    dateRange[0] ? dayjs(dateRange[0]) : null,
    dateRange[1] ? dayjs(dateRange[1]) : null,
  ] as [dayjs.Dayjs | null, dayjs.Dayjs | null], [dateRange]);

  const hasActiveFilters = useMemo(() => 
    searchText || roleFilter || activeStatus !== null || dateRange[0] || dateRange[1], 
    [searchText, roleFilter, activeStatus, dateRange]
  );
  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Row gutter={[16, 16]} align="middle">          
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <SearchBar
                placeholder="Tìm kiếm theo tên hoặc email"
                value={searchText}
                onChange={onSearchChange}
                style={{ marginBottom: 0, width: '100%' }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <Select
                placeholder="Vai trò"
                style={{ width: '100%' }}
                allowClear
                value={roleFilter || undefined}
                onChange={(value) => onRoleChange(value || null)}
                disabled={isLoading}
              >
                {userRoles.map((role) => (
                  <Option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>              <Select
                placeholder="Trạng thái"
                style={{ width: '100%' }}
                allowClear
                value={activeStatus}
                onChange={(value) => onActiveStatusChange(value === undefined ? null : value)}
                disabled={isLoading || false}
              >
                <Option value={true}>Kích hoạt</Option>
                <Option value={false}>Vô hiệu</Option>
              </Select>
            </div>
          </Col>
        </Row>        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>              <RangePicker 
                style={{ width: '100%' }}
                value={dateRangeDayjs}
                allowEmpty={[true, true]}
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
              />
            </div>
          </Col>
        </Row>
        {hasActiveFilters && (
          <div style={{ marginTop: 8 }}>
            {searchText && (
              <Tag closable onClose={() => onSearchChange('')} color="blue" style={{ marginRight: 8, marginBottom: 8 }}>
                Tìm kiếm: {searchText}
              </Tag>
            )}
            {roleFilter && (
              <Tag closable onClose={() => onRoleChange(null)} color="green" style={{ marginRight: 8, marginBottom: 8 }}>
                Vai trò: {roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
              </Tag>
            )}
            {activeStatus !== null && (
              <Tag closable onClose={() => onActiveStatusChange(null)} color={activeStatus ? 'success' : 'error'} style={{ marginRight: 8, marginBottom: 8 }}>
                Trạng thái: {activeStatus ? 'Kích hoạt' : 'Vô hiệu'}
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

export default UserFilter;
