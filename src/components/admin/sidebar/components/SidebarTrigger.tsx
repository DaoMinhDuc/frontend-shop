import React from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { getDarkModeStyles } from '../../../../utils/uiUtils';

interface SidebarTriggerProps {
  collapsed: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  leftPosition: number;
}

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
  collapsed,
  onClick,
  isDarkMode,
  leftPosition
}) => {
  const themeStyles = getDarkModeStyles(isDarkMode);
  
  return (
    <Button
      type={isDarkMode ? 'default' : 'text'}
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: leftPosition,
        zIndex: 100,
        fontSize: '12px',
        width: 16,
        height: 40,
        borderRadius: '0 4px 4px 0',
        ...themeStyles.toggleButtonStyle,
        borderLeft: 0,
        transform: 'translateY(-50%)',
        transition: 'left 0.2s'
      }}
    />
  );
};

export default SidebarTrigger;
