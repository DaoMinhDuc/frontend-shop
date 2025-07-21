import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';
import type { User, UserProfile, Address, AddressInput, WishlistItem } from '../types/user';
import axios from 'axios';

interface ApiResponse<T> {
  status: string;
  data: T;
  results: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const getUsers = async (params?: UserParams): Promise<ApiResponse<User[]>> => {
  try {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to fetch users');
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Failed to fetch user profile');
    throw error;
  }
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.put('/users/profile', data);
    toast.success('Profile updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast.error('Failed to update profile');
    throw error;
  }
};

export const changePassword = async (credentials: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put('/users/change-password', credentials);
    toast.success('Password changed successfully');
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    toast.error('Failed to change password');
    throw error;
  }
};

export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  isActive?: boolean;
}

export interface UserUpdateData {
  name?: string;
  role?: string;
  phone?: string;
  isActive?: boolean;
}

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    toast.error('Failed to fetch user');
    throw error;
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    const response = await axiosInstance.post('/users', userData);
    toast.success('User created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
    throw error;
  }
};

export const updateUser = async (id: string, userData: UserUpdateData): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    toast.success('User updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
    throw error;
  }
};

export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      console.log('User not logged in, cannot fetch addresses');
      return [];
    }
    
    const response = await axiosInstance.get('/users/addresses');
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    if (axios.isAxiosError(error) && error.response?.status !== 403) {
      toast.error('Failed to fetch addresses');
    }
    return [];
  }
};

export const addUserAddress = async (address: AddressInput): Promise<Address> => {
  try {
    const response = await axiosInstance.post('/users/addresses', address);
    toast.success('Address added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    toast.error('Failed to add address');
    throw error;
  }
};

export const updateUserAddress = async (address: Address): Promise<Address> => {
  try {
    const response = await axiosInstance.put(`/users/addresses/${address._id}`, address);
    toast.success('Address updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating address ${address._id}:`, error);
    toast.error('Failed to update address');
    throw error;
  }
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/addresses/${addressId}`);
    toast.success('Address deleted successfully');
  } catch (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    toast.error('Failed to delete address');
    throw error;
  }
};

// Wishlist endpoints
export const getWishlist = async (): Promise<WishlistItem[]> => {
  try {
    // Check first if user is logged in
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      console.log('User not logged in, cannot fetch wishlist');
      return [];
    }
    
    const response = await axiosInstance.get('/users/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    if (axios.isAxiosError(error) && error.response?.status !== 403) {
      toast.error('Failed to fetch wishlist');
    }
    return [];
  }
};

export const addToWishlist = async (productId: string): Promise<WishlistItem[]> => {
  try {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      console.log('User not logged in, cannot add to wishlist');
      toast.error('Please log in to add items to your wishlist');
      return [];
    }
    
    const response = await axiosInstance.post('/users/wishlist', { productId });
    toast.success('Product added to wishlist');
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    if (axios.isAxiosError(error) && error.response?.status !== 403) {
      toast.error('Failed to add product to wishlist');
    } else {
      toast.error('Please log in to add items to your wishlist');
    }
    return [];
  }
};

export const removeFromWishlist = async (productId: string): Promise<WishlistItem[]> => {
  try {
    // Check first if user is logged in
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      console.log('User not logged in, cannot remove from wishlist');
      toast.error('Please log in to manage your wishlist');
      return [];
    }
    
    const response = await axiosInstance.delete(`/users/wishlist/${productId}`);
    toast.success('Product removed from wishlist');
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    if (axios.isAxiosError(error) && error.response?.status !== 403) {
      toast.error('Failed to remove product from wishlist');
    } else {
      toast.error('Please log in to manage your wishlist');
    }
    return [];
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${id}`);
    toast.success('Người dùng đã được xóa thành công');
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Không thể xóa người dùng');
    throw error;
  }
};
