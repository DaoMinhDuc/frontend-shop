import React from 'react';
import { Card, Typography, Button } from 'antd';

const { Title } = Typography;

/**
 * Displays a prompt for users to login when they're not authenticated
 */
const LoginPrompt: React.FC = () => {
  return (
    <Card>
      <Title level={4}>Vui lòng đăng nhập để xem thông tin cá nhân</Title>
      <Button type="primary" href="/login">
        Đăng nhập
      </Button>
    </Card>
  );
};

export default LoginPrompt;
