import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  message,
  Space,
  Spin,
  Alert
} from 'antd';
import { PageHeader, CustomCard } from '../../../components/shared';
import { getUserById, updateUser, type UserUpdateData } from '../../../services/userService';
import { ROUTES } from '../../../constants/routes';
import type { User } from '../../../types/user';

const { Option } = Select;

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setInitialLoading(true);
        if (id) {
          const userData = await getUserById(id);
          setUser(userData);
          
          // Set form values
          form.setFieldsValue({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            phone: userData.phone || '',
            isActive: userData.isActive !== undefined ? userData.isActive : true
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error as Error);
        message.error('Failed to fetch user details');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchUser();
  }, [id, form]);
  
  const handleSubmit = async (values: UserUpdateData) => {
    if (!id) return;
    
    try {
      setLoading(true);
      const dataToUpdate = {
        name: values.name,
        role: values.role,
        phone: values.phone,
        isActive: values.isActive
      };
      await updateUser(id, dataToUpdate);
      message.success('Cập nhật người dùng thành công');
      navigate(ROUTES.ADMIN.USERS.LIST);
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Không thể cập nhật người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <CustomCard>
        <PageHeader 
          title="Chỉnh sửa người dùng"
          backButtonPath={ROUTES.ADMIN.USERS.LIST}
        />
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải thông tin người dùng...</p>
        </div>
      </CustomCard>
    );
  }
  
  if (error) {
    return (
      <CustomCard>
        <PageHeader 
          title="Chỉnh sửa người dùng"
          backButtonPath={ROUTES.ADMIN.USERS.LIST}
        />
        <Alert
          message="Lỗi"
          description={`Không thể tải thông tin người dùng: ${error.message}`}
          type="error"
          showIcon
        />
      </CustomCard>
    );
  }
  
  if (!user) {
    return (
      <CustomCard>
        <PageHeader 
          title="Chỉnh sửa người dùng"
          backButtonPath={ROUTES.ADMIN.USERS.LIST}
        />
        <Alert
          message="Không tìm thấy"
          description="Không tìm thấy thông tin người dùng"
          type="warning"
          showIcon
        />
      </CustomCard>
    );
  }
  
  return (
    <CustomCard>
      <PageHeader 
        title="Chỉnh sửa người dùng"
        backButtonPath={ROUTES.ADMIN.USERS.LIST}
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Họ tên người dùng" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Email" disabled />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
        
        <Form.Item
          name="isActive"
          label="Trạng thái"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Kích hoạt" 
            unCheckedChildren="Vô hiệu" 
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              Cập nhật
            </Button>
            <Button onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </CustomCard>
  );
};

export default UserEdit;
