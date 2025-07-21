import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  message,
  Space} from 'antd';
import { PageHeader, CustomCard } from '../../../components/shared';
import { createUser, type UserCreateData } from '../../../services/userService';
import { ROUTES } from '../../../constants/routes';

const { Option } = Select;

const UserAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Set default values
  React.useEffect(() => {
    form.setFieldsValue({
      role: 'user',
      isActive: true
    });
  }, [form]);
  
  const handleSubmit = async (values: UserCreateData) => {
    try {
      setLoading(true);
      await createUser(values);
      message.success('Người dùng đã được tạo thành công');
      navigate(ROUTES.ADMIN.USERS.LIST);
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Không thể tạo người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CustomCard>
      <PageHeader 
        title="Thêm người dùng mới"
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
          <Input placeholder="Email" />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
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
              Tạo người dùng
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

export default UserAdd;
