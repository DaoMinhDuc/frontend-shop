import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as orderService from '../services/orderService';
import type { Order, CreateOrderPayload } from '../types/order';
import { QUERY_KEYS } from '../lib/query-keys';
import { useAuth } from './useAuth';
import type { OrderFilter } from './useOrderFilters';

// Get user orders
export const useUserOrders = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.ORDER.USER_ORDERS,
    queryFn: async (): Promise<Order[]> => {
      const response = await orderService.getUserOrders();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all orders (admin)
export const useAllOrders = (filters?: OrderFilter) => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.ORDER.LIST(filters ? {...filters} : {}),
    queryFn: async (): Promise<Order[]> => {
      const response = await orderService.getAllOrders(filters);
      return response;
    },
    enabled: isAdmin,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get order details
export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER.DETAIL(orderId),
    queryFn: async (): Promise<Order> => {
      const response = await orderService.getOrderById(orderId);
      return response;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderPayload): Promise<Order> => {
      const response = await orderService.createOrder(orderData);
      return response;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER.USER_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
      toast.success('Đặt hàng thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đặt hàng thất bại');
    },
  });
};

// Cancel order mutation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      return await orderService.cancelOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER.USER_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER.ALL });
      toast.success('Hủy đơn hàng thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Hủy đơn hàng thất bại');
    },
  });
};

// Update order status mutation (admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      status, 
      isPaid 
    }: { 
      orderId: string; 
      status: string; 
      isPaid?: boolean; 
    }) => {
      return await orderService.updateOrderStatus(orderId, status, isPaid);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER.ALL });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.ORDER.DETAIL(variables.orderId) 
      });
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật trạng thái thất bại');
    },
  });
};
