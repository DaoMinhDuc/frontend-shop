import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Image, 
  InputNumber, 
  Divider, 
  Space, 
  Empty, 
  Input, 
  message,
  Popconfirm,
  Spin,
} from 'antd';
import { 
  DeleteOutlined, 
  ShoppingOutlined, 
  ArrowRightOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../../hooks/useCartContext';
import PageLayout from '../../../layouts/common/PageLayout';
import type { CartItem } from '../../../types/cart';
import api from '../../../services/api';
import ProductRecommendations from '../../../components/customer/products/ProductRecommendations';
import { ROUTES } from '../../../constants/routes';
import { getEffectivePrice, formatCurrency as formatCurrencyUtil } from '../../../utils/priceUtils';

const { Title, Text } = Typography;

const ShoppingCartPage: React.FC = () => {
  const { cartItems, cartTotal, updateCartItemQuantity, removeCartItem, clearCart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const navigate = useNavigate();
    // Format currency
  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount);
  };

  const getItemEffectivePrice = (item: CartItem) => {
    // Check if item has product object with discount info
    if (typeof item.product === 'object' && item.product?.discount) {
      return getEffectivePrice(item.price, item.product.discount);
    }
    if (item.discount) {
      return getEffectivePrice(item.price, item.discount);
    }
    return item.price;
  };
  
  const handleQuantityChange = async (item: CartItem, quantity: number | null) => {
    if (quantity === null || quantity < 1) {
      return;
    }
    
    try {
      setLoading(true);
      await updateCartItemQuantity(item._id, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error('Không thể cập nhật số lượng sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveItem = async (itemId: string) => {
    try {
      setLoading(true);
      await removeCartItem(itemId);
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      message.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error clearing cart:', error);
      message.error('Không thể xóa giỏ hàng');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      message.warning('Vui lòng nhập mã giảm giá');
      return;
    }
    
    try {
      setApplyingDiscount(true);
      // Call API to validate discount code
      const response = await api.post('/discount/validate', { code: discountCode });
      
      if (response.data && response.data.valid) {
        setDiscountAmount(response.data.amount || 0);
        message.success('Áp dụng mã giảm giá thành công');
      } else {
        setDiscountAmount(0);
        message.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    } catch (error) {
      console.error('Error applying discount code:', error);
      message.error('Không thể áp dụng mã giảm giá');
      setDiscountAmount(0);
    } finally {
      setApplyingDiscount(false);
    }
  };  
  const handleProceedToCheckout = () => {
    navigate(ROUTES.CHECKOUT, { 
      state: { 
        discountCode: discountAmount > 0 ? discountCode : null,
        discountAmount: discountAmount
      } 
    });
  };
    return (
    <PageLayout title="Giỏ hàng">
      <Title level={2} style={{ margin: '20px 0' }}>
        <ShoppingOutlined /> Giỏ hàng của bạn
      </Title>
      
      <Spin spinning={loading}>
        {cartItems.length === 0 ? (
          <Card>
            <Empty 
              description="Giỏ hàng của bạn đang trống"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" size="large" onClick={() => navigate(ROUTES.HOME)}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card title={<Title level={4}>Sản phẩm ({cartItems.length})</Title>}>
                {cartItems.map((item) => (
                  <div key={item._id} style={{ marginBottom: 16 }}>
                    <Row align="middle" gutter={[16, 16]}>
                      <Col xs={24} sm={6} md={4}>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ 
                            width: '100%', 
                            maxHeight: 100, 
                            objectFit: 'contain' 
                          }}
                          preview={false}
                        />
                      </Col>                      <Col xs={24} sm={6} md={8}>
                        <Space direction="vertical" size={0}>
                          <Text strong>{item.name}</Text>
                          {(() => {
                            const effectivePrice = getItemEffectivePrice(item);
                            const hasDiscount = effectivePrice < item.price;
                            return (
                              <Space>
                                {hasDiscount && (
                                  <Text delete style={{ fontSize: 12 }}>
                                    {formatCurrency(item.price)}
                                  </Text>
                                )}
                                <Text strong style={{ color: hasDiscount ? '#f5222d' : undefined }}>
                                  {formatCurrency(effectivePrice)}
                                </Text>
                              </Space>
                            );
                          })()}
                        </Space>
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <InputNumber
                          min={1}
                          max={100}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item, value)}
                          style={{ maxWidth: 80 }}
                        />
                      </Col>                      <Col xs={12} sm={5} md={5}>
                        <Text strong>
                          {formatCurrency(getItemEffectivePrice(item) * item.quantity)}
                        </Text>
                      </Col>
                      <Col xs={24} sm={3} md={3} style={{ textAlign: 'right' }}>
                        <Popconfirm
                          title="Xóa sản phẩm này khỏi giỏ hàng?"
                          onConfirm={() => handleRemoveItem(item._id)}
                          okText="Đồng ý"
                          cancelText="Hủy"
                        >
                          <Button 
                            danger 
                            icon={<DeleteOutlined />} 
                          />
                        </Popconfirm>
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                ))}
                
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa tất cả sản phẩm?"
                    onConfirm={handleClearCart}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button danger>
                      Xóa tất cả
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title={<Title level={4}>Tổng đơn hàng</Title>}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text>Tạm tính:</Text>
                  <Text strong>{formatCurrency(cartTotal)}</Text>
                </div>
                
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text>Giảm giá:</Text>
                    <Text strong style={{ color: '#52c41a' }}>
                      -{formatCurrency(discountAmount)}
                    </Text>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text>Phí vận chuyển:</Text>
                  <Text>Miễn phí</Text>
                </div>
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Title level={4}>Tổng cộng:</Title>
                  <Title level={4} style={{ color: '#ff4d4f' }}>
                    {formatCurrency(cartTotal > discountAmount ? cartTotal - discountAmount : 0)}
                  </Title>
                </div>
                
                <div style={{ marginBottom: 24 }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input 
                      placeholder="Nhập mã giảm giá" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      disabled={applyingDiscount}
                    />
                    <Button 
                      type="primary"
                      onClick={handleApplyDiscount}
                      loading={applyingDiscount}
                    >
                      Áp dụng
                    </Button>
                  </Space.Compact>
                </div>
                
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  disabled={cartItems.length === 0}
                  onClick={handleProceedToCheckout}
                >
                  Tiến hành thanh toán <ArrowRightOutlined />
                </Button>
                
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Button type="link" onClick={() => navigate(ROUTES.HOME)}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
      
      {/* Product recommendations */}
      <div style={{ marginTop: 48 }}>
        <ProductRecommendations />
      </div>
    </PageLayout>
  );
};

export default ShoppingCartPage;
