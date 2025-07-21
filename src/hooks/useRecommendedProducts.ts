import { useState, useCallback, useEffect } from 'react';
import { getProducts } from '../services/productService';
import type { Product } from '../types/product';

export const useRecommendedProducts = (limit = 4) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecommendedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);      const data = await getProducts();
      const shuffled = [...(data.data || [])].sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, limit));
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecommendedProducts();
  }, [fetchRecommendedProducts]);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchRecommendedProducts 
  };
};
