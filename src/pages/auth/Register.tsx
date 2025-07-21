import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import AuthForm from '../../components/auth/AuthForm';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants/routes';

const Register = () => {  
  const { mutateAsync: register, isPending: isLoading, error } = useRegister();
  const navigate = useNavigate();
    const handleRegister = async (values: { name?: string; email: string; password: string }) => {
    try {
      if (!values.name?.trim()) {
        toast.error('Name is required.');
        return;
      }
      console.log('Registration attempt started');
      const user = await register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      console.log('Registration successful, user data:', user);
      console.log('Will navigate to customer dashboard');
      
      // Show toast immediately
      toast.success('Đăng ký thành công!');
      
      // Use a slightly longer timeout to ensure navigation happens after toast is shown
      setTimeout(() => {
        console.log('Navigating to customer dashboard');
        navigate(ROUTES.CUSTOMER.ROOT, { replace: true });
      }, 100);
    } catch (error) {
      // Error is already handled by hook and toast notification
      console.error('Registration failed:', error);
    }
  };
  return (
    <AuthForm 
      type="register"
      onSubmit={handleRegister}
      isSubmitting={isLoading}
      error={error ? error.message : null}
    />
  );
};

export default Register;
