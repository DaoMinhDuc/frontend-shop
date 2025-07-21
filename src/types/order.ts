import type { CartItem, ProductInfo } from './cart';

export interface ShippingAddress {
  name: string;
  address: string;
  city?: string;
  ward?: string;
  district?: string;
  province?: string;
  phone: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

// Standard item format for orders
export interface OrderItem {
  product: string | ProductInfo;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  _id: string;
  user: OrderUser | string;
  items: CartItem[] | OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  isPaid: boolean;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// For OrderTracking component
export interface TrackedOrder extends Omit<Order, 'user'> {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface UpdateOrderStatusPayload {
  id: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled';
  isPaid?: boolean;
}
