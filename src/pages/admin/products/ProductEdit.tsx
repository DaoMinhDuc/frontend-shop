import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  message,
  Space,
  Row,
  Col,
  Divider,
  DatePicker
} from 'antd';
import { PageHeader, CustomCard, ImageUploader } from '../../../components/shared';

import type { Category } from '../../../types/category';
import { getCategories } from '../../../services/categoryService';
import { getProductById, updateProduct } from '../../../services/productService';
import { productFormHelper } from '../../../utils/formHelper';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  quantity: number;
  imageUrl: string;
  isFeatured: boolean;
  discount: {
    isActive: boolean;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
  };
}

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);        const [categoriesData, product] = await Promise.all([
          getCategories(),
          getProductById(id as string)
        ]);
        
        setCategories(categoriesData.data); // Access the data array from the response
        
        // Set form values
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          inStock: product.inStock,
          quantity: product.quantity,
          imageUrl: product.imageUrl,
          isFeatured: product.isFeatured,
          discount: product.discount ? {
            isActive: product.discount.isActive || false,
            percentage: product.discount.percentage || 0,
            startDate: product.discount.startDate ? moment(product.discount.startDate) : null,
            endDate: product.discount.endDate ? moment(product.discount.endDate) : null
          } : {
            isActive: false,
            percentage: 0,
            startDate: null,
            endDate: null
          }
        });

        console.log('Form initialized with dates:', {
          startDate: product.discount?.startDate,
          endDate: product.discount?.endDate
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Không thể tải dữ liệu sản phẩm');
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, form]);

  const handleSubmit = async (values: ProductFormData) => {
    try {
      // Deep clone values to avoid mutations
      const clonedValues = JSON.parse(JSON.stringify(values));      // Format dates to store in UTC
      if (clonedValues.discount?.isActive) {
        if (clonedValues.discount.startDate) {
          const startDate = moment(clonedValues.discount.startDate);
          clonedValues.discount.startDate = startDate.utc().format();
        }
        if (clonedValues.discount.endDate) {
          const endDate = moment(clonedValues.discount.endDate);
          clonedValues.discount.endDate = endDate.utc().format();
        }
      } else {
        // If discount is not active, reset all discount fields
        clonedValues.discount = {
          isActive: false,
          percentage: 0,
          startDate: null,
          endDate: null
        };
      }

      console.log('Submitting form with values:', {
        original: values,
        formatted: clonedValues
      });

      await productFormHelper.handleUpdateProduct(
        updateProduct,
        id as string,
        clonedValues,
        navigate,
        setLoading
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };    if (initialLoading) {
    return (
      <CustomCard loading>
        <PageHeader 
          title="Chỉnh sửa sản phẩm"
          backButtonPath="/admin/products"
        />
        <div>Đang tải...</div>
      </CustomCard>
    );
  }
    return (
    <CustomCard>
      <PageHeader 
        title="Chỉnh sửa sản phẩm"
        backButtonPath="/admin/products"
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 900 }}
      >
        <Row gutter={24}>         
          <Col xs={24} sm={24} md={10} lg={10}>
            <div style={{ marginBottom: 24 }}>
              <Form.Item
                name="imageUrl"
                label="Hình ảnh sản phẩm"
                rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh sản phẩm' }]}
              >
                <ImageUploader />
              </Form.Item>
            </div>
            
            <Form.Item
              name="inStock"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Còn hàng" 
                unCheckedChildren="Hết hàng" 
                style={{ width: 'auto' }} 
              />
            </Form.Item>

            <Form.Item
              name="isFeatured"
              label="Sản phẩm nổi bật"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Có" 
                unCheckedChildren="Không" 
                style={{ width: 'auto' }} 
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={24} md={14} lg={14}>
            <div style={{ maxWidth: '90%' }}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input placeholder="Tên sản phẩm" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
              >
                <TextArea rows={4} placeholder="Mô tả sản phẩm" />
              </Form.Item>
              
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
              >
                <Select placeholder="Chọn danh mục sản phẩm">
                  {categories.map(category => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Giá (VND)"
                    rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
                  >
                    <InputNumber
                      min={1000}
                      step={1000}
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder="Giá sản phẩm"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="quantity"
                    label="Số lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Số lượng" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        
        <Divider>Thông tin khuyến mãi</Divider>
        
        <Form.Item
          label="Kích hoạt khuyến mãi"
          name={['discount', 'isActive']}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.discount?.isActive !== currentValues.discount?.isActive;
          }}
        >
          {({ getFieldValue }) => {
            const isDiscountActive = getFieldValue(['discount', 'isActive']);
            
            return isDiscountActive ? (
              <>
                <Form.Item
                  label="Phần trăm giảm giá"
                  name={['discount', 'percentage']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập phần trăm giảm giá' },
                    { type: 'number', min: 1, max: 100, message: 'Phần trăm giảm giá phải từ 1-100%' }
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} max={100} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Thời gian bắt đầu"
                      name={['discount', 'startDate']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn thời gian bắt đầu' }
                      ]}
                    >
                      <DatePicker 
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: '100%' }}                        disabledDate={(current) => {
                          return current && current < moment().startOf('minute');
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Thời gian kết thúc"
                      name={['discount', 'endDate']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                        ({ getFieldValue }) => ({                          validator(_, value) {
                            const startDate = getFieldValue(['discount', 'startDate']);
                            if (!value || !startDate) return Promise.resolve();
                            
                            const startMoment = moment(startDate);
                            const endMoment = moment(value);
                            
                            if (endMoment.isSameOrAfter(startMoment)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Thời gian kết thúc phải sau hoặc bằng thời gian bắt đầu'));
                          }
                        })
                      ]}
                    >
                      <DatePicker 
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: '100%' }}                        disabledDate={(current) => {
                          const startDate = form.getFieldValue(['discount', 'startDate']);
                          return current && (
                            current < moment().startOf('minute') ||
                            (startDate && current < moment(startDate).startOf('minute'))
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : null;
          }}
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
            <Button onClick={() => navigate('/admin/products')}>
              Hủy
            </Button>
          </Space>        </Form.Item>
      </Form>
    </CustomCard>
  );
};

export default ProductEdit;
