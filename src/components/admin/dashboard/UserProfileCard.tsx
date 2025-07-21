import React from 'react';
import { Card, Avatar, Typography, Row, Col, Tag, Descriptions } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Define a local interface for the user that can handle both AuthContext user and User from types
interface UserProfileProps {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  token?: string;
}

interface UserProfileCardProps {
  user: UserProfileProps;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  // Function to get role color
  const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'green';
      case 'customer':
        return 'blue';
      default:
        return 'default';
    }
  };

  // Format the date if it exists
  const formattedDate = user.createdAt ? 
    new Date(user.createdAt).toLocaleDateString('vi-VN') : 
    'Không có dữ liệu';

  return (
    <Card 
      className="user-profile-card"
      style={{ 
        marginBottom: 24,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Row gutter={[24, 0]} align="middle">
        <Col xs={24} sm={8} md={6} lg={4} xl={3} style={{ textAlign: 'center' }}>
          <Avatar 
            size={100} 
            src={user.avatar}
            icon={!user.avatar && <UserOutlined />}
            style={{ 
              backgroundColor: !user.avatar ? '#1890ff' : undefined,
              marginBottom: 16
            }}
          />
        </Col>

        <Col xs={24} sm={16} md={18} lg={20} xl={21}>
          <Title level={4} style={{ marginBottom: 8 }}>{user.name}</Title>
          
          <Tag color={getRoleColor(user.role)} style={{ marginBottom: 16 }}>
            {user.role.toUpperCase()}
          </Tag>
          
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {user.email}
            </Descriptions.Item>
            
            {user.phone && (
              <Descriptions.Item label={<><PhoneOutlined /> Điện thoại</>}>
                {user.phone}
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
              {formattedDate}
            </Descriptions.Item>
            
            <Descriptions.Item label={<><TeamOutlined /> Trạng thái</>}>
              {user.isActive !== undefined ? (
                <Tag color={user.isActive ? 'success' : 'error'}>
                  {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                </Tag>
              ) : (
                <Tag color="success">Đang hoạt động</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default UserProfileCard;
