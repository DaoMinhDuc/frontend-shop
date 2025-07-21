import { Button, Badge, Tooltip } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { useAuth } from '../../../../hooks/useAuth';
import { useCartContext } from '../../../../hooks/useCartContext';

interface ShopActionsProps {
  isDarkMode: boolean;
  isMobile?: boolean;
}

const ShopActions: React.FC<ShopActionsProps> = ({ isDarkMode, isMobile = false }) => {
  const { user } = useAuth();
  const { cartCount } = useCartContext();
  const navigate = useNavigate();

  const handleViewStore = () => {
    navigate(ROUTES.HOME);
  };

  const handleCartClick = () => {
    navigate(ROUTES.CART);
  };

  const textButtonStyle = {
    color: isDarkMode ? '#fff' : undefined
  };

  return (
    <>
      {!isMobile && (
        <Button
          icon={<ShoppingOutlined />}
          onClick={handleViewStore}
          type="text"
          style={textButtonStyle}
        >
          Xem cửa hàng
        </Button>
      )}
      
      {user && user.role === 'customer' && (
        isMobile ? (
          <Button
            type="text"
            icon={<ShoppingOutlined style={{ fontSize: '18px', color: isDarkMode ? '#fff' : undefined }} />}
            onClick={handleCartClick}
            style={textButtonStyle}
          >
            {!isMobile && `Giỏ hàng ${cartCount > 0 ? `(${cartCount})` : ''}`}
          </Button>
        ) : (
          <Tooltip title="Giỏ hàng">
            <Badge count={cartCount} overflowCount={99}>
              <Button 
                type="text" 
                icon={<ShoppingOutlined style={{ 
                  fontSize: '18px',
                  color: isDarkMode ? '#fff' : undefined
                }} />} 
                onClick={handleCartClick}
              />
            </Badge>
          </Tooltip>
        )
      )}
    </>
  );
};

export default ShopActions;
