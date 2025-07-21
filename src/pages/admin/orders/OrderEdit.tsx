import React, { useEffect } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  Button, 
  Descriptions, 
  Space, 
  Typography, 
  Tag, 
  message, 
  Table
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderDetails, useUpdateOrderStatus } from '../../../hooks/useOrder';
import { PageHeader, CustomCard } from '../../../components/shared';
import { ROUTES } from '../../../constants/routes';

const { Text } = Typography;
const { Option } = Select;

// Define interface for OrderItem
interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const OrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
    // Use custom hooks
  const { data: order, isLoading, refetch } = useOrderDetails(id || '');
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  
  // Set initial values when order data is loaded
  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        status: order.status,
        isPaid: order.isPaid ? 'paid' : 'unpaid'
      });
    }
  }, [order, form]);  // Handle form submission
  const handleSubmit = async (values: { status: string; isPaid: string }) => {
    try {
      await updateStatus({
        orderId: id || '',
        status: values.status as 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled',
        isPaid: values.isPaid === 'paid'
      });
      message.success('Đơn hàng đã được cập nhật');
      refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật đơn hàng');
      console.error('Error updating order:', error);
    }
  };
  
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
    }  };
  // Handle view details
  const handleViewDetails = () => {
    if (id) {
      navigate(ROUTES.ADMIN.ORDERS.DETAIL(id));
    }
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
  if (isLoading) {
    return <CustomCard loading  />;
  }
  
  if (!order) {
    return (
      <CustomCard >
        <Text>Không tìm thấy thông tin đơn hàng</Text>
      </CustomCard>
    );
  }
  return (
    <CustomCard >      <PageHeader 
        title={`Cập nhật đơn hàng #${order._id.slice(-6).toUpperCase()}`}
        backButtonPath={ROUTES.ADMIN.ORDERS.LIST}
        extra={
          <Button onClick={handleViewDetails}>Xem chi tiết</Button>
        }
      />
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Order Information */}
        <Card title="Thông tin đơn hàng">
          <Descriptions column={{ xs: 1, sm: 2 }}>            <Descriptions.Item label="Mã đơn hàng">
              <Text copyable>{order._id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {typeof order.user === 'object' && order.user !== null ? order.user.name : 'Khách lẻ'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái hiện tại">
              {getStatusTag(order.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng">
              {order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
            </Descriptions.Item>
          </Descriptions>
        </Card>
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
        
        {/* Update Form */}
        <Card title="Cập nhật trạng thái">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: order.status,
              isPaid: order.isPaid ? 'paid' : 'unpaid'
            }}
          >
            <Form.Item
              name="status"
              label="Trạng thái đơn hàng"
              rules={[
                { required: true, message: 'Vui lòng chọn trạng thái' }
              ]}
            >
              <Select>
                <Option value="pending">Chờ xử lý</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="isPaid"
              label="Trạng thái thanh toán"
              rules={[
                { required: true, message: 'Vui lòng chọn trạng thái thanh toán' }
              ]}
            >
              <Select>
                <Option value="unpaid">Chưa thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isUpdating}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Card>      </Space>
    </CustomCard>
  );
};

export default OrderEdit;
