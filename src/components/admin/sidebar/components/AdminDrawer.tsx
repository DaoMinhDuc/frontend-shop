import React from 'react';
import { Drawer } from 'antd';
import { getDarkModeStyles } from '../../../../utils/uiUtils';

interface AdminDrawerProps {
  title: string;
  open: boolean;
  onClose?: () => void;
  isDarkMode: boolean;
  width?: number;
  children: React.ReactNode;
}

/**
 * Reusable admin drawer component with theme support
 */
const AdminDrawer: React.FC<AdminDrawerProps> = ({
  title,
  open,
  onClose,
  isDarkMode,
  width = 250,
  children
}) => {
  const themeStyles = getDarkModeStyles(isDarkMode);
  
  return (
    <Drawer
      title={title}
      placement="left"
      onClose={onClose}
      open={open}
      width={width}
      styles={themeStyles.drawerStyles}
    >
      {children}
    </Drawer>
  );
};

export default AdminDrawer;
