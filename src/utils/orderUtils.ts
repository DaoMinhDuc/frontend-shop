/**
 * Utility functions for orders
 */
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Order, TrackedOrder, OrderItem } from '../types/order';

/**
 * Format date with Vietnamese locale
 */
export const formatVietnameseDate = (dateString: string): string => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
};

/**
 * Get current step in order process based on status
 */
export const getCurrentStep = (status: string): number => {
  switch (status) {
    case 'pending': return 0;
    case 'processing': return 1;
    case 'shipping': return 2;
    case 'delivered': return 3;
    case 'cancelled': return 0;
    default: return 0;
  }
};

/**
 * Get payment method display text
 */
export const getPaymentMethodText = (method: string): string => {
  return method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản';
};

/**
 * Interface representing raw API response order data format
 */
export interface ApiOrderResponse {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: Array<{
    product: string | { _id: string };
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
  totalAmount: number;
  shippingAddress?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled';
  isPaid?: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform API order data to a consistent Order format
 * This ensures we have a properly formatted Order object regardless of API response structure
 */
export const transformApiOrder = (apiOrder: ApiOrderResponse): Order => {
  // Transform order items to consistent format
  const transformedItems = apiOrder.items.map((item): OrderItem => ({
    product: typeof item.product === 'string' ? item.product : item.product._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    imageUrl: item.imageUrl
  }));
  
  // Handle user field - could be string ID or user object
  const user = typeof apiOrder.user === 'string'
    ? { _id: apiOrder.user, name: '', email: '' }
    : apiOrder.user;
  
  // Create a normalized shipping address
  const shippingAddress = apiOrder.shippingAddress ? {
    name: apiOrder.shippingAddress.name || '',
    phone: apiOrder.shippingAddress.phone || '',
    address: apiOrder.shippingAddress.address || '',
    city: apiOrder.shippingAddress.city || ''
  } : {
    name: '',
    phone: '',
    address: '',
    city: ''
  };
  
  // Return the standardized order
  return {
    _id: apiOrder._id,
    user,
    items: transformedItems,
    totalAmount: apiOrder.totalAmount,
    shippingAddress,
    paymentMethod: apiOrder.paymentMethod,
    status: apiOrder.status,
    isPaid: apiOrder.isPaid || false,
    paymentStatus: apiOrder.paymentStatus,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt
  };
};

/**
 * Normalize order data for the OrderTracking component
 */
export const prepareOrderForTracking = (order: Order): TrackedOrder => {
  if (!order) return null as unknown as TrackedOrder;
  
  // Handle different user formats (string or object)
  const normalizedUser = typeof order.user === 'string' 
    ? { _id: order.user, name: '', email: '' } 
    : order.user;
    
  return {
    ...order,
    user: normalizedUser as TrackedOrder['user']
  };
};

/**
 * Format order ID for display (last 8 characters)
 */
export const formatOrderId = (id: string): string => {
  return id.substring(id.length - 8).toUpperCase();
};
