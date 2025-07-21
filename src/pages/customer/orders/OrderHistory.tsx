/**
 * Order History Page
 * Shows list of user orders with details and actions
 */

// React imports
import React from 'react';

// Ant Design imports
import { Typography, notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// Custom hooks
import { useCancelOrder, useUserOrders } from '../../../hooks/useOrder';

import OrderListTable from '../../../components/customer/orders/OrderListTable';
import EmptyOrders from '../../../components/customer/orders/EmptyOrders';
import { LoadingIndicator, CustomCard } from '../../../components/shared';
import PageLayout from '../../../layouts/common/PageLayout';

const { Title } = Typography;
const { confirm } = Modal;

const OrderHistory: React.FC = () => {
  // Data hooks
  const { data: orders = [], isLoading, refetch } = useUserOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  

  const handleCancelOrder = (orderId: string): void => {
    confirm({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Đơn hàng sẽ bị hủy và không thể khôi phục.',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await cancelOrder(orderId);
          notification.success({
            message: 'Success',
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
  // Render conditional content based on loading and data state
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!orders || orders.length === 0) {
    return <EmptyOrders />;
  }  /**
   * Main render method
   */  return (
    <PageLayout title="Lịch sử đơn hàng">
      <CustomCard>
        <Title level={4}>Lịch sử đơn hàng</Title>
        
        {/* Order list table */}
        <OrderListTable 
          orders={orders} 
          loading={isLoading}
          onCancelOrder={handleCancelOrder}
          isCancelling={isCancelling}
        />
      </CustomCard>
    </PageLayout>
  );
};

export default OrderHistory;
