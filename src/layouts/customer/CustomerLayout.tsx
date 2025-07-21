import { Layout } from 'antd';
import React from 'react';
import type { ReactNode } from 'react';
import DashboardFooter from '../../components/common/footer/DashboardFooter';
import DashboardHeader from '../../components/common/header/DashboardHeader';
import { useTheme } from '../../hooks/useTheme';

const { Content } = Layout;

interface CustomerLayoutProps {
  children: ReactNode;
  title: string;
  appName?: string;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  title,
  appName,
}) => {
  const { themeOptions } = useTheme();
  const isDarkMode = themeOptions.mode === 'dark';
    return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardHeader title={title} />
      
      <Content 
        className="dashboard-content"
        style={{
          margin: '24px 16px',
          padding: 24,
          background: isDarkMode ? '#141414' : '#fff',
          minHeight: 280,
          borderRadius: '4px',
          transition: 'all 0.3s'
        }}
      >
        {children}
      </Content>
      
      <DashboardFooter appName={appName} />
    </Layout>
  );
};

export default CustomerLayout;
