import { useState } from 'react';
import { Layout, Grid } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import AdminSideBar from '../../../components/admin/sidebar/AdminSideBar';
import DashboardHeader from '../../../components/common/header/DashboardHeader';
import DashboardFooter from '../../../components/common/footer/DashboardFooter';
import { handleAdminMenuNavigation } from '../../../utils/navigationHelper';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const getActiveKey = () => {
    const path = location.pathname;
    
    if (path.includes('/admin/users')) return '1';
    if (path.includes('/admin/products')) return '2';
    if (path === '/admin' || path === '/admin/') return '3';
    if (path.includes('/admin/categories')) return '4';
    if (path.includes('/admin/orders')) return '6';
    if (path.includes('/admin/chat')) return '7';
    
    return '3';
  };

  const handleTabChange = (key: string) => {
    handleAdminMenuNavigation(key, navigate);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardHeader 
        title="Admin Dashboard" 
        onMenuClick={toggleSidebar}
      />
      
      <Layout>
        <AdminSideBar 
          defaultSelectedKey={getActiveKey()} 
          onTabChange={handleTabChange}
          isMobileView={isMobile}
          drawerVisible={sidebarVisible}
          onDrawerClose={() => setSidebarVisible(false)}
        />
        
        <Layout>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      
      <DashboardFooter />
    </Layout>
  );
};

export default AdminDashboard;
