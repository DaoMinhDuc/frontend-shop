import { Drawer, Space, Button } from 'antd';
import { LogoutOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { useAuth, useLogout } from '../../../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { useCartContext } from '../../../../hooks/useCartContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isDarkMode }) => {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const { cartCount } = useCartContext();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(ROUTES.CUSTOMER.PROFILE);
    onClose();
  };

  const handleViewStore = () => {
    navigate(ROUTES.HOME);
    onClose();
  };

  const handleCartClick = () => {
    navigate(ROUTES.CART);
    onClose();
  };

  const textButtonStyle = {
    color: isDarkMode ? '#fff' : undefined
  };

  const mobileMenuContent = (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button 
        type="text" 
        icon={<ShoppingOutlined />} 
        onClick={handleViewStore}
        style={{ ...textButtonStyle, textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
      >
        Xem cửa hàng
      </Button>
      
      {user && user.role === 'customer' && (
        <Button
          type="text"
          icon={<ShoppingOutlined style={{ fontSize: '18px', color: isDarkMode ? '#fff' : undefined }} />}
          onClick={handleCartClick}
          style={{ ...textButtonStyle, textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
        >
          Giỏ hàng {cartCount > 0 && `(${cartCount})`}
        </Button>
      )}
      
      <ThemeToggle isDarkMode={isDarkMode} isMobile={true} />
      
      {user && (
        <>
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={handleEditProfile}
            style={{ ...textButtonStyle, textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
          >
            Chỉnh sửa thông tin
          </Button>          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => logout()}
            danger
            style={{ textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
          >
            Đăng xuất
          </Button>
        </>
      )}
    </Space>
  );

  return (
    <Drawer
      title={user ? `Xin chào, ${user.name}` : "Menu"}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={280}
      styles={{
        header: {
          background: isDarkMode ? '#1f1f1f' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
          borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
        },
        body: {
          background: isDarkMode ? '#141414' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
          padding: '16px'
        }
      }}
    >
      {mobileMenuContent}
    </Drawer>
  );
};

export default MobileMenu;
