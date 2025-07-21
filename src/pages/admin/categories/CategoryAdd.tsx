import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Switch, 
  Button, 
  Space
} from 'antd';
import { useCreateCategory } from '../../../hooks/useCategory';
import { PageHeader, CustomCard } from '../../../components/shared';
import { categoryFormHelper } from '../../../utils/formHelper';
import type { CategoryFormData } from '../../../types/category';

const { TextArea } = Input;

const CategoryAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();  const { mutateAsync: createCategory, isPending: isLoading } = useCreateCategory();
  
  React.useEffect(() => {
    form.setFieldsValue({
      isActive: true
    });
  }, [form]);
  
  const handleSubmit = async (values: CategoryFormData) => {
    await categoryFormHelper.handleAddCategory(
      createCategory,
      values,
      navigate
    );
  };
    return (
    <CustomCard>
      <PageHeader 
        title="Thêm danh mục mới"
        backButtonPath="/admin/categories"
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
        >
          <Switch checkedChildren="Kích hoạt" unCheckedChildren="Vô hiệu" />
        </Form.Item>
          <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Thêm mới
            </Button>
            <Button onClick={() => navigate('/admin/categories')}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </CustomCard>
  );
};

export default CategoryAdd;
