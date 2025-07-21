import React from 'react';
import { Card, Typography, Rate, Button, Space, Badge, Flex } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useCartContext } from '../../../hooks/useCartContext';
import type { Product } from '../../../types/product';
import { ROUTES } from '../../../constants/routes';
import { getEffectivePrice, hasActiveDiscount, formatCurrency } from '../../../utils/priceUtils';
import './ProductCard.css';

const { Meta } = Card;
const { Text, Title } = Typography;

type CardSizeType = 'small' | 'default';

export interface ProductCardProps {
  product: Product;
  loading?: boolean;
  onToggleFavorite?: (productId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  size?: CardSizeType;
  showAddToCart?: boolean;
  cardStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading = false,
  onToggleFavorite,
  isFavorite = false,
  size = 'default',
  showAddToCart = true,
  cardStyle,
  imageStyle,
  onProductClick,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  
  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(ROUTES.PRODUCT_DETAIL(product._id));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product._id, !isFavorite);
    }
  };

  const effectivePrice = getEffectivePrice(product.price, product.discount);
  const hasDiscount = hasActiveDiscount(product.discount);

  const defaultCardStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const defaultImageStyle: React.CSSProperties = {
    height: size === 'small' ? 150 : 200,
    width: '100%',
    objectFit: 'cover',
  };

  const buttonSize: SizeType = size === 'small' ? 'small' : 'middle';

  return (
    <Card
      hoverable
      size={size}
      style={{ ...defaultCardStyle, ...cardStyle }}
      className="product-card"
      loading={loading}
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={product.name}
            src={product.imageUrl}
            style={{ ...defaultImageStyle, ...imageStyle }}
            onClick={handleProductClick}
          />
          {hasDiscount && (
            <Badge.Ribbon
              text={`-${product.discount?.percentage}%`}
              color="red"
              style={{ top: 16 }}
            />
          )}
          {onToggleFavorite && (
            <Button
              type="text"
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                backgroundColor: 'white',
                width: 32,
                height: 32,
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                borderRadius: '50%',
              }}
              icon={
                isFavorite ? (
                  <HeartFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
                ) : (
                  <HeartOutlined style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: 16 }} />
                )
              }
              onClick={handleToggleFavorite}
            />
          )}
        </div>
      }
    >
      <Meta
        title={
          <Link 
            to={ROUTES.PRODUCT_DETAIL(product._id)}
            style={{
              color: 'rgba(0, 0, 0, 0.85)',
              textDecoration: 'none'
            }}
          >
            <Title 
              level={5}
              ellipsis={{ rows: 2 }}
              style={{ 
                marginBottom: 8,
                fontWeight: 600,
                transition: 'color 0.3s',
                fontSize: size === 'small' ? 14 : 16
              }}
              className="product-title"
            >
              {product.name}
            </Title>
          </Link>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Flex align="center">
              <Rate 
                disabled 
                value={product.rating || 4.5} 
                style={{ fontSize: size === 'small' ? 10 : 12 }} 
              />
              <Text type="secondary" style={{ marginLeft: 8, fontSize: size === 'small' ? 10 : 12 }}>
                (0)
              </Text>
            </Flex>
            
            <Space align="center">
              {hasDiscount ? (
                <>
                  <Text 
                    strong 
                    style={{ 
                      color: '#ff4d4f',
                      fontSize: size === 'small' ? 14 : 16,
                      fontWeight: 600 
                    }}
                  >
                    {formatCurrency(effectivePrice)}
                  </Text>
                  <Text 
                    type="secondary" 
                    style={{ 
                      textDecoration: 'line-through',
                      fontSize: size === 'small' ? 12 : 14
                    }}
                  >
                    {formatCurrency(product.price)}
                  </Text>
                </>
              ) : (
                <Text 
                  strong 
                  style={{ 
                    color: '#1890ff', 
                    fontSize: size === 'small' ? 14 : 16,
                    fontWeight: 600 
                  }}
                >
                  {formatCurrency(product.price)}
                </Text>
              )}
            </Space>
          </Space>
        }
      />
      {showAddToCart && (
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            block
            size={buttonSize}
          >
            Thêm vào giỏ
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;
