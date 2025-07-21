import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as userService from '../services/userService';
import type { User, Address, AddressInput } from '../types/user';
import { QUERY_KEYS } from '../lib/query-keys';
import { useAuth } from './useAuth';

// Get user profile
export const useUserProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: async (): Promise<User> => {
      const response = await userService.getUserProfile();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all users (admin)
export const useUsers = (params?: userService.UserParams) => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.USER.LIST, params],
    queryFn: async () => {
      const response = await userService.getUsers(params);
      return response;
    },
    enabled: isAdmin,
    staleTime: 2 * 60 * 1000,
  });
};

// Get user addresses
export const useUserAddresses = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.USER.ADDRESSES,
    queryFn: async (): Promise<Address[]> => {
      const response = await userService.getUserAddresses();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      return await userService.updateUserProfile(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật thông tin thất bại');
    },
  });
};

// Add user address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData: AddressInput) => {
      return await userService.addUserAddress(addressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ADDRESSES });
      toast.success('Thêm địa chỉ thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Thêm địa chỉ thất bại');
    },
  });
};

// Update user address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Address) => {
      return await userService.updateUserAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ADDRESSES });
      toast.success('Cập nhật địa chỉ thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật địa chỉ thất bại');
    },
  });
};

// Delete user address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      return await userService.deleteUserAddress(addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ADDRESSES });
      toast.success('Xóa địa chỉ thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa địa chỉ thất bại');
    },
  });
};

// Get user wishlist
export const useWishlist = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.USER.WISHLIST,
    queryFn: async () => {      const response = await userService.getWishlist();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Toggle wishlist item
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, action }: { productId: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        return await userService.addToWishlist(productId);
      } else {
        return await userService.removeFromWishlist(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.WISHLIST });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });
};
