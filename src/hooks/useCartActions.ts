import { useState, useCallback } from 'react';
import axiosInstance from '../lib/axios';
import { notification } from 'antd';
import type { Product } from '../types/product';
import { useCartContext } from './useCartContext';
import { useAuthContext } from './useAuthContext';

export const useCartActions = () => {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { fetchCart } = useCartContext();
  const { user } = useAuthContext();

  const addToCart = useCallback(async (product: Product) => {
    if (!user) {
      notification.warning({
        message: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        placement: 'topRight'
      });
      return;
    }

    if (!product._id) {
      console.error('Invalid product:', product);
      return;
    }

    try {
      setAddingToCart(product._id);
      await axiosInstance.post('/cart', {
        productId: product._id,
        quantity: 1
      });
      await fetchCart();
      
      notification.success({
        message: 'Thêm vào giỏ hàng thành công',
        description: `Đã thêm ${product.name} vào giỏ hàng`,
        placement: 'topRight'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        placement: 'topRight'
      });
    } finally {
      setAddingToCart(null);
    }
  }, [fetchCart, user]);

  return {
    addingToCart,
    addToCart
  };
};
