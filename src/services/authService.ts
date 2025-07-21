import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Auth API endpoints
export const login = async (credentials: LoginRequest): Promise<User> => {
  try {    const response = await axiosInstance.post('/auth/login', credentials);
    const userData = response.data.data; // Get data from response.data.data
    
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', userData.token);
    
    if (!userData || !userData.token) {
      throw new Error('Invalid user data received');
    }
    
    return userData;
  } catch (error) {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {    const response = await axiosInstance.post('/auth/register', userData);
    const data = response.data.data; // Get data from response.data.data
    
    // Make sure user data is complete
    if (!data || !data.token) {
      console.error('Invalid user data from register response:', data);
      throw new Error('Invalid user data received');
    }
    
    // Save user data and token to session storage
    sessionStorage.setItem('user', JSON.stringify(data));
    sessionStorage.setItem('token', data.token);
    
    console.log('authService.register - User data saved:', data);
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    throw error;
  }
};

export const logout = (): { success: boolean } => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  toast.info('Logged out successfully');
  return { success: true };
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as User : null;
  } catch {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    return null;
  }
};
