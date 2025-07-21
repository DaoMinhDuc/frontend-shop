import { Layout, Grid } from 'antd';
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import DashboardFooter from '../../components/common/footer/DashboardFooter';
import DashboardHeader from '../../components/common/header/DashboardHeader';
import AdminSideBar from '../../components/admin/sidebar/AdminSideBar';
import { useTheme } from '../../hooks/useTheme';
import './AdminLayout.css';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  appName?: string;
  defaultSelectedKey?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  appName,
  defaultSelectedKey,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(defaultSelectedKey || '3');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { themeOptions } = useTheme();
  const isDarkMode = themeOptions.mode === 'dark';
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };  return (
    <Layout style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <AdminSideBar 
        defaultSelectedKey={currentTab} 
        onTabChange={handleTabChange}
        isMobileView={isMobile}
        drawerVisible={sidebarVisible}
        onDrawerClose={() => setSidebarVisible(false)}
      />
      
      <Layout 
        className={`site-layout ${isDarkMode ? 'dark-mode' : ''}`} 
        style={{ 
          marginLeft: 0,
          width: '100%'
        }}
      >
        <DashboardHeader 
          title={title} 
          onMenuClick={isMobile ? toggleSidebar : undefined}
        />
        <div className="admin-content-container">
          <Content 
            className="admin-content dashboard-content"
            style={{
              background: isDarkMode ? '#141414' : '#fff',
              minHeight: 280,
              position: 'relative'
            }}
          >
            {children}
          </Content>
        </div>
        
        <DashboardFooter appName={appName} />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
