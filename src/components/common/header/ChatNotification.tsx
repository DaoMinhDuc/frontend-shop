import React from 'react';
import { Badge, Button, Dropdown, List, Typography, Avatar, Empty } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useChatContext } from '../../../hooks/useChatContext';
import { useAuth } from '../../../hooks/useAuth';
import './ChatNotification.css';

const { Text } = Typography;

interface ChatNotificationProps {
  isDarkMode?: boolean;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ isDarkMode }) => {
  const { 
    notifications = [], 
    unreadCount = 0, 
    selectChat, 
    clearNotification, 
    clearAllNotifications 
  } = useChatContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleNotificationClick = (chatId: string, type: string) => {
    if (clearNotification) {
      clearNotification(chatId);
    }
    
    if (type === 'new_message' && selectChat) {
      if (user?.role === 'admin' || user?.role === 'agent') {
        navigate('/admin/chat');
      } else {
        navigate('/customer/profile');
      }

      setTimeout(() => {
        selectChat(chatId);
      }, 300);
    }
  };
  
  const renderNotificationContent = () => {
    if (!notifications || notifications.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thông báo mới"
          style={{ padding: '20px 0' }}
        />
      );
    }
    
    return (
      <List
        dataSource={notifications}
        renderItem={notification => (          <List.Item 
            className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
            onClick={() => handleNotificationClick(notification.chatId, notification.type)}
          >
            <List.Item.Meta
              avatar={
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`notification-type ${notification.type === 'new_message' ? 'notification-type-new-message' : 'notification-type-other'}`} />
                  <span>
                    {notification.title || 'Thông báo mới'}
                  </span>
                </div>
              }
              description={
                <>
                  <div>{notification.message?.substring(0, 50)}{notification.message?.length > 50 ? '...' : ''}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {format(new Date(notification.createdAt), 'HH:mm')}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <Dropdown 
      dropdownRender={() => (
        <div className="notification-dropdown">
          <div className="notification-header">
            <Text strong>Thông báo</Text>
            {notifications.length > 0 && clearAllNotifications && (
              <Button 
                type="link" 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllNotifications();
                }}
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
          <div className="notification-content">
            {renderNotificationContent()}
          </div>
          {notifications.length > 0 && (
            <div className="notification-footer">
              <Button type="link" onClick={() => navigate('/admin/chat')}>
                Xem tất cả
              </Button>
            </div>
          )}
        </div>
      )}
      trigger={['click']} 
      placement="bottomRight"
    >      <Badge 
        count={unreadCount} 
        overflowCount={99}
        style={{ 
          backgroundColor: unreadCount > 0 ? '#ff4d4f' : '#52c41a',
          boxShadow: unreadCount > 0 ? '0 0 0 2px rgba(255, 77, 79, 0.2)' : 'none',
          transition: 'all 0.3s'
        }}
      >
        <Button 
          type="text" 
          icon={<BellOutlined style={{ 
            fontSize: '18px',
            color: isDarkMode ? '#fff' : undefined
          }} />} 
        />
      </Badge>
    </Dropdown>
  );
};

export default ChatNotification;
