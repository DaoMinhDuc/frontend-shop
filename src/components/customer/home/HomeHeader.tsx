import React from 'react';
import { 
  Layout, 
  Typography, 
  Badge, 
  Dropdown,
  Switch,
  theme,
  Flex,
  Avatar,
  Grid
} from 'antd';
import SearchBar from '../search/SearchBar';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  DownOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '../../../hooks/useAuth';
import { useCartContext } from '../../../hooks/useCartContext';
import { useTheme } from '../../../hooks/useTheme';
import { ROUTES } from '../../../constants/routes';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

interface HomeHeaderProps {
  onSearch?: (value: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const { cartCount } = useCartContext();
  const { token } = theme.useToken();
  const { themeOptions, toggleThemeMode } = useTheme();
  const isDarkMode = themeOptions.mode === 'dark';
  const handleSearch = (value: string) => {
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    } else if (value.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(value.trim())}`);
    }
  };
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to={ROUTES.CUSTOMER.PROFILE}>Tài khoản của tôi</Link>,
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: <Link to={ROUTES.CUSTOMER.ORDERS}>Lịch sử đơn hàng</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <Text onClick={() => logout()}>Đăng xuất</Text>,
    },
  ];

  const guestMenuItems: MenuProps['items'] = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: <Link to={ROUTES.LOGIN}>Đăng nhập</Link>,
    },
    {
      key: 'register',
      icon: <UserAddOutlined />,
      label: <Link to={ROUTES.REGISTER}>Đăng ký</Link>,
    },
  ];
  const headerStyle = {
    background: token.colorBgContainer,
    padding: '0 24px',
    boxShadow: `0 2px 8px ${token.colorBgTextHover}15`,
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    height: '64px',
    gap: '16px'
  };


  const titleStyle = {
    margin: 0,
    marginRight: 24,
    color: isDarkMode ? token.colorPrimary : token.colorText
  };
  const iconButtonStyle = {
    fontSize: '20px',
    color: isDarkMode ? token.colorPrimary : undefined,
    cursor: 'pointer',
  };
  return (
    <Header style={headerStyle}>      
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Title level={3} style={titleStyle}>
            Shop Online
          </Title>
        </Link>
      </div>      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <SearchBar
          onSearch={handleSearch}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />
      </div>

      <Flex align="center" gap="middle">
        <Switch
          checked={isDarkMode}
          onChange={toggleThemeMode}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          style={{ width: 54 }}
        />        
        <Link to={ROUTES.CART}>
          <Badge count={cartCount} showZero>
            <ShoppingCartOutlined style={iconButtonStyle} />
          </Badge>
        </Link>
        
        {user ? (
          <Dropdown menu={{ items: userMenuItems }}>
            <Flex align="center" gap="small" style={{ cursor: 'pointer' }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: isDarkMode ? token.colorPrimary : token.colorPrimaryBg,
                  color: isDarkMode ? token.colorBgContainer : token.colorPrimary
                }}
                src={user.avatar}
              />
              {!isMobile && (
                <>
                  <span style={{ color: isDarkMode ? token.colorPrimary : token.colorText }}>
                    {user.name || 'Tài khoản'}
                  </span>
                  <DownOutlined style={{ fontSize: '12px', color: isDarkMode ? token.colorPrimary : token.colorText }} />
                </>
              )}
            </Flex>
          </Dropdown>
        ) : (
          <Dropdown menu={{ items: guestMenuItems }}>
            <Flex align="center" gap="small" style={{ cursor: 'pointer' }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: isDarkMode ? token.colorPrimary : token.colorPrimaryBg,
                  color: isDarkMode ? token.colorBgContainer : token.colorPrimary
                }}
              />
              {!isMobile && (
                <>
                  <span style={{ color: isDarkMode ? token.colorPrimary : token.colorText }}>
                    Tài khoản
                  </span>
                  <DownOutlined style={{ fontSize: '12px', color: isDarkMode ? token.colorPrimary : token.colorText }} />
                </>
              )}
            </Flex>
          </Dropdown>
        )}
      </Flex>
    </Header>
  );
};

export default HomeHeader;
