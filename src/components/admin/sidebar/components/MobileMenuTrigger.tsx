import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

interface MobileMenuTriggerProps {
  isDarkMode: boolean;
  onClick: () => void;
}

const MobileMenuTrigger: React.FC<MobileMenuTriggerProps> = ({ isDarkMode, onClick }) => {
  return (
    <Button
      type={isDarkMode ? 'default' : 'text'}
      icon={<MenuOutlined />}
      onClick={onClick}
      style={{
        background: isDarkMode ? '#1f1f1f' : '#fff',
        color: isDarkMode ? '#fff' : undefined,
        border: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
        borderRadius: '4px',
        padding: '0 8px',
        margin: '8px 16px'
      }}
    />
  );
};

export default MobileMenuTrigger;
