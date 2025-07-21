import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the token
axiosInstance.interceptors.request.use((config) => {
  try {
    // Try to get user data from session storage
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
        return config;
      }
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  } catch (e) {
    console.error('Error setting auth token:', e);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Optional: Add success handling here if needed
    if (response.config.method !== 'get') {
      // Don't show success messages for GET requests
      // Toast is already handled in individual services
    }
    return response;
  },
  (error) => {
    const userData = sessionStorage.getItem('user');
    const hasUserSession = !!userData;
    
    const isInitialLoad = document.readyState !== 'complete'; 
      if (error.response) {
      if (error.response.status === 401) {
        // Clear invalid session
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        
        if (hasUserSession) {
          toast.error('Your session has expired. Please login again.');
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else if (error.response.status === 403) {
        // Check if this is wishlist-related request
        const isWishlistRequest = error.config.url.includes('/wishlist');
        
        if (isWishlistRequest) {
          // Don't show error toast for wishlist requests - just log it
          console.log('Wishlist access requires authentication (handled silently)');
        } else if (hasUserSession) {
          toast.error('You do not have permission to perform this action');
        } else {
          console.log('Authentication required for this action (silently handled)');
        }
      } else if (!isInitialLoad && hasUserSession) {
        const message = error.response?.data?.message || 
                       error.response?.data?.error || 
                       'Server error occurred';
        toast.error(message);
      }
    } else if (error.request && !isInitialLoad && hasUserSession) {
      toast.error('No response received from server. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
