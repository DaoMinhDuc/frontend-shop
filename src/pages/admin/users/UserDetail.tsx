import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space,
  Tag,
  Popconfirm,
  message
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined} from '@ant-design/icons';
import { useUsers } from '../../../hooks/useUser';
import { PageHeader, CustomCard } from '../../../components/shared';
import { formatDate } from '../../../utils/format';
import { useEffect, useState } from 'react';
import type { User } from '../../../types/user';
import { ROUTES } from '../../../constants/routes';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: users, isLoading: usersLoading } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (users?.data && users.data.length > 0 && id) {
      const foundUser = users.data.find((u: { _id: string; }) => u._id === id);
      setUser(foundUser || null);
      setIsLoading(false);
    } else if (!usersLoading) {
      setIsLoading(false);
    }
  }, [users, id, usersLoading]);
    const handleEdit = () => {
    navigate(ROUTES.ADMIN.USERS.EDIT(id!));
  };
  
  const handleDelete = async () => {
    message.success('Tính năng xóa người dùng đang được phát triển');

  };
  
  // Function to get role tag
  const getRoleTag = (role: string) => {
    switch (role) {
      case 'admin':
        return <Tag color="green">ADMIN</Tag>;
      default:
        return <Tag color="default">USER</Tag>;
    }
  };
  
  if (isLoading) {
    return <CustomCard loading  />;
  }
  
  if (!user) {
    return (      <CustomCard >
        <PageHeader 
          title="Chi tiết người dùng"
          backButtonPath={ROUTES.ADMIN.USERS.LIST}
        />
        <div>Không tìm thấy người dùng</div>
      </CustomCard>
    );
  }
  
  return (
    <CustomCard >      <PageHeader 
        title="Chi tiết người dùng"
        backButtonPath={ROUTES.ADMIN.USERS.LIST}
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={handleDelete}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        }
      />
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Thông tin người dùng">
          <Descriptions bordered column={{ xs: 1, sm: 2 }} layout="vertical">
            <Descriptions.Item label="Họ tên">
              {user.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>            <Descriptions.Item label="Vai trò">
              {getRoleTag(user.role)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag 
                color="success"
                icon={<CheckCircleOutlined />}
              >
                Kích hoạt
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {user.phone || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(user.createdAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
          <Card title="Địa chỉ">
          <div>Không có thông tin địa chỉ</div>
        </Card>
      </Space>
    </CustomCard>
  );
};

export default UserDetail;
