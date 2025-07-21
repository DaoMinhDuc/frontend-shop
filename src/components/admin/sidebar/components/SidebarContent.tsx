import { Menu } from 'antd';
import {
  TeamOutlined,
  ShoppingOutlined,
  HomeOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  WechatOutlined
} from '@ant-design/icons';

interface SidebarContentProps {
  isDarkMode: boolean;
  handleMenuClick: (key: string) => void;
  defaultSelectedKey: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isDarkMode,
  handleMenuClick,
  defaultSelectedKey
}) => {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[defaultSelectedKey]}
      theme={isDarkMode ? 'dark' : 'light'}
      items={[
        {
          key: '3',
          icon: <HomeOutlined />,
          label: 'Trang chủ',
          onClick: () => handleMenuClick('3')
        },
        {
          key: '1',
          icon: <TeamOutlined />,
          label: 'Người dùng',
          onClick: () => handleMenuClick('1')
        },
        {
          key: '2',
          icon: <ShoppingOutlined />,
          label: 'Sản phẩm',
          onClick: () => handleMenuClick('2')
        },
        {
          key: '6',
          icon: <ShoppingCartOutlined />,
          label: 'Đơn hàng',
          onClick: () => handleMenuClick('6')
        },
        {
          key: '7',
          icon: <WechatOutlined />,
          label: 'Chat & CRM',
          onClick: () => handleMenuClick('7')
        },
        {
          key: 'system',
          icon: <SettingOutlined />,
          label: 'Quản lý hệ thống',
          children: [
            {
              key: '4',
              icon: <AppstoreOutlined />,
              label: 'Danh mục sản phẩm',
              onClick: () => handleMenuClick('4')
            }
          ]
        }
      ]}
    />
  );
};

export default SidebarContent;
