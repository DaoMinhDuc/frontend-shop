import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as cartService from '../services/cartService';
import type { CartItem } from '../types/cart';
import { QUERY_KEYS } from '../lib/query-keys';
import { useAuth } from './useAuth';
import { getEffectivePrice } from '../utils/priceUtils';

export interface CartData {
  items: CartItem[];
}

export interface AddToCartParams {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemParams {
  itemId: string;
  quantity: number;
}

// Get cart data
export const useCart = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.CART.DETAIL,
    queryFn: async (): Promise<CartData> => {
      if (!isAuthenticated) {
        return { items: [] };
      }
      const response = await cartService.getCart();
      // Ensure cart data is properly structured
      const items = response.items.map(item => ({
        ...item,
        product: typeof item.product === 'string' ? { 
          _id: item.product,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl
        } : item.product
      }));
      return {
        ...response,
        items
      };
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: AddToCartParams) => {
      return await cartService.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Thêm vào giỏ hàng thất bại');
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: UpdateCartItemParams) => {
      return await cartService.updateCartItem(itemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
      toast.success('Đã cập nhật số lượng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật thất bại');
    },
  });
};

// Remove cart item
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return await cartService.removeCartItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa sản phẩm thất bại');
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await cartService.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
      toast.success('Đã xóa tất cả sản phẩm');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa giỏ hàng thất bại');
    },
  });
};

// Cart summary hook with computed values
export const useCartSummary = () => {
  const { data: cart, isLoading, error } = useCart();

  const cartItems = cart?.items || [];
  
  const cartCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((sum: number, item: CartItem) => {
    if (typeof item.product === 'object' && item.product !== null && 'price' in item.product) {
      const effectivePrice = getEffectivePrice(
        item.product.price, 
        item.product.discount || item.discount
      );
      return sum + (effectivePrice * item.quantity);
    }
    return sum;
  }, 0);

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    error,
  };
};

// Combined cart actions hook
export const useCartActions = () => {
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  return {
    addToCart: addToCartMutation.mutate,
    updateCartItemQuantity: updateCartItemMutation.mutate,
    removeCartItem: removeCartItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isLoading: 
      addToCartMutation.isPending ||
      updateCartItemMutation.isPending ||
      removeCartItemMutation.isPending ||
      clearCartMutation.isPending,
  };
};
