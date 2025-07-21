/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, Divider, Radio, Table, Image, notification, Steps, Result, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCreateOrder } from '../../../hooks/useOrder';
import { useAddresses } from '../../../hooks/useUser';
import { useCartContext } from '../../../hooks/useCartContext';
import { useAuth } from '../../../hooks/useAuth';
import PageLayout from '../../../layouts/common/PageLayout';
import type { ShippingAddress } from '../../../types/order';
import { ROUTES } from '../../../constants/routes';
import { getEffectivePrice, formatCurrency as formatCurrencyUtil } from '../../../utils/priceUtils';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { cartItems, cartTotal } = useCartContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { mutate: createOrder, isPending: isLoading } = useCreateOrder();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const { data: savedAddresses = [], isLoading: addressesLoading } = useAddresses();
  const navigate = useNavigate();
  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount);
  };

  // Helper function to get effective price for an item
  const getItemEffectivePrice = (item: any) => {
    // Check if item has product object with discount info
    if (typeof item.product === 'object' && item.product?.discount) {
      return getEffectivePrice(item.price, item.product.discount);
    }
    // Check if item itself has discount info
    if (item.discount) {
      return getEffectivePrice(item.price, item.discount);
    }
    // No discount, return original price
    return item.price;
  };
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      render: (_: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.imageUrl}
            alt={record.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover' }}
            preview={false}
          />
          <div style={{ marginLeft: 12 }}>
            <Text>{record.name}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: (price: number, record: any) => {
        const effectivePrice = getItemEffectivePrice(record);
        const hasDiscount = effectivePrice < price;
        
        return (
          <Space direction="vertical" size={0}>
            {hasDiscount && (
              <Text delete style={{ fontSize: 12 }}>
                {formatCurrency(price)}
              </Text>
            )}
            <Text strong style={{ color: hasDiscount ? '#f5222d' : undefined }}>
              {formatCurrency(effectivePrice)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thành tiền',
      render: (_: any, record: any) => {
        const effectivePrice = getItemEffectivePrice(record);
        return formatCurrency(effectivePrice * record.quantity);
      },
    },
  ];  const handleSubmit = (values: ShippingAddress) => {
    if (!user) {
      notification.error({
        message: 'Error',
        description: 'Bạn cần đăng nhập để tiếp tục',
        placement: 'topRight'
      });
      navigate(ROUTES.LOGIN);
      return;
    }

    if (cartItems.length === 0) {
      notification.error({
        message: 'Error',
        description: 'Giỏ hàng của bạn đang trống',
        placement: 'topRight'
      });
      navigate(ROUTES.CART);
      return;
    }

    let shippingAddress: ShippingAddress;

    if (selectedAddressId) {
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddress) {
        shippingAddress = {
          name: selectedAddress.name,
          address: selectedAddress.address,
          city: selectedAddress.city,
          phone: selectedAddress.phone,
        };
      } else {
        notification.error({
          message: 'Error',
          description: 'Không tìm thấy địa chỉ đã chọn',
          placement: 'topRight'
        });
        return;
      }
    } else {
      shippingAddress = {
        name: values.name || '',
        address: values.address || '',
        city: values.city || '',
        phone: values.phone || '',
      };
    }

    const orderData = {
      shippingAddress,
      paymentMethod,
    };

    createOrder(orderData, {
      onSuccess: (result) => {
        setOrderId(result._id);
        setOrderComplete(true);
        setCurrentStep(2);
      },
      onError: (error: any) => {
        notification.error({
          message: 'Error',
          description: error?.message,
          placement: 'topRight'
        });
      }
    });
  };
  
  const steps = [
    {
      title: 'Thông tin giao hàng',
      content: (
        <>
          <Title level={5}>Địa chỉ giao hàng</Title>
          {addressesLoading ? (
            <Card loading />
          ) : (
            <>
              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div style={{ marginBottom: 24 }}>
                  <Radio.Group
                    onChange={(e) => {
                      const address = savedAddresses.find(addr => addr._id === e.target.value);
                      if (address) {
                        form.setFieldsValue({
                          name: address.name,
                          phone: address.phone,
                          address: address.address,
                          city: address.city,
                        });
                        setSelectedAddressId(address._id);
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {savedAddresses.map(address => (
                        <Radio key={address._id} value={address._id} style={{ width: '100%' }}>
                          <Card size="small" style={{ marginTop: 8, width: '100%' }}>
                            <Row>
                              <Col span={24}>
                                <Text strong>{address.name}</Text>
                                {address.isDefault && (
                                  <Tag color="blue" style={{ marginLeft: 8 }}>Mặc định</Tag>
                                )}
                              </Col>
                              <Col span={24}>
                                <Text>{address.phone}</Text>
                              </Col>
                              <Col span={24}>
                                <Text>{address.address}</Text>
                              </Col>
                              <Col span={24}>
                                <Text>{address.city}</Text>
                              </Col>
                            </Row>
                          </Card>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>
              )}

              {(!savedAddresses.length || showNewAddressForm) && (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={() => {
                    setCurrentStep(1);
                  }}
                  initialValues={{
                    name: user?.name || '',
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Họ tên người nhận"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                      >
                        <Input placeholder="Họ tên người nhận" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại' },
                          { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="Số điện thoại liên hệ" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                  >
                    <TextArea rows={3} placeholder="Số nhà, tên đường, phường/xã, ..." />
                  </Form.Item>
                  
                  <Form.Item
                    name="city"
                    label="Thành phố/Tỉnh"
                    rules={[{ required: true, message: 'Vui lòng nhập thành phố/tỉnh' }]}
                  >
                    <Input placeholder="Thành phố/Tỉnh" />
                  </Form.Item>
                </Form>
              )}

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                {savedAddresses.length > 0 && (
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  >
                    {showNewAddressForm ? 'Chọn địa chỉ đã lưu' : 'Thêm địa chỉ mới'}
                  </Button>
                )}
                <Button type="primary" onClick={() => setCurrentStep(1)}>
                  Tiếp tục
                </Button>
              </div>
            </>
          )}
        </>
      ),
    },
    {
      title: 'Thanh toán',
      content: (
        <>
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Phương thức thanh toán</Title>
            <Radio.Group 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              value={paymentMethod}
            >
              <Radio value="cash">Thanh toán khi nhận hàng</Radio>
              <Radio value="bank_transfer" disabled>Chuyển khoản ngân hàng</Radio>
              <Radio value="credit_card" disabled>Thẻ tín dụng/Ghi nợ</Radio>
            </Radio.Group>
          </div>
          
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setCurrentStep(0)}>
              Quay lại
            </Button>
            <Button 
              type="primary" 
              onClick={() => {
                const values = form.getFieldsValue();
                handleSubmit(values);
              }}
              loading={isLoading}
            >
              Đặt hàng
            </Button>
          </div>
        </>
      ),
    },
    {
      title: 'Hoàn thành',
      content: (
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle={`Mã đơn hàng: ${orderId}. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.`}
          extra={[
            <Button type="primary" key="orders" onClick={() => navigate(ROUTES.CUSTOMER.ORDERS)}>
              Xem đơn hàng
            </Button>,
            <Button key="buy" onClick={() => navigate(ROUTES.HOME)}>
              Tiếp tục mua sắm
            </Button>,
          ]}
        />
      ),
    },
  ];

  if (!orderComplete && (!cartItems || cartItems.length === 0)) {
    return (
      <PageLayout title="Giỏ hàng trống">
        <Result
          status="warning"
          title="Giỏ hàng trống"
          subTitle="Bạn cần có sản phẩm trong giỏ hàng để tiến hành thanh toán"
          extra={
            <Button type="primary" onClick={() => navigate(ROUTES.HOME)}>
              Mua sắm ngay
            </Button>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Thanh toán">      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Steps current={currentStep}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Col>
        {currentStep === 2 ? (
          <Col xs={24}>
            <Card>
              {steps[currentStep].content}
            </Card>
          </Col>
        ) : (
          <>        {currentStep === 2 ? (
          <Col xs={24}>
            <Card>
              {steps[currentStep].content}
            </Card>
          </Col>
        ) : (
          <>
            <Col xs={24} md={10}>
              <Card>
                {steps[currentStep].content}
              </Card>
            </Col>
            
            <Col xs={24} md={14}>
              <Card title="Thông tin đơn hàng">
                <Table
                  columns={columns}
                  dataSource={cartItems}
                  pagination={false}
                  rowKey="_id"
                  size="small"
                />
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tạm tính:</Text>
                  <Text>{formatCurrency(cartTotal)}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Phí vận chuyển:</Text>
                  <Text>Miễn phí</Text>
                </div>
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Tổng cộng:</Text>
                  <Text strong style={{ color: '#ff4d4f', fontSize: 18 }}>
                    {formatCurrency(cartTotal)}
                  </Text>
                </div>
              </Card>
            </Col>
          </>
        )}
          </>
        )}
      </Row>
    </PageLayout>
  );
};

export default CheckoutPage;
