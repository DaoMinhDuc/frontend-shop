/**
 * Order listing table component
 * Displays a list of orders with actions
 */
import React from 'react';
import { Table, Typography, Button, Space } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../../types/order';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDate } from '../../../utils/format';

const { Text } = Typography;

interface OrderListTableProps {
  orders: Order[];
  loading: boolean;
  onCancelOrder: (orderId: string) => void;
  isCancelling: boolean;
}

const OrderListTable: React.FC<OrderListTableProps> = ({
  orders,
  loading,
  onCancelOrder,
  isCancelling
}) => {
  const navigate = useNavigate();
  
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: 'orderId',
      render: (id: string) => <Text copyable={{ text: id }}>{id.slice(-8).toUpperCase()}</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'total',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <OrderStatusBadge status={status} />,    },    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Order) => (
        <Space>
          <Button 
            type="link" 
            icon={<FileSearchOutlined />}
            onClick={() => navigate(`/customer/orders/detail/${record._id}`)}
          >
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button 
              type="link" 
              danger 
              onClick={() => onCancelOrder(record._id)}
              loading={isCancelling}
            >
              Hủy đơn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
      loading={loading}
    />
  );
};

export default OrderListTable;
