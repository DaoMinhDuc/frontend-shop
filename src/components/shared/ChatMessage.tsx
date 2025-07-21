import React from 'react';
import { Typography, Avatar } from 'antd';
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import './ChatMessage.css';
import { useTheme } from '../../hooks/useTheme';
import { COLOR_PRESETS } from '../../constants/themeConstants';

const { Text } = Typography;

interface MessageProps {
  text: string;
  sender: {
    _id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
  isRead: boolean;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<MessageProps> = ({
  text,
  sender,
  timestamp,
  isRead,
  isCurrentUser
}) => {
  const { themeOptions } = useTheme();
  
  return (
    <div className={`message-container ${isCurrentUser ? 'message-container-current-user' : ''}`}>
      {!isCurrentUser && (
        <Avatar
          src={sender.avatar}
          icon={<UserOutlined />}
          style={{ 
            backgroundColor: themeOptions.mode === 'dark' ? '#1f1f1f' : 
              themeOptions.preset === 'default' ? '#1677ff' : 
              themeOptions.preset === 'blue' ? '#1890ff' : 
              themeOptions.preset === 'green' ? '#52c41a' : '#722ed1',
            marginRight: '8px',
            marginTop: '2px'
          }}
        />
      )}
      
      <div className="message-content">
        {!isCurrentUser && (
          <Text className="message-sender-name">
            {sender.name}
          </Text>
        )}
        
        <div 
          className={`message-bubble ${isCurrentUser ? 'message-bubble-current-user' : ''}`}
          style={{
            backgroundColor: isCurrentUser ? 
              (themeOptions.mode === 'dark' ? 
                COLOR_PRESETS[themeOptions.preset][themeOptions.mode].colorPrimary : 
                COLOR_PRESETS[themeOptions.preset][themeOptions.mode].colorPrimary) : 
              (themeOptions.mode === 'dark' ? '#1f1f1f' : 'white')
          }}
        >
          {/* Text content */}
          <div style={{ 
            wordBreak: 'break-word', 
            color: isCurrentUser ? 'white' : (themeOptions.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'inherit')
          }}>
            {text}
          </div>
          
          <div className={`message-meta ${isCurrentUser ? 'message-meta-current-user' : ''}`}>
            <Text
              style={{ 
                color: isCurrentUser ? 'rgba(255, 255, 255, 0.8)' : 'inherit',
                fontSize: '11px'
              }}
              className={`message-time ${isCurrentUser ? 'message-time-current-user' : ''}`}
            >
              {format(new Date(timestamp), 'HH:mm')}
            </Text>
            
            {isCurrentUser && isRead && (
              <div className="read-receipt" style={{ color: themeOptions.preset === 'green' ? '#52c41a' : '#52c41a' }}>
                <CheckOutlined style={{ fontSize: '12px' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
