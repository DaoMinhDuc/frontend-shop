import React, { useState } from 'react';
import { Button, Tag, Typography, List, Spin, Input, Avatar, Tooltip } from 'antd';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { 
  SendOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import { type Chat, type Message } from '../../../services/chatService';
import ChatMessage from '../../shared/ChatMessage';
import { useTheme } from '../../../hooks/useTheme';

const { Text } = Typography;
const { TextArea } = Input;

interface ChatMainProps {
  currentChat: Chat | null;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showInfoPanel: boolean;
  setShowInfoPanel: (show: boolean) => void;  
  messages: Message[];
  loading: boolean;
  loadMoreMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  text: string;
  setText: (text: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
  user: { _id: string; name: string; role?: string; };
  isMobile: boolean;
}

const ChatMain: React.FC<ChatMainProps> = ({
  currentChat,
  setShowSidebar,
  showInfoPanel,
  setShowInfoPanel,
  messages,
  loading,
  loadMoreMessages,
  messagesEndRef,
  text,
  setText,
  handleKeyPress,
  handleSendMessage,
  user
}) => {
  const { themeOptions } = useTheme();
  const [emojiVisible, setEmojiVisible] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const cursorPosition = (document.querySelector('.ant-input') as HTMLTextAreaElement)?.selectionStart || text.length;
    const newText = text.slice(0, cursorPosition) + emojiData.emoji + text.slice(cursorPosition);
    setText(newText);
    setEmojiVisible(false);
  };

  if (!currentChat) {
    return (
      <div className="chat-main">
        <div className="chat-empty-state">
          <Button 
            type="text"
            onClick={() => setShowSidebar(true)} 
            style={{ position: 'absolute', top: '15px', left: '15px' }}
            title="Mở rộng danh sách"
          />
          <UserOutlined style={{ fontSize: '48px', marginBottom: '20px' }} />
          <Text>Chọn một cuộc trò chuyện để bắt đầu</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div className="chat-top-bar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginRight: '12px' }}>
              <Avatar style={{ 
                backgroundColor: themeOptions.mode === 'dark' ? '#1f1f1f' : themeOptions.preset === 'default' ? '#1677ff' : 
                themeOptions.preset === 'blue' ? '#1890ff' : 
                themeOptions.preset === 'green' ? '#52c41a' : '#722ed1' 
              }}>
                {currentChat.customer.name.charAt(0)}
              </Avatar>              <span 
                style={{ 
                  position: 'absolute', 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: '#52c41a', 
                  borderRadius: '50%', 
                  bottom: 0, 
                  right: 0, 
                  border: `2px solid ${themeOptions.mode === 'dark' ? '#1f1f1f' : 'white'}`
                }}
              />
            </div>
            <div>
              <Text strong className="chat-customer-name">
                {currentChat.customer.name}
              </Text>
              <Tag color={currentChat.status === 'active' ? 'green' : currentChat.status === 'pending' ? 'orange' : 'default'} style={{ marginLeft: 8 }}>
                {currentChat.status === 'active' ? 'Đang mở' : currentChat.status === 'pending' ? 'Chờ xử lý' : 'Đã đóng'}
              </Tag>
              <Text className="text-secondary" style={{ marginLeft: 16, fontSize: 12 }}>
                {format(new Date(currentChat.createdAt), 'dd/MM/yyyy HH:mm')}
              </Text>
            </div>
          </div>
        </div>
        
        <div>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            style={{ marginLeft: '8px' }}
            title={showInfoPanel ? "Ẩn thông tin khách hàng" : "Hiện thông tin khách hàng"}
          />
        </div>
      </div>
      
      <div className="messages-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <>
            {messages.length > 0 ? (
              <>
                {messages.length >= 30 && (
                  <Button 
                    type="link" 
                    onClick={loadMoreMessages}
                    style={{ margin: '10px auto', display: 'block' }}
                  >
                    Xem thêm tin nhắn
                  </Button>
                )}
                <List
                  className="message-list"
                  itemLayout="horizontal"
                  dataSource={messages}
                  renderItem={message => {
                    const isCurrentUser = message.sender._id === user?._id;
                    return (
                      <List.Item style={{ padding: '4px 16px', border: 'none', display: 'flex', width: '100%' }}>
                        <div style={{ width: '100%', display: 'flex' }}>
                          <ChatMessage 
                            text={message.text}
                            sender={message.sender}
                            timestamp={message.createdAt}
                            isRead={message.isRead || false}
                            isCurrentUser={isCurrentUser}
                          />
                        </div>
                      </List.Item>
                    );
                  }}
                />
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text className="text-secondary">Chưa có tin nhắn nào</Text>
              </div>
            )}
          </>
        )}
      </div>
      
      {currentChat.status === 'active' && (
        <div className="message-input-container">
          <div className="message-input-actions">
            <div style={{ position: 'relative' }}>
              <Tooltip title="Thêm emoji">
                <Button 
                  type="text" 
                  icon={<SmileOutlined />} 
                  className="input-action-button"
                  onClick={() => setEmojiVisible(!emojiVisible)}
                />
              </Tooltip>
              {emojiVisible && (
                <div style={{ position: 'absolute', bottom: '40px', left: 0, zIndex: 1000 }}>
                  <EmojiPicker 
                    theme={themeOptions.mode === 'dark' ? Theme.DARK : Theme.LIGHT}
                    onEmojiClick={onEmojiClick}
                  />
                </div>
              )}
            </div>
          </div>
          
          <TextArea 
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)" 
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ flex: 1 }}
          />
          
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSendMessage}
            disabled={!text.trim() || loading}
            style={{ marginLeft: '10px' }}
          />
        </div>
      )}
      
      {currentChat.status !== 'active' && (
        <div className="chat-closed-state">
          <Text type="secondary">Cuộc trò chuyện này đã kết thúc</Text>
          <Button 
            type="link" 
            icon={<ClockCircleOutlined />}
            onClick={() => {/* Reopen chat logic */}}
          >
            Mở lại cuộc trò chuyện
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatMain;
