import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as authService from '../services/authService';
import { QUERY_KEYS } from '../lib/query-keys';

// Auth specific user interface
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
  phone?: string;
  isActive?: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// Get current user from session storage
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: () => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return user;
    },
    retry: false,
    staleTime: Infinity,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials): Promise<AuthUser> => {
      const response = await authService.login({ email, password });
      return response;
    },
    onSuccess: (user: AuthUser) => {
      // Update the user query cache
      queryClient.setQueryData(QUERY_KEYS.USER.PROFILE, user);
      toast.success('Đăng nhập thành công!');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đăng nhập thất bại');
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ name, email, password }: RegisterCredentials): Promise<AuthUser> => {
      const response = await authService.register({ name, email, password });
      return response;
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(QUERY_KEYS.USER.PROFILE, user);
      toast.success('Đăng ký thành công!');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đăng ký thất bại');
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    },
  });
};

// Check authentication status
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
  };
};
