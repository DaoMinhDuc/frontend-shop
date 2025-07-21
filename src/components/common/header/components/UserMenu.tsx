import { Avatar, Button, Dropdown, Space, type MenuProps } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { useTheme } from '../../../../hooks/useTheme';
import { useAuth, useLogout } from '../../../../hooks/useAuth';
import { COLOR_PRESETS, type ThemePreset } from '../../../../constants/themeConstants';

interface UserMenuProps {
  isDarkMode: boolean;
  isMobile?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isDarkMode, isMobile = false }) => {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const { setThemePreset } = useTheme();
  
  const handleEditProfile = () => {
    navigate(ROUTES.CUSTOMER.PROFILE);
  };

  const handleSelectTheme = (theme: ThemePreset) => {
    setThemePreset(theme);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <SettingOutlined />,
      label: 'Chỉnh sửa thông tin',
      onClick: handleEditProfile,
    },
    {
      key: 'theme',
      icon: <BgColorsOutlined />,
      label: 'Màu sắc giao diện',
      children: [
        {
          key: 'default',
          label: (
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: COLOR_PRESETS.default.light.colorPrimary,
                borderRadius: '2px' 
              }}></div>
              Mặc định
            </Space>
          ),
          onClick: () => handleSelectTheme('default')
        },
        {
          key: 'blue',
          label: (
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: COLOR_PRESETS.blue.light.colorPrimary,
                borderRadius: '2px' 
              }}></div>
              Xanh dương
            </Space>
          ),
          onClick: () => handleSelectTheme('blue')
        },
        {
          key: 'green',
          label: (
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: COLOR_PRESETS.green.light.colorPrimary,
                borderRadius: '2px' 
              }}></div>
              Xanh lá
            </Space>
          ),
          onClick: () => handleSelectTheme('green')
        },
        {
          key: 'purple',
          label: (
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: COLOR_PRESETS.purple.light.colorPrimary,
                borderRadius: '2px' 
              }}></div>
              Tím
            </Space>
          ),
          onClick: () => handleSelectTheme('purple')
        }
      ]
    },
    {
      type: 'divider',    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => logout(),
      danger: true,
    },
  ];

  const textButtonStyle = {
    color: isDarkMode ? '#fff' : undefined
  };

  if (!user) return null;

  return (
    <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
      <Button type="text" style={{ height: '40px', ...textButtonStyle }}>
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            src={user.avatar} 
            style={{ 
              backgroundColor: isDarkMode ? '#1668dc' : '#1677ff'
            }}
          />
          {!isMobile && <span>{user.name}</span>}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default UserMenu;
