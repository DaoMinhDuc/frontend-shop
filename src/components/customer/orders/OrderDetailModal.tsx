import React from 'react';
import { Modal, Button, Tabs } from 'antd';
import type { Order } from '../../../types/order';
import OrderDetail from './OrderDetail';
import OrderTracking from './OrderTracking';
import type { TabsProps } from 'antd';

interface OrderDetailModalProps {
  visible: boolean;
  order: Order | null;
  activeTabKey: string;
  onTabChange: (key: string) => void;
  onCancel: () => void;
  onCancelOrder: (orderId: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  order,
  activeTabKey,
  onTabChange,
  onCancel,
  onCancelOrder,
}) => {
  if (!order) return null;

  // Configure tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'details',
      label: 'Chi tiết đơn hàng',
      children: <OrderDetail order={order} />,
    },
    {
      key: 'tracking',
      label: 'Theo dõi đơn hàng',
      children: <OrderTracking order={order} onClose={onCancel} />,
    },
  ];

  return (
    <Modal
      title={`Chi tiết đơn hàng #${order._id.slice(-8).toUpperCase()}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>,
        order.status === 'pending' && (
          <Button
            key="cancel"
            type="primary"
            danger
            onClick={() => {
              onCancel();
              onCancelOrder(order._id);
            }}
          >
            Hủy đơn hàng
          </Button>
        ),
      ].filter(Boolean)}
      width={900}
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={onTabChange}
        items={tabItems}
      />
    </Modal>
  );
};

export default OrderDetailModal;
