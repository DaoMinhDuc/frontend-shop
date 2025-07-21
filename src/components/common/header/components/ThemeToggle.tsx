import { Switch, Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '../../../../hooks/useTheme';

interface ThemeToggleProps {
  isDarkMode: boolean;
  isMobile?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, isMobile = false }) => {
  const { toggleThemeMode } = useTheme();

  return (
    <>
      {isMobile ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          padding: '8px 0' 
        }}>
          <span style={{ color: isDarkMode ? '#fff' : '#000' }}>
            {isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
          </span>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={isDarkMode}
            onChange={toggleThemeMode}
          />
        </div>
      ) : (
        <Tooltip title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={isDarkMode}
            onChange={toggleThemeMode}
          />
        </Tooltip>
      )}
    </>
  );
};

export default ThemeToggle;
