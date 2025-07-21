import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Switch, 
  Button, 
  Space,
  Spin,
  Alert
} from 'antd';
import { 
  useCategory,
  useUpdateCategory 
} from '../../../hooks/useCategory';
import { PageHeader, CustomCard } from '../../../components/shared';
import type { CategoryFormData } from '../../../types/category';

const { TextArea } = Input;

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();  const { data: category, isLoading, error } = useCategory(id as string);  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  
  // Set form values when category data is loaded
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        isActive: category.isActive
      });
    }
  }, [category, form]);  const handleSubmit = async (values: CategoryFormData) => {
    updateCategory({ id: id as string, categoryData: values }, {
      onSuccess: () => {
        navigate('/admin/categories');
      },
      onError: (error) => {
        console.error('Error updating category:', error);
      }
    });
  };
    
  return (
    <CustomCard>
      <PageHeader
        title="Chỉnh sửa danh mục"
        backButtonPath="/admin/categories"
      />
      
      {error && (
        <Alert 
          message="Lỗi" 
          description={`Không thể tải thông tin danh mục. ${error.message}`} 
          type="error" 
          style={{ marginBottom: 16 }} 
          showIcon 
        />
      )}
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '30px 50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải thông tin danh mục...</p>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={isLoading || isUpdating}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Tên danh mục" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Mô tả về danh mục (không bắt buộc)" />
          </Form.Item>
          
          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
            extra="Kích hoạt để hiển thị danh mục này, vô hiệu để ẩn danh mục"
          >
            <Switch checkedChildren="Kích hoạt" unCheckedChildren="Vô hiệu" />
          </Form.Item>
            
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Cập nhật
              </Button>
              <Button onClick={() => navigate('/admin/categories')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </CustomCard>
  );
};

export default CategoryEdit;
