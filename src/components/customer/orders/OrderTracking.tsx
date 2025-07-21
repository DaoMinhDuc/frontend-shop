import React from 'react';
import { 
  Card, 
  Steps, 
  Descriptions, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Timeline, 
  Space 
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined,
  ShopOutlined,
  GiftOutlined,
  EnvironmentOutlined 
} from '@ant-design/icons';
import type { Order } from '../../../types/order';

const { Text } = Typography;
const { Step } = Steps;

// Define a simpler interface for OrderItems in Profile context
interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

// Interface that matches the structure used in Profile component
interface ProfileOrder {
  _id: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled';
  isPaid: boolean;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderTrackingProps {
  order: Order | ProfileOrder;
  onClose?: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onClose }) => {
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get current step based on status
  const getCurrentStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipping': return 2;
      case 'delivered': case 'completed': return 3;
      default: return 0;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="processing">Chờ xác nhận</Tag>;
      case 'processing':
        return <Tag color="warning">Đang xử lý</Tag>;
      case 'shipping':
        return <Tag color="blue">Đang giao hàng</Tag>;
      case 'delivered':
        return <Tag color="success">Đã giao hàng</Tag>;
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      case 'cancelled':
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getEstimatedDeliveryTime = () => {
    // Mock function to return an estimated delivery date
    // In a real app this would come from an API or be calculated based on shipping method
    if (order.status === 'shipping') {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3); // Add 3 days
      return formatDate(deliveryDate.toString());
    }
    return 'Đang cập nhật';
  };

  // Get detailed tracking timeline
  const getTrackingTimeline = () => {
    const items = [
      {
        dot: <ShopOutlined style={{ fontSize: 16, color: '#1890ff' }} />,
        children: (
          <Space direction="vertical" size={0}>
            <Text strong>Đặt hàng thành công</Text>
            <Text type="secondary">{formatDate(order.createdAt)}</Text>
            <Text>Đơn hàng đã được đặt thành công</Text>
          </Space>
        )
      },
    ];    // Based on order status, add more events
    if (order.status === 'cancelled') {
      items.push({
        dot: <ClockCircleOutlined style={{ fontSize: 16, color: '#f5222d' }} />,
        children: (
          <Space direction="vertical" size={0}>
            <Text strong>Đơn hàng đã bị hủy</Text>
            <Text type="secondary">{formatDate(order.updatedAt)}</Text>
            <Text>Đơn hàng của bạn đã được hủy</Text>
          </Space>
        )
      });
    } else {
      // Add processing if order is beyond pending
      if (['processing', 'shipping', 'delivered', 'completed'].includes(order.status)) {
        items.push({
          dot: <GiftOutlined style={{ fontSize: 16, color: '#fa8c16' }} />,
          children: (
            <Space direction="vertical" size={0}>
              <Text strong>Đơn hàng đã được xác nhận</Text>
              <Text type="secondary">{formatDate(new Date(new Date(order.createdAt).getTime() + 3600000).toString())}</Text>
              <Text>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị</Text>
            </Space>
          )
        });
      }

      // Add shipping if order is beyond processing
      if (['shipping', 'delivered', 'completed'].includes(order.status)) {
        items.push({
          dot: <CarOutlined style={{ fontSize: 16, color: '#1890ff' }} />,
          children: (
            <Space direction="vertical" size={0}>
              <Text strong>Đơn hàng đang được giao</Text>
              <Text type="secondary">{formatDate(new Date(new Date(order.createdAt).getTime() + 7200000).toString())}</Text>
              <Text>Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển</Text>
            </Space>
          )
        });
      }

      // Add delivered if order is completed
      if (['delivered', 'completed'].includes(order.status)) {
        items.push({
          dot: <EnvironmentOutlined style={{ fontSize: 16, color: '#52c41a' }} />,
          children: (
            <Space direction="vertical" size={0}>
              <Text strong>Đơn hàng đã giao thành công</Text>
              <Text type="secondary">{formatDate(new Date(new Date(order.createdAt).getTime() + 172800000).toString())}</Text>
              <Text>Đơn hàng của bạn đã được giao thành công</Text>
            </Space>
          )
        });
      }
    }

    return <Timeline items={items} />;
  };
  return (
    <Card title="Theo dõi đơn hàng" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card type="inner">
            <Steps 
              current={getCurrentStep(order.status)} 
              status={order.status === 'cancelled' ? 'error' : 'process'}
              responsive
              size="small"
              style={{ maxWidth: '100%', overflow: 'auto' }}
            >
              <Step title="Đặt hàng" icon={<ClockCircleOutlined />} />
              <Step title="Xác nhận" icon={<CheckCircleOutlined />} />
              <Step title="Đang giao" icon={<CarOutlined />} />
              <Step title="Đã giao" icon={<CheckCircleOutlined />} />
            </Steps>
          </Card>
        </Col>
        
        <Col xs={24} lg={14} push={10}>
          <Card type="inner" title="Chi tiết theo dõi">
            {getTrackingTimeline()}
          </Card>
        </Col>
        
        <Col xs={24} lg={10} pull={14}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card type="inner" title="Thông tin đơn hàng">
              <Descriptions column={1}>
                <Descriptions.Item label="Mã đơn hàng">
                  <Text copyable>...{order._id.slice(-8)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">
                  {formatDate(order.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusBadge(order.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Dự kiến giao hàng">
                  {getEstimatedDeliveryTime()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            <Card type="inner" title="Địa chỉ giao hàng">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Người nhận:</Text>
                  <div>{order.shippingAddress.name}</div>
                </div>
                <div>
                  <Text strong>Số điện thoại:</Text>
                  <div>{order.shippingAddress.phone}</div>
                </div>
                <div>
                  <Text strong>Địa chỉ:</Text>
                  <div>{order.shippingAddress.address}, {order.shippingAddress.city}</div>
                </div>
              </Space>
            </Card>
            
            {onClose && (
              <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose}>Đóng</Button>
              </div>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderTracking;
