import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import AuthForm from '../../components/auth/AuthForm';
import { ROUTES } from '../../constants/routes';

const Login = () => {  
  const { mutateAsync: login, isPending: isLoading, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      console.log('Login attempt started');
      const user = await login(values);
      console.log('Login successful, user data:', user);
      
      // Get redirect path from location state or default based on role
      const from = location.state?.from?.pathname || 
        (user?.role === 'admin' ? ROUTES.ADMIN.ROOT : ROUTES.CUSTOMER.ROOT);
      console.log('Will navigate to:', from);
      
      // Show toast immediately
      toast.success('Đăng nhập thành công!');
      
      // Use a slightly longer timeout to ensure navigation happens after toast is shown
      setTimeout(() => {
        console.log('Navigating to:', from);
        navigate(from, { replace: true });
      }, 100);
    } catch (error) {
      // Error is already handled by hook and toast notification via axios interceptor
      console.error('Login failed:', error);
    }
  };
  
  return (
    <AuthForm 
      type="login"
      onSubmit={handleLogin}
      isSubmitting={isLoading}
      error={error?.message ?? null}
    />
  );
};

export default Login;
