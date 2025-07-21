import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';
import type { Order, CreateOrderPayload } from '../types/order';
import type { OrderFilter } from '../hooks/useOrderFilters';

// Order API endpoints
export const getUserOrders = async (filters?: OrderFilter): Promise<Order[]> => {
  try {
    const response = await axiosInstance.get('/orders/myorders', { params: filters });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    toast.error('Failed to fetch orders');
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    toast.error('Failed to fetch order details');
    throw error;
  }
};

export const createOrder = async (data: CreateOrderPayload): Promise<Order> => {
  try {
    const response = await axiosInstance.post('/orders', data);
    toast.success('Order created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order');
    throw error;
  }
};

export const cancelOrder = async (id: string): Promise<Order> => {
  try {
    console.log('Service: Cancelling order with ID:', id);
    const response = await axiosInstance.delete(`/orders/${id}`);
    console.log('Service: Order cancelled successfully, response:', response.data);
    toast.success('Đơn hàng đã được hủy thành công');
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    toast.error('Không thể hủy đơn hàng');
    throw error;
  }
};

// Admin endpoints
export const getAllOrders = async (filters?: OrderFilter): Promise<Order[]> => {
  try {
    const response = await axiosInstance.get('/orders', { params: filters });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching all orders:', error);
    toast.error('Failed to fetch orders list');
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string, 
  status: string, 
  isPaid?: boolean
): Promise<Order> => {
  try {
    const response = await axiosInstance.put(`/orders/${id}`, { status, isPaid });
    toast.success('Order status updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    throw error;
  }
};
