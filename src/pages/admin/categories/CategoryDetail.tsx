import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button,
  Tag,
  Space,
  Popconfirm,
  message
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useCategory, useDeleteCategory } from '../../../hooks/useCategory';
import { PageHeader, CustomCard } from '../../../components/shared';
import { ROUTES } from '../../../constants/routes';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch category data
  const { data: category, isLoading } = useCategory(id as string);
  const { mutate: deleteCategory } = useDeleteCategory();const handleDelete = async () => {
    try {
      await deleteCategory(id as string);
      message.success('Xóa danh mục thành công');
      navigate(ROUTES.ADMIN.CATEGORIES.LIST);
    } catch (error) {
      message.error('Không thể xóa danh mục');
      console.error('Error deleting category:', error);
    }
  };
    const handleEdit = () => {
    if (id) {
      navigate(ROUTES.ADMIN.CATEGORIES.EDIT(id));
    }
  };
  
  if (isLoading) {
    return (      <CustomCard>
        <PageHeader 
          title="Chi tiết danh mục"
          backButtonPath={ROUTES.ADMIN.CATEGORIES.LIST}
        />
        <div>Đang tải...</div>
      </CustomCard>
    );
  }
  
  if (!category) {
    return (      <CustomCard>
        <PageHeader 
          title="Chi tiết danh mục"
          backButtonPath={ROUTES.ADMIN.CATEGORIES.LIST}
        />
        <div>Không tìm thấy danh mục</div>
      </CustomCard>
    );
  }
  
  return (    <CustomCard>
      <PageHeader 
        title="Chi tiết danh mục"
        backButtonPath={ROUTES.ADMIN.CATEGORIES.LIST}
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
              title="Bạn có chắc chắn muốn xóa danh mục này?"
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
        <Card title="Thông tin danh mục">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Tên danh mục">
              {category.name}
            </Descriptions.Item>
            <Descriptions.Item label="Slug">
              {category.slug}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag 
                color={category.isActive ? 'success' : 'error'} 
                icon={category.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              >
                {category.isActive ? 'Kích hoạt' : 'Vô hiệu'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {category.createdAt ? new Date(category.createdAt).toLocaleString('vi-VN') : 'N/A'}
            </Descriptions.Item>
            {category.updatedAt && (
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(category.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
        
        <Card title="Mô tả danh mục">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Mô tả chi tiết">
              {category.description || 'Không có mô tả'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </CustomCard>
  );
};

export default CategoryDetail;
