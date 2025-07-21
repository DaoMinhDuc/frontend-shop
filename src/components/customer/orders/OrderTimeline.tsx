/**
 * Order timeline component
 * Displays a timeline of order events based on status
 */
import React from 'react';
import { Timeline, Typography } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CarOutlined } from '@ant-design/icons';
import type { Order } from '../../../types/order';
import { formatDate } from '../../../utils/format';

const { Text } = Typography;

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  // Create timeline items based on order status
  const items = [
    {
      dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
      color: 'blue',
      children: (
        <>
          <Text strong>Đơn hàng đã đặt</Text>
          <br />
          <Text type="secondary">{formatDate(order.createdAt)}</Text>
        </>
      ),
    },
  ];

  if (order.status === 'cancelled') {
    items.push({
      dot: <ExclamationCircleOutlined style={{ fontSize: '16px' }} />,
      color: 'red',
      children: (
        <>
          <Text strong>Đơn hàng đã hủy</Text>
          <br />
          <Text type="secondary">{formatDate(order.updatedAt)}</Text>
        </>
      ),
    });
  } else {
    if (['shipping', 'delivered', 'completed'].includes(order.status)) {
      items.push({
        dot: <CarOutlined style={{ fontSize: '16px' }} />,
        color: 'orange',
        children: (
          <>
            <Text strong>Đang giao hàng</Text>
            <br />
            <Text type="secondary">Đơn hàng đang được giao</Text>
          </>
        ),
      });
    }

    if (order.status === 'completed') {
      items.push({
        dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
        color: 'green',
        children: (
          <>
            <Text strong>Đã giao hàng</Text>
            <br />
            <Text type="secondary">Đơn hàng đã hoàn thành</Text>
          </>
        ),
      });
    }
  }

  return <Timeline items={items} />;
};

export default OrderTimeline;
