import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, notification, Modal } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useOrderFilters } from '../../../hooks/useOrderFilters';
import { useCancelOrder } from '../../../hooks/useOrder';
import { PageHeader, CustomCard } from '../../../components/shared';
import OrderFilter from '../../../components/admin/orders/OrderFilter';
import OrderTable from '../../../components/admin/orders/OrderTable';
import TablePagination from '../../../components/shared/TablePagination';
import { ROUTES } from '../../../constants/routes';

const { confirm } = Modal;

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: cancelOrder } = useCancelOrder();
  const {
    paginatedData,
    filteredOrders,
    orderStatuses,
    isLoading,
    error,
    searchText,
    statusFilter,
    dateRange,
    currentPage,
    pageSize,
    handleSearchChange,
    handleStatusChange,
    handleDateRangeChange,
    handlePaginationChange,
    resetFilters,
    refetch,
    shortId,
  } = useOrderFilters();

  React.useEffect(() => {
    if (error) {
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: (error as Error).message || 'Không thể tải danh sách đơn hàng',
      });
    }
  }, [error]);
  const handleViewOrder = (orderId: string): void => {
    navigate(ROUTES.ADMIN.ORDERS.DETAIL(orderId));
  };
  
  const handleEditOrder = (orderId: string): void => {
    navigate(ROUTES.ADMIN.ORDERS.EDIT(orderId));
  };
  
  // Refresh data
  const handleRefresh = (): void => {
    refetch();
    notification.success({
      message: 'Đã làm mới dữ liệu',
      description: 'Danh sách đơn hàng đã được cập nhật',
    });
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId: string): void => {
    confirm({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Đơn hàng sẽ bị hủy và không thể khôi phục.',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Không',      onOk: async () => {
        try {
          console.log('Admin trying to cancel order:', orderId);
          await cancelOrder(orderId);
          notification.success({
            message: 'Hủy đơn thành công',
            description: 'Đơn hàng đã được hủy',
            placement: 'topRight'
          });
          refetch();
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Không thể hủy đơn hàng';
          notification.error({
            message: 'Error',
            description: errorMessage,
            placement: 'topRight'
          });
        }
      },
    });
  };

  return (
    <CustomCard>
      <PageHeader 
        title="Quản lý đơn hàng" 
        backButtonPath="/admin"
        extra={
          <Button key="refresh" onClick={handleRefresh} icon={<ReloadOutlined />}>
            Làm mới
          </Button>
        }
      />
      
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <OrderFilter 
          searchText={searchText}
          statusFilter={statusFilter}
          dateRange={dateRange}
          orderStatuses={orderStatuses}
          isLoading={isLoading}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onDateRangeChange={handleDateRangeChange}
          onResetFilters={resetFilters}
        />
          <OrderTable 
          orders={paginatedData}
          isLoading={isLoading}
          shortId={shortId}
          onEdit={handleEditOrder}
          onView={handleViewOrder}
          onCancel={handleCancelOrder}
        />
        
        <TablePagination 
          total={filteredOrders.length}
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePaginationChange}
        />
      </Space>
    </CustomCard>
  );
};

export default OrderList;
