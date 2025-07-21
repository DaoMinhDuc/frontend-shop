import { useQuery } from '@tanstack/react-query';
import * as productService from '../services/productService';

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      try {
        const data = await productService.getProducts({ featured: true });
        return data || [];
      } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useDiscountedProducts = () => {
  return useQuery({
    queryKey: ['discounted-products'],
    queryFn: () => productService.getProducts({ discount: true }),
  });
};
