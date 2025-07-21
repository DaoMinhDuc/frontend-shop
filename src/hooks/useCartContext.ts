import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from './useCartQuery';

export const useCartContext = () => {
  // Always call all hooks unconditionally (rules of hooks)
  const cartQuery = useCart();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const cartItems = cartQuery.data?.items || [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);  const cartTotal = cartItems.reduce((sum, item) => {
    const effectivePrice = item.product?.price || item.price;
    return sum + (effectivePrice * item.quantity);
  }, 0);

  return {
    cartItems,
    cartTotal,
    cartCount,
    isLoading: cartQuery.isLoading || addToCartMutation.isPending || 
               updateCartItemMutation.isPending || removeCartItemMutation.isPending || 
               clearCartMutation.isPending,
    error: cartQuery.error || addToCartMutation.error || updateCartItemMutation.error || 
           removeCartItemMutation.error || clearCartMutation.error,
    fetchCart: async () => {
      await cartQuery.refetch();
    },
    addToCart: async (productId: string, quantity: number) => {
      await addToCartMutation.mutateAsync({ productId, quantity });
    },
    updateCartItemQuantity: async (itemId: string, quantity: number) => {
      await updateCartItemMutation.mutateAsync({ itemId, quantity });
    },
    removeCartItem: async (itemId: string) => {
      await removeCartItemMutation.mutateAsync(itemId);
    },
    clearCart: async () => {
      await clearCartMutation.mutateAsync();
    }
  };
};

export default useCartContext;
