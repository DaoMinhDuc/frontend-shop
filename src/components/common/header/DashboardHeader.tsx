import { Layout, Typography, Button, Space, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import ChatNotification from './ChatNotification';
import { useState, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import ShopActions from './components/ShopActions';
import UserMenu from './components/UserMenu';
import ThemeToggle from './components/ThemeToggle';
import MobileMenu from './components/MobileMenu';

const { Header } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

interface DashboardHeaderProps {
  title: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, onMenuClick }) => {
  const { user } = useAuth();
  const { themeOptions } = useTheme();
  const isDarkMode = themeOptions.mode === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [screens, mobileMenuOpen, isMobile]);

  const handleMobileMenuToggle = () => {
    if (onMenuClick) {
      // If parent provided an onMenuClick handler, use it
      onMenuClick();
    } else {
      // Otherwise use local state
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  const headerStyle = {
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '10px 16px' : '10px 24px',
    background: isDarkMode ? '#1f1f1f' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
    transition: 'background-color 0.3s, color 0.3s',
    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
    height: 'auto',
    lineHeight: '1.5',
    flexWrap: isMobile ? 'wrap' as const : 'nowrap' as const,
    overflow: 'hidden'
  };
  
  const titleStyle = { 
    margin: 0, 
    padding: isMobile ? '12px 0' : 0,
    color: isDarkMode ? '#fff' : '#000',
    fontSize: isMobile ? '18px' : '20px',
    lineHeight: '32px'
  };
  return (
    <Header className="dashboard-header" style={headerStyle}>
      {/* Điều chỉnh title với icon menu ở mobile */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && onMenuClick && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={handleMobileMenuToggle}
            style={{ 
              color: isDarkMode ? '#fff' : undefined,
              marginRight: '8px',
              padding: '4px 8px'
            }}
          />
        )}
        <Title level={3} style={titleStyle}>{title}</Title>
      </div>
      
      {/* Desktop menu */}
      {!isMobile ? (
        <Space size="middle">    
          <ShopActions isDarkMode={isDarkMode} />
          <ThemeToggle isDarkMode={isDarkMode} />
          <ChatNotification isDarkMode={isDarkMode} />
          <UserMenu isDarkMode={isDarkMode} />
        </Space>
      ) : (
        <Space>
          <ChatNotification isDarkMode={isDarkMode} />
          {user && <UserMenu isDarkMode={isDarkMode} isMobile={true} />}
          
          {/* Chỉ hiển thị nút Menu khi không có onMenuClick (không phải màn hình admin) */}
          {!onMenuClick && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={handleMobileMenuToggle}
              style={{ color: isDarkMode ? '#fff' : undefined }}
            />
          )}

          {!onMenuClick && (
            <MobileMenu 
              isOpen={mobileMenuOpen} 
              onClose={() => setMobileMenuOpen(false)} 
              isDarkMode={isDarkMode} 
            />
          )}
        </Space>
      )}
    </Header>
  );
};

export default DashboardHeader;