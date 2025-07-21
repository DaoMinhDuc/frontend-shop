import React from 'react';
import { Dropdown, Button, Space, Switch, Tooltip, Card, Badge } from 'antd';
import { 
  SunOutlined, 
  MoonOutlined, 
  BgColorsOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useTheme } from '../../../hooks/useTheme';

interface ThemeSwitcherProps {
  showColorOptions?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showColorOptions = true }) => {
  const { themeOptions, toggleThemeMode, setThemePreset } = useTheme();
  const { mode, preset } = themeOptions;

  const items = [
    {
      key: 'theme-options',
      label: 'Tùy chọn giao diện',
      children: [
        {
          key: 'default',
          label: (
            <Space>
              <Badge 
                color="#1677ff" 
                dot={preset === 'default'}
              />
              Mặc định
              {preset === 'default' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => setThemePreset('default')
        },
        {
          key: 'blue',
          label: (
            <Space>
              <Badge 
                color="#1890ff" 
                dot={preset === 'blue'}
              />
              Xanh dương
              {preset === 'blue' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => setThemePreset('blue')
        },
        {
          key: 'green',
          label: (
            <Space>
              <Badge 
                color="#52c41a" 
                dot={preset === 'green'}
              />
              Xanh lá
              {preset === 'green' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => setThemePreset('green')
        },
        {
          key: 'purple',
          label: (
            <Space>
              <Badge 
                color="#722ed1" 
                dot={preset === 'purple'}
              />
              Tím
              {preset === 'purple' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => setThemePreset('purple')
        }
      ]
    }
  ];

  return (
    <Space size="small">
      <Tooltip title={mode === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}>
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={mode === 'dark'}
          onChange={toggleThemeMode}
        />
      </Tooltip>

      {showColorOptions && (
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="bottomRight"
          dropdownRender={(menu) => (
            <Card 
              size="small" 
              title="Chọn giao diện" 
              bordered={false} 
              style={{ width: 230 }}
            >
              {React.cloneElement(menu as React.ReactElement)}
            </Card>
          )}
        >
          <Button 
            type="text" 
            icon={<BgColorsOutlined />}
          >
            Chọn màu
          </Button>
        </Dropdown>
      )}
    </Space>
  );
};

export default ThemeSwitcher;