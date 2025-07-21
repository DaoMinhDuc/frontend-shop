import { useState, useEffect } from 'react';
import { Layout, Grid } from 'antd';
import { useTheme } from '../../../hooks/useTheme';
import SidebarContent from './components/SidebarContent';
import { handleSidebarResize, handleSidebarMenuClick } from '../../../utils/sidebarUtils';
import { getDarkModeStyles } from '../../../utils/uiUtils';
import AdminDrawer from './components/AdminDrawer';
import SidebarTrigger from './components/SidebarTrigger';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

interface AdminSideBarProps {
  defaultSelectedKey?: string;
  onTabChange?: (key: string) => void;
  isMobileView?: boolean;
  drawerVisible?: boolean;
  onDrawerClose?: () => void;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ 
  defaultSelectedKey = "3",
  onTabChange,
  isMobileView = false,
  drawerVisible = false,
  onDrawerClose
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { themeOptions } = useTheme();
  const isDarkMode = themeOptions.mode === 'dark';
  const screens = useBreakpoint();
  const isMobile = !screens.lg || isMobileView;
  const themeStyles = getDarkModeStyles(isDarkMode);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => handleSidebarResize(setCollapsed);

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleMenuClick = (key: string) => {
    handleSidebarMenuClick(key, onTabChange, isMobile, onDrawerClose, setCollapsed);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {isMobile ? (
        <AdminDrawer
          title="Admin Menu"
          open={drawerVisible || false}
          onClose={onDrawerClose}
          isDarkMode={isDarkMode}
        >
          <SidebarContent 
            isDarkMode={isDarkMode} 
            handleMenuClick={handleMenuClick}
            defaultSelectedKey={defaultSelectedKey}
          />
        </AdminDrawer>
      ) : (
        <div style={{ position: 'relative' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            width={250}
            collapsedWidth={80}
            theme={themeStyles.siderTheme}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'sticky',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 2
            }}
            trigger={null}
          >
            <SidebarContent 
              isDarkMode={isDarkMode} 
              handleMenuClick={handleMenuClick}
              defaultSelectedKey={defaultSelectedKey}
            />
          </Sider>
          

          <SidebarTrigger
            collapsed={collapsed}
            onClick={toggleCollapsed}
            isDarkMode={isDarkMode}
            leftPosition={collapsed ? 80 : 250}
          />
        </div>
      )}
    </>
  );
};

export default AdminSideBar;