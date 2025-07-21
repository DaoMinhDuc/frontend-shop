import React from 'react';
import { Table, Typography, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { OrderStatusTag } from '../../shared';
import type { Order, OrderUser } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/format';

const { Text } = Typography;

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  shortId: (id: string, length?: number) => string;  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading,  shortId,
  onEdit,
  onView,
  onDelete,
  onCancel
}) => {
  // Columns configuration
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      width: 150,
      render: (id: string, record: Order) => (
        <Text 
          strong 
          copyable
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => onView(record._id)}
        >
          {shortId(id, 6)}
        </Text>
      )
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user: OrderUser | string) => 
        typeof user === 'object' && user !== null ? user.name : 'Khách lẻ'
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <OrderStatusTag status={status} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,      render: (record: Order) => (
        <Space>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record._id)}
            size="small"
          >
            Sửa
          </Button>
          {record.status === 'pending' && onCancel && (
            <Popconfirm
              title="Bạn có chắc muốn hủy đơn hàng này?"
              onConfirm={() => onCancel(record._id)}
              okText="Hủy đơn"
              cancelText="Không"
            >
              <Button 
                danger
                size="small"
              >
                Hủy đơn
              </Button>
            </Popconfirm>
          )}
          {onDelete && (
            <Popconfirm
              title="Bạn có chắc muốn xóa đơn hàng này?"
              onConfirm={() => onDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button 
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }  ];

  return (
    <Table 
      dataSource={orders}
      columns={columns}
      rowKey="_id"
      loading={isLoading}
      pagination={false}
      scroll={{ x: 1200 }}
      locale={{ emptyText: 'Không có dữ liệu' }}
      style={{ width: '100%' }}
    />
  );
};

export default OrderTable;
