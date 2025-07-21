import { Layout } from 'antd';

const { Footer } = Layout;

interface DashboardFooterProps {
  appName?: string;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ appName }) => {
  const displayName = appName || import.meta.env.VITE_APP_NAME || 'Shop Online';
  const currentYear = new Date().getFullYear();
  
  return (
    <Footer style={{ textAlign: 'center' }}>
      {displayName} ©{currentYear} Created with React and Ant Design
    </Footer>
  );
};

export default DashboardFooter;
