/**
 * Order detail component
 * Shows detailed information about a single order
 */
import React from 'react';
import { Row, Col, Descriptions, Table, Typography, Card, Tag } from 'antd';
import type { Order, OrderItem } from '../../../types/order';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import { formatCurrency, formatDate } from '../../../utils/format';

const { Title, Text } = Typography;

interface OrderDetailProps {
  order: Order;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={16}>
        <Descriptions title="Thông tin đơn hàng" bordered column={1}>
          <Descriptions.Item label="Trạng thái">
            <OrderStatusBadge status={order.status} />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt hàng">
            {formatDate(order.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {order.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            {order.paymentStatus === 'completed' ? (
              <Tag color="green">Đã thanh toán</Tag>
            ) : (
              <Tag color="orange">Chưa thanh toán</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng">
            <div>
              <div>{order.shippingAddress.name}</div>
              <div>{order.shippingAddress.phone}</div>
              <div>{order.shippingAddress.address}</div>
              <div>{order.shippingAddress.city}</div>
            </div>
          </Descriptions.Item>
        </Descriptions>        <div style={{ marginTop: 24 }}>
          <Title level={5}>Sản phẩm</Title>
          <Table
            dataSource={order.items as OrderItem[]}
            rowKey={(item, index) => `${item.product}-${index}`}
            pagination={false}
            columns={[
              {
                title: 'Sản phẩm',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Số lượng',
                dataIndex: 'quantity',
                key: 'quantity',
              },
              {
                title: 'Giá',
                dataIndex: 'price',
                key: 'price',
                render: (price: number) => formatCurrency(price),
              },
              {
                title: 'Thành tiền',
                key: 'subtotal',
                render: (_: unknown, item: OrderItem) => formatCurrency(item.price * item.quantity),
              },
            ]}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>Tổng tiền</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong style={{ color: '#ff4d4f' }}>
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </Col>
      
      <Col xs={24} md={8}>
        <Card title="Trạng thái đơn hàng">
          <OrderTimeline order={order} />
        </Card>
      </Col>
    </Row>
  );
};

export default OrderDetail;
