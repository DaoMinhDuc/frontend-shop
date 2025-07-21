import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Typography, 
  Space, 
  Button, 
  Modal, 
  Row, 
  Col, 
  Card,
  Steps,
  Image,
  Empty, 
  Descriptions,
  Divider,
  message,
  Tabs
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  CarOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { useUserOrders, useCancelOrder } from '../../../hooks/useOrder';
import OrderTracking from '../orders/OrderTracking';
import { OrderStatusTag, PaymentStatusTag, ConfirmDialog } from '../../shared';
import { formatCurrency } from '../../../utils/format';
import { 
  formatVietnameseDate, 
  getCurrentStep, 
  getPaymentMethodText,
  prepareOrderForTracking,
  formatOrderId} from '../../../utils/orderUtils';
import type { Order, OrderItem } from '../../../types/order';
import type { CartItem } from '../../../types/cart';

const { Title, Text } = Typography;
const { Step } = Steps;

const OrderHistory: React.FC = () => {
  // UI State
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTabKey, setActiveTabKey] = useState<string>('details');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState<string>('');
    // Data fetching with custom hooks
  const { 
    data: apiOrders = [], 
    isLoading: loading, 
    refetch: fetchOrders   } = useUserOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  
  const orders = useMemo(() => {
    return apiOrders.map(order => {
      // Transform each order item to ensure consistent structure
      const transformedItems = order.items.map(item => {
        // Handle CartItem
        if ('_id' in item) {
          const cartItem = item as CartItem;
          const productInfo = typeof cartItem.product === 'object' ? cartItem.product : null;
          return {
            product: cartItem.product,
            name: productInfo?.name || cartItem.name,
            quantity: cartItem.quantity,
            price: productInfo?.price || cartItem.price,
            imageUrl: productInfo?.imageUrl || cartItem.imageUrl
          } as OrderItem;
        }
        // Already an OrderItem
        return item;
      });

      return {
        ...order,
        items: transformedItems
      };
    });
  }, [apiOrders]);

  // Event Handlers
  const handleViewDetails = (order: Order): void => {
    setSelectedOrder(order);
    setDetailVisible(true);
    setActiveTabKey('details');
  };

  const handleCancelOrder = (orderId: string): void => {
    setOrderIdToCancel(orderId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmCancel = async (): Promise<void> => {
    try {
      await cancelOrder(orderIdToCancel);
      message.success('Hủy đơn hàng thành công');
      await fetchOrders();
    } catch (error: unknown) {
      console.error('Error cancelling order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể hủy đơn hàng';
      message.error(errorMessage);
    } finally {
      setConfirmDialogOpen(false);
      setOrderIdToCancel('');
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => <Text strong>{formatOrderId(id)}</Text>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatVietnameseDate(date)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => <OrderStatusTag status={status} />
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (_: unknown, record: Order) => (
        <PaymentStatusTag status={record.paymentStatus} isPaid={record.isPaid} />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Order) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<FileSearchOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button 
              danger
              size="small"
              onClick={() => handleCancelOrder(record._id)}
              loading={isCancelling && orderIdToCancel === record._id}
              disabled={isCancelling}
            >
              Hủy đơn
            </Button>
          )}
        </Space>
      )
    }
  ];  
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    
    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Steps 
            current={getCurrentStep(selectedOrder.status)} 
            status={selectedOrder.status === 'cancelled' ? 'error' : 'process'}
          >
            <Step title="Đặt hàng" icon={<ClockCircleOutlined />} />
            <Step title="Xác nhận" icon={<CheckCircleOutlined />} />
            <Step title="Đang giao" icon={<CarOutlined />} />
            <Step title="Đã giao" icon={<CheckCircleOutlined />} />
          </Steps>
        </Card>
          <Card title="Thông tin đơn hàng" style={{ marginBottom: 16 }}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Ngày đặt">
              {formatVietnameseDate(selectedOrder.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <OrderStatusTag status={selectedOrder.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Thanh toán">
              <PaymentStatusTag 
                status={selectedOrder.paymentStatus} 
                isPaid={selectedOrder.isPaid} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức">
              {getPaymentMethodText(selectedOrder.paymentMethod)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Thông tin người nhận" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 8]}>
            <Col span={24} md={12}>
              <Text strong>Người nhận: </Text>
              <Text>{selectedOrder.shippingAddress.name}</Text>
            </Col>
            <Col span={24} md={12}>
              <Text strong>Số điện thoại: </Text>
              <Text>{selectedOrder.shippingAddress.phone}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Địa chỉ: </Text>
              <Text>
                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
              </Text>
            </Col>
          </Row>
        </Card>

        <Card title="Chi tiết sản phẩm">          {selectedOrder.items.map((item, index) => {
            const itemPrice = item.price || 0;
            return (
              <div key={index} style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={4}>
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      width="100%" 
                      height={80}
                      style={{ objectFit: 'contain' }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Text strong>{item.name}</Text>
                  </Col>
                  <Col xs={12} sm={4} style={{ textAlign: 'right' }}>
                    <Text>{item.quantity} x {formatCurrency(itemPrice)}</Text>
                  </Col>
                  <Col xs={12} sm={4} style={{ textAlign: 'right' }}>
                    <Text strong>{formatCurrency(itemPrice * item.quantity)}</Text>
                  </Col>
                </Row>
              </div>
            );
          })}

          <Divider />

          <Row justify="end">
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text>Tổng tiền hàng:</Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right', paddingRight: 16 }}>
              <Text>{formatCurrency(selectedOrder.totalAmount)}</Text>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 8 }}>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text>Phí vận chuyển:</Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right', paddingRight: 16 }}>
              <Text>Miễn phí</Text>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 16 }}>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: 16 }}>Tổng thanh toán:</Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right', paddingRight: 16 }}>
              <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                {formatCurrency(selectedOrder.totalAmount)}
              </Text>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  const renderOrderTracking = () => {
    if (!selectedOrder) return null;
    return <OrderTracking order={prepareOrderForTracking(selectedOrder)} />;
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>Lịch sử đơn hàng</Title>
        <Button 
          type="primary" 
          onClick={() => fetchOrders()} 
          loading={loading}
          disabled={loading}
        >
          Cập nhật
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đơn hàng"
        content={
          <Space direction="vertical">
            <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
            <Text>Đơn hàng sẽ bị hủy và không thể khôi phục. Bạn có chắc chắn muốn hủy?</Text>
          </Space>
        }
        okText="Xác nhận"
        cancelText="Quay lại"
        okType="danger"
        confirmLoading={isCancelling}
      />

      {orders.length === 0 && !loading ? (
        <Card>
          <Empty 
            description="Bạn chưa có đơn hàng nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Table 
          columns={columns} 
          dataSource={orders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          style={{ overflowX: 'auto' }}
        />
      )}

      <Modal
        title={
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Chi tiết đơn hàng {selectedOrder && `#${formatOrderId(selectedOrder._id)}`}
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <Tabs
            activeKey={activeTabKey}
            onChange={(key) => setActiveTabKey(key)}
            items={[
              {
                key: 'details',
                label: 'Thông tin đơn hàng',
                children: renderOrderDetail()
              },
              {
                key: 'tracking',
                label: 'Theo dõi đơn hàng',
                children: renderOrderTracking()
              }
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
