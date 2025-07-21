/**
 * Order status badge component
 * Displays a badge with appropriate color based on order status
 */
import React from 'react';
import { Badge } from 'antd';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge status="processing" text="Chờ xác nhận" />;
    case 'processing':
      return <Badge status="processing" text="Đang xử lý" />;
    case 'shipping':
    case 'delivered':
      return <Badge status="warning" text="Đang giao hàng" />;
    case 'completed':
      return <Badge status="success" text="Hoàn thành" />;
    case 'cancelled':
      return <Badge status="error" text="Đã hủy" />;
    default:
      return <Badge status="default" text={status} />;
  }
};

export default OrderStatusBadge;
