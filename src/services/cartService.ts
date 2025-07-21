import axiosInstance from '../lib/axios';
import type { CartItem } from '../types/cart';

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// Get cart
export const getCart = async (): Promise<Cart> => {
  const { data } = await axiosInstance.get('/cart');
  // Ensure we get the data property from the response
  if (data && data.data) {
    return data.data;
  }
  return data;
};

// Add to cart
export const addToCart = async (productId: string, quantity: number): Promise<Cart> => {
  const { data } = await axiosInstance.post('/cart', { productId, quantity });
  return data;
};

// Update cart item
export const updateCartItem = async (itemId: string, quantity: number): Promise<Cart> => {
  const { data } = await axiosInstance.put(`/cart/${itemId}`, { quantity });
  return data;
};

// Remove cart item
export const removeCartItem = async (itemId: string): Promise<Cart> => {
  const { data } = await axiosInstance.delete(`/cart/${itemId}`);
  return data;
};

// Clear cart
export const clearCart = async (): Promise<Cart> => {
  const { data } = await axiosInstance.delete('/cart');
  return data;
};
