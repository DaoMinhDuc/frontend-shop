// PageHeader component for management pages
import React from 'react';
import { Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
  showBackButton?: boolean;
  backButtonPath?: string;
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onAdd,
  addButtonText = "Thêm mới",
  showBackButton = true,
  backButtonPath = "/admin",
  extra
}) => {
  const navigate = useNavigate();  const { isMobile, isTablet } = useResponsive();
  // Chỉ thu nhỏ khi là tablet hoặc mobile
  const isResponsiveScreen = isMobile || isTablet;

  const handleBack = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1);
    }
  };return (
    <div style={{ 
      marginBottom: 24,
      display: 'flex', 
      flexDirection: isResponsiveScreen ? 'column' : 'row',
      justifyContent: 'space-between', 
      alignItems: isResponsiveScreen ? 'flex-start' : 'center',
      gap: isResponsiveScreen ? 16 : 0
    }}>
      <Space direction="vertical" size={8} style={{ marginBottom: isResponsiveScreen ? 16 : 0 }}>
        {showBackButton && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginLeft: -12 }}
          >
            Quay lại
          </Button>
        )}
        <Space align="center">
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </Space>
      </Space>
        <Space style={{ 
        marginTop: isResponsiveScreen ? 8 : 0,
        alignSelf: isResponsiveScreen ? 'flex-start' : 'auto',
        width: isResponsiveScreen ? '100%' : 'auto',
        justifyContent: isResponsiveScreen ? 'flex-start' : 'flex-end'
      }}>
        {extra}
        
        {onAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            {addButtonText}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default PageHeader;
