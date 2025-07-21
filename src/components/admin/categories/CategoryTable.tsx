import React from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tag,
  Tooltip
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Category } from '../../../types/category';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onView
}) => {
  const columns: ColumnsType<Category> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: Category) => (
        <span 
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => onView(record._id)}
        >
          {name}
        </span>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false
      },      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          <span>{description || 'Không có mô tả'}</span>
        </Tooltip>
      ),
      width: 300
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isActive ? 'Kích hoạt' : 'Vô hiệu'}
        </Tag>
      ),
      filters: [
        { text: 'Kích hoạt', value: true },
        { text: 'Vô hiệu', value: false }
      ],
      onFilter: (value, record) => record.isActive === value
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record._id)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => onDelete(record._id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="_id"
      loading={isLoading}
      pagination={false}
      locale={{ emptyText: 'Không có dữ liệu' }}
      scroll={{ x: 1200 }}
      style={{ width: '100%' }}
    />
  );
};

export default CategoryTable;
