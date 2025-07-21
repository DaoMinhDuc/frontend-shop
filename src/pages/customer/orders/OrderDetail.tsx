import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Space, 
  Card, 
  Steps, 
  Row, 
  Col, 
  Descriptions, 
  Divider, 
  Image, 
  Modal, 
  Tabs,
  notification
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined, 
  ExclamationCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

// Custom hooks
import { useOrderDetails, useCancelOrder } from '../../../hooks/useOrder';

// Components
import { OrderStatusTag, PaymentStatusTag, LoadingIndicator } from '../../../components/shared';
import OrderTracking from '../../../components/customer/orders/OrderTracking';
import PageLayout from '../../../layouts/common/PageLayout';

// Utilities
import { 
  formatVietnameseDate, 
  getCurrentStep, 
  getPaymentMethodText,
  prepareOrderForTracking,
  formatOrderId
} from '../../../utils/orderUtils';
import { formatCurrency } from '../../../utils/format';

// Types
import type { OrderItem } from '../../../types/order';

const { Title, Text } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

/**
 * OrderDetail component
 * Main page component for displaying detailed order information
 */
const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  const [activeTabKey, setActiveTabKey] = useState<string>('details');
  
  // Fetch order details
  const { data: order, isLoading, refetch } = useOrderDetails(id || '');
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  // Handle cancel order
  const handleCancelOrder = () => {
    if (!order) return;
    
    confirm({
      title: 'Xác nhận hủy đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {        try {
          console.log('Customer trying to cancel order:', order._id);
          await cancelOrder(order._id);
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

  // Handle back to orders list
  const handleBack = () => {
    navigate('/customer/orders');
  };
  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  // Loading state
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Error state
  if (!order) {
    return (
      <PageLayout title="Chi tiết đơn hàng">
        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Title level={4}>Không tìm thấy đơn hàng</Title>
            <Button type="primary" onClick={handleBack}>
              <ArrowLeftOutlined /> Quay lại danh sách đơn hàng
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Chi tiết đơn hàng #${formatOrderId(order._id)}`}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Quay lại
            </Button>
            {order.status === 'pending' && (
              <Button 
                danger 
                onClick={handleCancelOrder}
                loading={isCancelling}
              >
                Hủy đơn hàng
              </Button>
            )}
          </Space>
        </div>        <Tabs
          activeKey={activeTabKey}
          onChange={handleTabChange}
          items={[
            {
              key: 'details',
              label: 'Thông tin đơn hàng',
              children: (
                <div>
                  <Card style={{ marginBottom: 16 }}>
                    <Steps 
                      current={getCurrentStep(order.status)} 
                      status={order.status === 'cancelled' ? 'error' : 'process'}
                    >
                      <Step title="Đặt hàng" icon={<ClockCircleOutlined />} />
                      <Step title="Xác nhận" icon={<CheckCircleOutlined />} />
                      <Step title="Đang giao" icon={<CarOutlined />} />
                      <Step title="Đã giao" icon={<CheckCircleOutlined />} />
                    </Steps>
                  </Card>

                  <Card title="Thông tin đơn hàng" style={{ marginBottom: 16 }}>
                    <Descriptions column={{ xs: 1, sm: 2 }}>
                      <Descriptions.Item label="Mã đơn hàng">
                        #{formatOrderId(order._id)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày đặt">
                        {formatVietnameseDate(order.createdAt)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        <OrderStatusTag status={order.status} />
                      </Descriptions.Item>
                      <Descriptions.Item label="Thanh toán">
                        <PaymentStatusTag 
                          status={order.paymentStatus} 
                          isPaid={order.isPaid} 
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="Phương thức">
                        {getPaymentMethodText(order.paymentMethod)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="Thông tin người nhận" style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 8]}>
                      <Col span={24} md={12}>
                        <Text strong>Người nhận: </Text>
                        <Text>{order.shippingAddress.name}</Text>
                      </Col>
                      <Col span={24} md={12}>
                        <Text strong>Số điện thoại: </Text>
                        <Text>{order.shippingAddress.phone}</Text>
                      </Col>
                      <Col span={24}>
                        <Text strong>Địa chỉ: </Text>
                        <Text>
                          {order.shippingAddress.address}, {order.shippingAddress.city}
                        </Text>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Chi tiết sản phẩm">
                    {order.items.map((item: OrderItem, index: number) => {
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
                        <Text>{formatCurrency(order.totalAmount)}</Text>
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
                          {formatCurrency(order.totalAmount)}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </div>
              ),
            },
            {
              key: 'tracking',
              label: 'Theo dõi đơn hàng',
              children: <OrderTracking order={prepareOrderForTracking(order)} />,
            },
          ]}
        />
      </Card>
    </PageLayout>
  );
};

export default OrderDetail;
