import React, { useState } from 'react';
import { Table, Tag, Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../../../types/user';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  loading, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const handleDelete = (id: string) => {
    setDeletingUserId(id);
    if (onDelete) {
      onDelete(id);
    }
    // Reset after a delay to allow the component to show loading state
    setTimeout(() => setDeletingUserId(null), 500);
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: User) => (
        <span 
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => onView && onView(record._id)}
        >
          {name}
        </span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'green' :  'default'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || 'Chưa cập nhật'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {onEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record._id)}
              size="small"
            >
              Sửa
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title={
                <div>
                  <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                  <p>Tên: <strong>{record.name}</strong></p>
                  <p>Email: <strong>{record.email}</strong></p>
                </div>
              }
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa người dùng">
                <Button
                  type="primary" 
                  danger 
                  icon={<DeleteOutlined />} 
                  size="small"
                  loading={deletingUserId === record._id}
                >
                  Xóa
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      )
    });
  }

  return (
    <Table 
      dataSource={users.map(user => ({ ...user, key: user._id }))}
      columns={columns}
      loading={loading}
      pagination={false}
      rowKey="_id"
      scroll={{ x: 1200 }}
      style={{ width: '100%' }}
    />
  );
};

export default UserTable;
