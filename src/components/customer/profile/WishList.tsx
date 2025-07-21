import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  message, 
  Empty, 
  Spin,
  Popconfirm,
  notification
} from 'antd';
import { 
  ShoppingCartOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useWishlist } from '../../../hooks/useUser';
import { useCartActions } from '../../../hooks/useCartActions';
import type { WishlistItem } from '../../../types/user';

const { Title, Text } = Typography;

const WishList: React.FC = () => {
  const { 
    wishlist, 
    isLoading, 
    isError,
    removeFromWishlist,
    isRemoving
  } = useWishlist();
  
  const { addToCart, addingToCart } = useCartActions();

  React.useEffect(() => {
    if (isError) {
      message.error('Không thể tải danh sách yêu thích');
    }
  }, [isError]);
    const handleAddToCart = async (product: WishlistItem) => {
    try {
      // Convert WishlistItem to Product format expected by useCartActions
      const productForCart = {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        description: product.description,
        category: product.category,
        quantity: product.quantity
      };
      
      await addToCart(productForCart);
      
      notification.success({
        message: 'Thêm vào giỏ hàng thành công',
        description: `Đã thêm ${product.name} vào giỏ hàng`,
        placement: 'topRight'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>Sản phẩm yêu thích</Title>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <Card>
          <Empty 
            description="Bạn chưa có sản phẩm yêu thích nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {wishlist.map((product) => (
            <Col xs={24} sm={12} md={8} key={product._id}>
              <Card
                cover={
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <img
                      alt={product.name}
                      src={product.imageUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                }
                actions={[
                  <Button 
                    key="add" 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => handleAddToCart(product)}
                    loading={!!addingToCart}
                  >
                    Thêm vào giỏ
                  </Button>,
                  <Popconfirm
                    key="remove"
                    title="Xóa khỏi danh sách yêu thích?"
                    onConfirm={() => removeFromWishlist(product._id)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                      loading={isRemoving}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                ]}
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <div>
                      <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
                        {formatCurrency(product.price)}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        {product.inStock ? (
                          <Text type="success">Còn hàng</Text>
                        ) : (
                          <Text type="danger">Hết hàng</Text>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WishList;
