import React from 'react';
import { 
  Descriptions, 
  Typography, 
  Tag, 
  Space, 
  Table, 
  Button,
  Steps,
  Badge,
  Card,
  Modal,
  notification
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useOrderDetails, 
  useCancelOrder 
} from '../../../hooks/useOrder';
import { PageHeader, CustomCard } from '../../../components/shared';
import { ROUTES } from '../../../constants/routes';

const { Text } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

// Define interface for OrderItem
interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  const { data: order, isLoading, refetch } = useOrderDetails(id || '');
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  // Handle cancel order
  const handleCancelOrder = () => {
    if (!order) return;
    
    confirm({
      title: 'Xác nhận hủy đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',      onOk: async () => {
        try {
          console.log('Admin trying to cancel order:', order._id);
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

  // Column definitions for product items
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (_: unknown, record: OrderItem) => (
        <Space>
          {record.imageUrl && (
            <img 
              src={record.imageUrl} 
              alt={record.name} 
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          )}
          <Text>{record.name || 'Sản phẩm không tồn tại'}</Text>
        </Space>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price?.toLocaleString()} VND`
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Thành tiền',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (_: unknown, record: OrderItem) => `${(record.price * record.quantity).toLocaleString()} VND`
    }
  ];

  // Function to get status tag
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ xử lý</Tag>;
      case 'processing':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Đang xử lý</Tag>;
      case 'shipping':
        return <Tag icon={<CarOutlined />} color="blue">Đang giao hàng</Tag>;
      case 'delivered':
        return <Tag icon={<CheckCircleOutlined />} color="success">Đã giao hàng</Tag>;
      case 'cancelled':
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Function to get current step based on status
  const getCurrentStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipping': return 2;
      case 'delivered': return 3;
      case 'cancelled': return 4;
      default: return 0;
    }
  };  // Handle edit button click
  const handleEditOrder = () => {
    if (id) {
      navigate(ROUTES.ADMIN.ORDERS.EDIT(id));
    }
  };
  if (isLoading) {
    return <CustomCard loading  />;
  }

  if (!order) {
    return (
      <CustomCard >
        <Text>Không tìm thấy thông tin đơn hàng</Text>
      </CustomCard>
    );
  }  return (
    <CustomCard >      <PageHeader 
        title={`Chi tiết đơn hàng #${order._id.slice(-6).toUpperCase()}`}
        backButtonPath={ROUTES.ADMIN.ORDERS.LIST}
        extra={
          <Space>
            {order.status === 'pending' && (
              <Button 
                danger 
                onClick={handleCancelOrder}
                loading={isCancelling}
              >
                Hủy đơn hàng
              </Button>
            )}
            <Button type="primary" onClick={handleEditOrder}>
              Cập nhật trạng thái
            </Button>
          </Space>
        }
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Order progress */}
        <Card>
          <Steps current={getCurrentStep(order.status)} status={order.status === 'cancelled' ? 'error' : 'process'}>
            <Step title="Đặt hàng" description="Chờ xác nhận" />
            <Step title="Xử lý" description="Đang chuẩn bị" />
            <Step title="Vận chuyển" description="Đang giao hàng" />
            <Step title="Hoàn thành" description="Đã giao hàng" />
          </Steps>
          {order.status === 'cancelled' && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Badge status="error" />
              <Text type="danger">Đơn hàng đã bị hủy</Text>
            </div>
          )}
        </Card>

        {/* Order Information */}
        <Card title="Thông tin đơn hàng">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} layout="vertical">            
            <Descriptions.Item label="Mã đơn hàng">
              <Text copyable>{order._id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {typeof order.user === 'object' && order.user !== null ? order.user.name : 'Khách lẻ'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {typeof order.user === 'object' && order.user !== null ? order.user.email : 'Không có thông tin'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {order.shippingAddress?.phone || 'Không có thông tin'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(order.status)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Shipping Address */}
        <Card title="Địa chỉ giao hàng">
          <Descriptions bordered column={{ xs: 1, sm: 1 }} layout="vertical">
            <Descriptions.Item label="Địa chỉ giao hàng">
              {order.shippingAddress?.name && <div><strong>Người nhận:</strong> {order.shippingAddress?.name}</div>}
              {order.shippingAddress?.phone && <div><strong>Điện thoại:</strong> {order.shippingAddress?.phone}</div>}
              <div>
                {order.shippingAddress?.address}, 
                {order.shippingAddress?.ward && ` ${order.shippingAddress?.ward},`}
                {order.shippingAddress?.district && ` ${order.shippingAddress?.district},`}
                {order.shippingAddress?.province && ` ${order.shippingAddress?.province}`}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>        
        
        {/* Order Items */}
        <Card title="Sản phẩm đã đặt">
          <Table 
            columns={columns} 
            dataSource={order.items as OrderItem[]}
            pagination={false}
            rowKey="_id"
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>Tổng tiền</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{order.totalAmount?.toLocaleString()} VND</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>

        {/* Payment Information */}
        <Card title="Thông tin thanh toán">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} layout="vertical">
            <Descriptions.Item label="Phương thức thanh toán">
              {order.paymentMethod || 'Thanh toán khi nhận hàng'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              {order.isPaid ? (
                <Tag color="success">Đã thanh toán</Tag>
              ) : (
                <Tag color="warning">Chưa thanh toán</Tag>
              )}
            </Descriptions.Item>
            {order.isPaid && order.paidAt && (
              <Descriptions.Item label="Ngày thanh toán">
                {new Date(order.paidAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card title="Ghi chú">
            <Descriptions bordered column={1} layout="vertical">
              <Descriptions.Item label="Ghi chú của khách hàng">
                {order.notes}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}      
      </Space>
    </CustomCard>
  );
};

export default OrderDetail;
