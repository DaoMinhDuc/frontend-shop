/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Card, Divider, Button, InputNumber, Tag, Breadcrumb, Rate, Badge, notification, Spin } from 'antd';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCartContext } from '../../../hooks/useCartContext';
import { useProductDetails } from '../../../hooks/useProduct';
import { useCategory } from '../../../hooks/useCategory';
import { ROUTES } from '../../../constants/routes';
import type { Product } from '../../../types/product';
import HomeHeader from '../../../components/customer/home/HomeHeader';
import ProductRecommendations from '../../../components/customer/products/ProductRecommendations';
import './ProductDetail.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { data: product, isLoading: productLoading, error: productError } = useProductDetails(id || '');
  const [categoryName, setCategoryName] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { data: category } = useCategory(categoryId || '');

  const getCategoryId = (category: Product['category']): string => {
    return typeof category === 'string' ? category : category?._id;
  };

  const getCategoryName = (category: Product['category']): string => {
    return typeof category === 'object' && category !== null ? category.name : '';
  };

  // Update category information when product loads
  useEffect(() => {
    if (id && product) {
      checkWishlistStatus(id);
      const catId = getCategoryId(product.category);
      setCategoryId(catId);
      
      const catName = getCategoryName(product.category);
      if (catName) {
        setCategoryName(catName);
      }
    }
  }, [id, product]);

  // Update category name when category data loads
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);
  
  const checkWishlistStatus = async (productId: string) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsFavorite(wishlist.includes(productId));
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };
  
  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value > 0) {
      setQuantity(value);
    }
  };
    const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      await addToCart(product._id, quantity);
      notification.success({
        message: 'Thành công',
        description: `Đã thêm ${quantity} ${product.name} vào giỏ hàng`,
        placement: 'topRight',
      });
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
    const handleToggleFavorite = async () => {
    if (!product) return;
    
    try {
      setIsTogglingFavorite(true);
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isFavorite) {
        const newWishlist = wishlist.filter((id: string) => id !== product._id);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        notification.success({
          message: 'Đã xóa khỏi danh sách yêu thích',
          placement: 'topRight',
        });
      } else {
        wishlist.push(product._id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        notification.success({
          message: 'Đã thêm vào danh sách yêu thích',
          placement: 'topRight',
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật danh sách yêu thích. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
    // Handle buying product immediately
  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      setIsBuyingNow(true);
      
      // Add the product to cart and wait for mutation to complete
      await addToCart(product._id, quantity);
      
      // Small delay to ensure cart state is fully updated
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
      // Navigate to checkout
      navigate(ROUTES.CHECKOUT);
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thực hiện mua ngay. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
      console.error('Buy now error:', err);
    } finally {
      setIsBuyingNow(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const hasDiscount = product?.discount?.isActive || false;
  const discountPercentage = product?.discount?.percentage || 0;
  const originalPrice = product?.price || 0;
  const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercentage / 100) : originalPrice;
  
  if (productLoading || !product) {
    return (
      <Layout>
        <HomeHeader />
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
            <Title level={3} style={{ marginTop: 24 }}>Đang tải thông tin sản phẩm...</Title>
          </div>
        </Content>
      </Layout>
    );
  }
  
  if (productError) {
    return (
      <Layout>
        <HomeHeader />
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Title level={3}>Không tìm thấy sản phẩm</Title>
            <Button type="primary" onClick={handleGoBack} style={{ marginTop: 24 }}>
              Quay lại
            </Button>
          </div>
        </Content>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <HomeHeader />
      <Content style={{ padding: '0 24px', minHeight: 'calc(100vh - 64px)' }}>
        <div className="product-detail-container">          <Breadcrumb
            items={[
              {
                title: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
              },              {
                title: <Link to={`${ROUTES.PRODUCTS}?category=${getCategoryId(product.category)}`}>{categoryName}</Link>,
              },
              {
                title: product.name,
              },
            ]}
            style={{ marginBottom: 16 }}
          />
          
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          
          <Card bordered={false}>
            <Row gutter={[24, 24]}>
              {/* Product Image */}
              <Col xs={24} sm={24} md={12}>
                <div className="product-detail-image-container">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="product-detail-image"
                  />
                  {hasDiscount && (
                    <Badge.Ribbon 
                      text={`Giảm ${discountPercentage}%`} 
                      color="red"
                      className="product-detail-discount-badge"
                    />
                  )}
                </div>
              </Col>
              
              {/* Product Info */}
              <Col xs={24} sm={24} md={12}>
                <div className="product-detail-info">
                  <Title level={2} className="product-detail-title">{product.name}</Title>
                  
                  <div style={{ marginBottom: 16 }}>
                    <Rate allowHalf defaultValue={4.5} disabled />
                    <Text style={{ marginLeft: 8 }}>
                      (0 đánh giá)
                    </Text>
                  </div>
                  
                  <div className="product-detail-price-container">
                    {hasDiscount && (
                      <Text delete className="product-detail-original-price">
                        {formatCurrency(originalPrice)}
                      </Text>
                    )}
                    <Text className="product-detail-discount-price">
                      {formatCurrency(discountedPrice)}
                    </Text>
                  </div>
                  
                  <div className="product-detail-stock">
                    <Text strong>
                      Tình trạng: 
                      {product.inStock ? (
                        <Tag color="success" style={{ marginLeft: 8 }}>Còn hàng</Tag>
                      ) : (
                        <Tag color="error" style={{ marginLeft: 8 }}>Hết hàng</Tag>
                      )}
                    </Text>
                  </div>                  <div className="product-detail-category">
                    <Text strong>Danh mục: </Text>
                    <Link to={`/products?category=${getCategoryId(product.category)}`}>
                      <Tag color="blue">{categoryName}</Tag>
                    </Link>
                  </div>
                  
                  <Divider />
                  
                  <Paragraph className="product-detail-description">
                    {product.description}
                  </Paragraph>
                  
                  <div className="product-detail-quantity">
                    <Text strong>Số lượng:</Text>
                    <InputNumber
                      min={1}
                      max={product.quantity}
                      defaultValue={1}
                      onChange={handleQuantityChange}
                      style={{ width: '100%', marginTop: 8 }}
                      disabled={!product.inStock}
                    />
                  </div>                    <div className="product-detail-actions">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      loading={isAddingToCart}
                      disabled={!product.inStock}
                      className="action-button cart-button"
                    >
                      {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                    </Button>
                      <Button
                      size="large"
                      icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                      onClick={handleToggleFavorite}
                      loading={isTogglingFavorite}
                      className={`action-button wishlist-button ${isFavorite ? 'favorited' : ''}`}
                    >
                      {isFavorite ? 'Yêu thích' : 'Yêu thích'}
                    </Button>
                  </div>
                  
                  <div className="product-detail-buy-now">                    <Button
                      type="primary"
                      size="large"
                      onClick={handleBuyNow}
                      loading={isBuyingNow}
                      disabled={!product.inStock}
                      className="buy-now-button"
                      style={{ width: '100%' }}
                    >
                      {product.inStock ? 'Mua ngay' : 'Hết hàng'}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <div className="product-detail-related">
            <Title level={3} className="product-detail-related-title">
              Có thể bạn cũng thích
            </Title>
            <ProductRecommendations title="" />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ProductDetail;