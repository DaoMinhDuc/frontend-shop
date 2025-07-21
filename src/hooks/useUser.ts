import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import * as userService from '../services/userService';
import type { UserProfile, Address, AddressInput, User } from '../types/user';

// Query keys
export const QUERY_KEYS = {
  USER_PROFILE: 'user-profile',
  USERS: 'users',
  ADDRESSES: 'user-addresses',
  WISHLIST: 'user-wishlist'
} as const;

interface ApiResponse<T> {
  status: string;
  data: T;
  results: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useUsers = () => {
  return useQuery<ApiResponse<User[]>>({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: () => userService.getUsers()
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: userService.getUserProfile
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => userService.updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], data);
      message.success('Cập nhật thông tin thành công!');
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => 
      userService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      message.success('Đổi mật khẩu thành công!');
    }
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADDRESSES],
    queryFn: userService.getUserAddresses
  });
};

export const useManageAddresses = () => {
  const queryClient = useQueryClient();

  const addAddress = useMutation({
    mutationFn: (address: AddressInput & { isDefault: boolean }) => userService.addUserAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      message.success('Thêm địa chỉ thành công!');
    }
  });

  const updateAddress = useMutation({
    mutationFn: (address: Address) => userService.updateUserAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      message.success('Cập nhật địa chỉ thành công!');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: (addressId: string) => userService.deleteUserAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      message.success('Xóa địa chỉ thành công!');
    }
  });

  return {
    addAddress,
    updateAddress,
    deleteAddress
  };
};

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: userService.getWishlist
  });

  const removeFromWishlist = useMutation({
    mutationFn: (productId: string) => userService.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      message.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
    }
  });

  const addToWishlist = useMutation({
    mutationFn: (productId: string) => userService.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      message.success('Đã thêm sản phẩm vào danh sách yêu thích');
    }
  });
  return {
    wishlist,
    isLoading,
    isError,
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
    isRemoving: removeFromWishlist.isPending,
    isAdding: addToWishlist.isPending
  };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      message.success('Người dùng đã được xóa thành công');
    },
    onError: (error) => {
      message.error('Không thể xóa người dùng');
      console.error('Delete user error:', error);
    }
  });
};
