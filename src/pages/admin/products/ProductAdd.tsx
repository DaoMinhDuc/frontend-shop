import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Switch, Button, notification, DatePicker, Divider } from 'antd';
import { ImageUploader, PageHeader, CustomCard } from '../../../components/shared';
import { getCategories } from '../../../services/categoryService';
import { addProduct } from '../../../services/productService';
import type { Category } from '../../../types/category';
import type { Product } from '../../../types/product';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormData extends Omit<Product, '_id' | 'createdAt' | 'updatedAt'> {
  discount: {
    isActive: boolean;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
  };
}

const ProductAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data); // Access the data array from the response
      } catch (error) {
        console.error('Error fetching categories:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách danh mục'
        });
      }
    };
    
    fetchCategories();
    
    // Set default values for form
    form.setFieldsValue({
      inStock: true,
      quantity: 1,
      isFeatured: false,
      discount: {
        isActive: false,
        percentage: 0,
        startDate: null,
        endDate: null
      }
    });
  }, [form]);
  
  const handleSubmit = async (values: ProductFormData) => {
    try {
      setLoading(true);
      
      // Format dates before sending to API
      const formattedValues = {
        ...values,
        discount: {
          ...values.discount,
          startDate: values.discount.startDate ? moment(values.discount.startDate).toISOString() : null,
          endDate: values.discount.endDate ? moment(values.discount.endDate).toISOString() : null
        }
      };

      await addProduct(formattedValues);
      
      notification.success({
        message: 'Thành công',
        description: 'Thêm sản phẩm mới thành công'
      });
      
      navigate('/admin/products');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm mới'
      });
    } finally {
      setLoading(false);
    }
  };

  return (    
    <CustomCard>
      <PageHeader 
        title="Thêm sản phẩm mới"
        backButtonPath="/admin/products"
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select>
            {categories.map(category => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Còn hàng"
          name="inStock"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="imageUrl"
          rules={[{ required: true, message: 'Vui lòng chọn hình ảnh' }]}
        >
          <ImageUploader />
        </Form.Item>

        <Form.Item
          label="Sản phẩm nổi bật"
          name="isFeatured"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Divider>Thông tin khuyến mãi</Divider>

        <Form.Item
          label="Kích hoạt khuyến mãi"
          name={['discount', 'isActive']}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Phần trăm giảm giá"
          name={['discount', 'percentage']}
          rules={[
            { type: 'number', min: 0, max: 100, message: 'Phần trăm giảm giá phải từ 0-100%' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name={['discount', 'startDate']}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name={['discount', 'endDate']}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </CustomCard>
  );
};

export default ProductAdd;
