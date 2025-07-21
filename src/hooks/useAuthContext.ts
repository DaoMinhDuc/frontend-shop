import { useAuth as useAuthQuery } from './useAuth';

// This hook provides the same interface as the old AuthContext
// but uses React Query underneath
export const useAuthContext = () => {
  const { 
    user, 
    isLoading, 
    error, 
    isAuthenticated, 
    isAdmin 
  } = useAuthQuery();

  return {
    user,
    loading: isLoading,
    error,
    isAuthenticated,
    isAdmin,
    // Note: The mutations (login, register, logout) should be used directly
    // from their respective hooks (useLogin, useRegister, useLogout)
    login: () => {
      throw new Error('Use useLogin hook directly for login functionality');
    },
    register: () => {
      throw new Error('Use useRegister hook directly for register functionality');
    },
    logout: () => {
      throw new Error('Use useLogout hook directly for logout functionality');
    },
  };
};

export default useAuthContext;
