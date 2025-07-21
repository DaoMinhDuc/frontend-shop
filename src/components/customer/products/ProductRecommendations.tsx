import React from 'react';
import { Typography, Row, Col, Spin } from 'antd';
import { useRecommendedProducts } from '../../../hooks/useRecommendedProducts';
import ProductCard from './ProductCard';
import { useWishlistActions } from '../../../hooks/useWishlistActions';

const { Title } = Typography;

const ProductRecommendations: React.FC<{ title?: string }> = ({ title = "Có thể bạn cũng thích" }) => {
  const { products, loading } = useRecommendedProducts(4);
  const { toggleWishlist } = useWishlistActions();

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>{title}</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          {products.map(product => (
            <Col xs={24} sm={12} md={6} key={product._id}>              <ProductCard 
                product={product} 
                loading={false}
                onToggleFavorite={toggleWishlist}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductRecommendations;
