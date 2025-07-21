import React from 'react';
import { Pagination, Select, Space, Typography } from 'antd';
import useResponsive from '../../hooks/useResponsive';

const { Text } = Typography;
const { Option } = Select;

interface TablePaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}

const TablePagination: React.FC<TablePaginationProps> = ({
  total,
  pageSize,
  current,
  onChange,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const handlePageSizeChange = (value: number) => {
    onChange(1, value);
  };
  const startItem = total > 0 ? (current - 1) * pageSize + 1 : 0;
  const endItem = Math.min(current * pageSize, total);
  
  const showText = isDesktop;
  const isSmallDevice = isMobile || isTablet;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: showText ? 'space-between' : 'flex-end',
      alignItems: 'center',
      marginTop: 16,
      padding: '8px 0'
    }}>      {showText && (
        <Text className="text-secondary">
          Hiển thị {startItem}-{endItem} trên tổng số {total} mục
        </Text>
      )}
      
      <Space size={isSmallDevice ? "small" : "large"} align="center">
        <Space>
          {showText && <Text className="text-secondary">Hiển thị</Text>}          <Select 
            value={pageSize} 
            onChange={handlePageSizeChange}
            style={{ width: isSmallDevice ? 70 : 80 }}
            popupMatchSelectWidth={false}
          >
            {pageSizeOptions.map(size => (
              <Option key={size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
          {showText && <Text className="text-secondary">mục mỗi trang</Text>}
        </Space>
        
        <Pagination
          simple={isSmallDevice}
          showQuickJumper={showText}
          showSizeChanger={false}
          total={total}
          pageSize={pageSize}
          current={current}
          onChange={(page) => onChange(page, pageSize)}
        />
      </Space>
    </div>
  );
};

export default TablePagination;
