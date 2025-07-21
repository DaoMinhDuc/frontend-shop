import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  Row, 
  Col,
  Modal,
  Space
} from 'antd';
import { useUserProfile, useUpdateProfile, useChangePassword } from '../../../hooks/useUser';
import type { User, UserProfile } from '../../../types/user';
import { LoadingIndicator } from '../../shared';
import { type PasswordChangeForm, setUserFormValues } from '../../../utils/userUtils';

const { Title } = Typography;

interface ProfileInfoProps {
  user?: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user: propUser }) => {
  // Form state
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  // UI state
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  
  // Data fetching hooks
  const { data: fetchedUser, isLoading: isLoadingUser } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  
  useEffect(() => {
    if (fetchedUser) {
      setUserFormValues(form, fetchedUser);
    }
  }, [fetchedUser, form]);
  
  const handleSubmit = (values: Partial<UserProfile>): void => {
    updateProfileMutation.mutate(values);
  };

  const showPasswordModal = () => {
    setPasswordVisible(true);
  };

  const handlePasswordCancel = () => {
    setPasswordVisible(false);
    passwordForm.resetFields();
  };
  
  const handlePasswordChange = (values: PasswordChangeForm): void => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    }, {
      onSuccess: () => {
        setPasswordVisible(false);
        passwordForm.resetFields();
      }
    });
  };

  if (isLoadingUser && !propUser) {
    return <LoadingIndicator />;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Title level={4}>Thông tin cá nhân</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={updateProfileMutation.isPending}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên' },
                  { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Email"
                name="email"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Space>
                <Button type="primary" htmlType="submit" loading={updateProfileMutation.isPending}>
                  Lưu thay đổi
                </Button>
                <Button onClick={showPasswordModal}>
                  Đổi mật khẩu
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal
        title="Đổi mật khẩu"
        open={passwordVisible}
        onCancel={handlePasswordCancel}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={changePasswordMutation.isPending}
              >
                Xác nhận
              </Button>
              <Button onClick={handlePasswordCancel}>
                Hủy bỏ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileInfo;
