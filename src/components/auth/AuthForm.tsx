import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const { Title } = Typography;

interface FormValues {
  name?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isSubmitting,
  error
}) => {
  const [form] = Form.useForm();
  const isLogin = type === 'login';
  
  return (
    <div className="auth-form-container">
      <Card className="auth-form-card">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </Title>
        
        {error && (
          <Alert
            message={isLogin ? "Lỗi đăng nhập" : "Lỗi đăng ký"}
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form
          form={form}
          name={type}
          layout="vertical"
          onFinish={onSubmit}
        >
          {!isLogin && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Họ tên" 
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              loading={isSubmitting}
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </Form.Item>
        </Form>
        
        <Typography.Paragraph style={{ marginTop: 16, textAlign: 'center' }}>
          {isLogin ? (
            <>Bạn chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký ngay!</Link></>
          ) : (
            <>Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập!</Link></>
          )}
        </Typography.Paragraph>
      </Card>
    </div>
  );
};

export default AuthForm;