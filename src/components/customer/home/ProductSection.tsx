import React from 'react';
import { Row, Col, Typography, Spin, Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import type { Product } from '../../../types/product';
import { useWishlistActions } from '../../../hooks/useWishlistActions';
import ProductCard from '../products/ProductCard';
import './ProductSection.css';

const { Text } = Typography;

interface ProductSectionProps {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  loading: boolean;
  error: string | null;
  viewAllLink?: string;
  onViewDetails: (product: Product) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  icon, 
  products, 
  loading, 
  error, 
  viewAllLink,
  onViewDetails
}) => {
  const { toggleWishlist, isInWishlist } = useWishlistActions();

  return (
    <div className="product-section">
      <div className="product-section-header">
        <Typography.Title level={3} className="product-section-title">
          {icon && <span className="product-section-title-icon">{icon}</span>}
          {title}
        </Typography.Title>
        {viewAllLink && (
          <Link to={viewAllLink} className="product-section-view-all">
            <Button type="primary">Xem tất cả <RightOutlined /></Button>
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="product-section-loading">
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
            Đang tải sản phẩm...
          </Text>
        </div>
      ) : error ? (
        <div className="product-section-error">
          <Text type="danger" style={{ marginBottom: 16 }}>
            {error}
          </Text>
        </div>
      ) : products && products.length > 0 ? (
        <Row gutter={[16, 24]}>
          {products.map(product => (
            <Col xs={24} sm={12} md={6} key={product._id}>
              <ProductCard
                product={product}
                onToggleFavorite={toggleWishlist}
                isFavorite={isInWishlist(product._id)}
                onProductClick={onViewDetails}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Không có sản phẩm nào" />
      )}
    </div>
  );
};

export default ProductSection;
