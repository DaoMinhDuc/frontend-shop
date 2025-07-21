import { useState, useCallback, useEffect, useRef } from 'react';
import axiosInstance from '../lib/axios';
import { notification } from 'antd';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useWishlistActions = () => {
  const { user } = useAuthContext();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Track if we've had a server error to avoid constant failing requests
  const hasServerError = useRef(false);

  const getLocalWishlist = useCallback(() => {
    try {
      const localWishlist = localStorage.getItem('guestWishlist');
      return localWishlist ? JSON.parse(localWishlist) : [];
    } catch (error) {
      console.error('Error loading local wishlist:', error);
      return [];
    }
  }, []);

  const saveLocalWishlist = useCallback((productIds: string[]) => {
    try {
      localStorage.setItem('guestWishlist', JSON.stringify(productIds));
    } catch (error) {
      console.error('Error saving local wishlist:', error);
    }
  }, []);  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        // For authenticated users, use the wishlist endpoint
        console.log('Fetching wishlist for authenticated user');
        const response = await axiosInstance.get('/users/wishlist');
        console.log('Wishlist API response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Process the returned data - can be an array of objects or array of IDs
          const productIds = response.data.map((item: { _id?: string } | string) => 
            typeof item === 'string' ? item : item._id || '');
          setWishlist(productIds);
        }
        // Reset the server error flag since the request succeeded
        hasServerError.current = false;
      } else {
        // For unauthenticated users, use local storage
        console.log('User not authenticated, using local wishlist');
        const localWishlist = getLocalWishlist();
        setWishlist(localWishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      
      // Always use localStorage on error
      const localWishlist = getLocalWishlist();
      setWishlist(localWishlist);
      
      // Set server error flag if we got a 500 error
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        hasServerError.current = true;
      }
      
      // More detailed logging for debugging
      if (axios.isAxiosError(error)) {
        console.log(`API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, getLocalWishlist]);  const toggleWishlist = useCallback(async (productId: string) => {
    // Handle guest user wishlist through localStorage
    if (!user) {
      console.log('Guest user toggling wishlist item:', productId);
      const localWishlist = getLocalWishlist();
      const isInWishlist = localWishlist.includes(productId);
      let updatedWishlist;
      
      if (isInWishlist) {
        updatedWishlist = localWishlist.filter((id: string) => id !== productId);
        notification.success({
          message: 'Removed from wishlist',
          placement: 'topRight'
        });
      } else {
        updatedWishlist = [...localWishlist, productId];
        notification.success({
          message: 'Added to wishlist',
          placement: 'topRight'
        });
      }
      
      saveLocalWishlist(updatedWishlist);
      setWishlist(updatedWishlist);
      return;
    }
    
    if (isLoading || togglingWishlist) {
      return; // Prevent multiple simultaneous requests
    }
    
    setTogglingWishlist(productId);
    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        console.log('Removing product from wishlist:', productId);
        const response = await axiosInstance.delete(`/users/wishlist/${productId}`);
        console.log('Remove response:', response.data);
        
        if (response.data) {
          // Update the wishlist state
          setWishlist(prev => prev.filter(id => id !== productId));
          notification.success({
            message: 'Removed from wishlist',
            placement: 'topRight'
          });
        }
      } else {
        console.log('Adding product to wishlist:', productId);
        const response = await axiosInstance.post('/users/wishlist', { productId });
        console.log('Add response:', response.data);
        
        if (response.data) {
          // Update the wishlist state
          setWishlist(prev => [...prev, productId]);
          notification.success({
            message: 'Added to wishlist',
            placement: 'topRight'
          });
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      
      // Handle network errors by updating local state anyway
      // This provides a good UX even if the server request fails
      const isInWishlist = wishlist.includes(productId);
      if (isInWishlist) {
        setWishlist(prev => prev.filter(id => id !== productId));
        notification.info({
          message: 'Removed from wishlist (offline mode)',
          placement: 'topRight'
        });
      } else {
        setWishlist(prev => [...prev, productId]);
        notification.info({
          message: 'Added to wishlist (offline mode)',
          placement: 'topRight'
        });
      }
    } finally {
      setTogglingWishlist(null);
    }
  }, [wishlist, user, isLoading, togglingWishlist, getLocalWishlist, saveLocalWishlist]);
    // Fetch wishlist when user changes
  useEffect(() => {
    if (user) {
      // Only fetch if we haven't encountered a server error yet
      if (!hasServerError.current) {
        fetchWishlist();
      } else {
        // Use local storage if we know the server is having issues
        const localWishlist = getLocalWishlist();
        setWishlist(localWishlist);
      }
    } else {
      const localWishlist = getLocalWishlist();
      setWishlist(localWishlist);
    }
  }, [user, fetchWishlist, getLocalWishlist]);

  // Sync local wishlist with server when user logs in
  useEffect(() => {
    const syncWishlist = async () => {
      if (user) {
        const localWishlist = getLocalWishlist();
        if (localWishlist.length > 0) {
          console.log('Syncing local wishlist with server:', localWishlist);
          // Add local wishlist items to server
          for (const productId of localWishlist) {
            try {
              await axiosInstance.post('/users/wishlist', { productId });
            } catch (error) {
              // Ignore errors like "already in wishlist"
              console.log('Error while syncing item to server:', error);
            }
          }
          // Clear local wishlist
          saveLocalWishlist([]);
          // Fetch updated wishlist from server
          fetchWishlist();
        }
      }
    };
    
    syncWishlist();
  }, [user, getLocalWishlist, saveLocalWishlist, fetchWishlist]);
  
  return {
    wishlist,
    isInWishlist: useCallback((productId: string) => wishlist.includes(productId), [wishlist]),
    togglingWishlist,
    toggleWishlist,
    fetchWishlist,
    isLoading
  };
};
