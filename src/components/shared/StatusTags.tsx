import { Tag } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
} from '@ant-design/icons';

/**
 * Reusable component for showing order status tags
 * @param status - The order status
 * @returns React component with appropriate tag style
 */
export const OrderStatusTag = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ xử lý</Tag>;
    case 'processing':
      return <Tag icon={<ClockCircleOutlined />} color="processing">Đang xử lý</Tag>;
    case 'shipping':
      return <Tag icon={<CarOutlined />} color="blue">Đang giao hàng</Tag>;
    case 'delivered':
      return <Tag icon={<CheckCircleOutlined />} color="success">Đã giao hàng</Tag>;
    case 'completed':
      return <Tag icon={<CheckCircleOutlined />} color="green">Hoàn thành</Tag>;
    case 'cancelled':
      return <Tag icon={<ExclamationCircleOutlined />} color="error">Đã hủy</Tag>;
    default:
      return <Tag color="default">{status}</Tag>;
  }
};

/**
 * Reusable component for showing payment status tags
 * @param status - The payment status
 * @param isPaid - Whether the order is paid
 * @returns React component with appropriate tag style
 */
export const PaymentStatusTag = ({ 
  status, 
  isPaid 
}: { 
  status: string; 
  isPaid?: boolean 
}) => {
  if (isPaid) {
    return <Tag color="green">Đã thanh toán</Tag>;
  }
  
  switch (status) {
    case 'pending':
      return <Tag color="orange">Chờ thanh toán</Tag>;
    case 'completed':
      return <Tag color="green">Đã thanh toán</Tag>;
    case 'failed':
      return <Tag color="red">Thanh toán thất bại</Tag>;
    default:
      return <Tag color="default">{status}</Tag>;
  }
};

/**
 * Reusable component for showing stock status tags
 * @param inStock - Whether the product is in stock
 * @returns React component with appropriate tag style
 */
export const StockStatusTag = ({ inStock }: { inStock: boolean }) => {
  return inStock 
    ? <Tag color="success">Còn hàng</Tag>
    : <Tag color="error">Hết hàng</Tag>;
};
