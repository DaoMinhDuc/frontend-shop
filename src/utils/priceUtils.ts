// Utility functions for price calculations with discounts

export interface DiscountInfo {
  isActive: boolean;
  percentage: number;
  startDate: string | null;
  endDate: string | null;
}

/**
 * Check if a discount is currently active
 */
export const isDiscountActive = (discount?: DiscountInfo | null): boolean => {
  if (!discount || !discount.isActive || !discount.percentage) {
    return false;
  }

  const now = new Date();
  const startDate = discount.startDate ? new Date(discount.startDate) : null;
  const endDate = discount.endDate ? new Date(discount.endDate) : null;

  return (!startDate || startDate <= now) && (!endDate || endDate >= now);
};

/**
 * Calculate discounted price if discount is active
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discount?: DiscountInfo | null
): number => {
  if (!isDiscountActive(discount)) {
    return originalPrice;
  }

  const discountPercent = discount!.percentage / 100;
  return originalPrice * (1 - discountPercent);
};

/**
 * Get the effective price (discounted if applicable, otherwise original)
 */
export const getEffectivePrice = (
  originalPrice: number,
  discount?: DiscountInfo | null
): number => {
  return calculateDiscountedPrice(originalPrice, discount);
};

/**
 * Check if an item has an active discount
 */
export const hasActiveDiscount = (discount?: DiscountInfo | null): boolean => {
  return isDiscountActive(discount);
};

/**
 * Format currency in VND
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};
