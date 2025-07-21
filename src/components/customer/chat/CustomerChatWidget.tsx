import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../../../hooks/useChatContext';
import { useSocket } from '../../../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { Card, Button, Input, Badge, Typography, Spin, Avatar } from 'antd';
import { SendOutlined, CommentOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import './CustomerChatWidget.css';

const { Text } = Typography;

interface CustomerChatWidgetProps {
  onChatOpenChange?: (isOpen: boolean) => void;
}

const CustomerChatWidget = ({ onChatOpenChange }: CustomerChatWidgetProps) => {
  const { user } = useAuth();
  const { themeOptions } = useTheme();const { 
    chats, 
    currentChat, 
    messages, 
    loading, 
    unreadCount,
    sendMessage, 
    startNewChat,
    selectChat,
    markAsRead,
    loadMoreMessages,
    fetchMessages
  } = useChatContext();
  const { isConnected } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [sliderValue, setSliderValue] = useState(100);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Find active chat for the current customer
  useEffect(() => {
    if (isOpen && user && !currentChat && Array.isArray(chats)) {
      const activeChat = chats.find(
        chat => chat?.customer?._id === user?._id && chat?.status === 'active'
      );
      
      if (activeChat) {
        selectChat(activeChat._id);
      }
    }
  }, [isOpen, user, currentChat, selectChat, chats]);
    // Effect thông báo cho parent component khi trạng thái thay đổi
  useEffect(() => {
    if (onChatOpenChange) {
      onChatOpenChange(isOpen);
    }
  }, [isOpen, onChatOpenChange]);

  // Fallback polling mechanism when socket is disconnected
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isOpen && !isConnected && currentChat) {
      console.log('Socket disconnected, falling back to polling');
      intervalId = setInterval(() => {
        if (currentChat) {
          fetchMessages(currentChat._id);
        }
      }, 30000); // Poll every 30 seconds when socket is disconnected
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, isConnected, currentChat, fetchMessages]);
  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && currentChat && unreadCount > 0) {
      markAsRead();
    }
  }, [isOpen, currentChat, unreadCount, markAsRead]);
  // Scroll to bottom when messages change if slider is at 100%
  useEffect(() => {
    if (isOpen && messagesEndRef.current && sliderValue === 100) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, sliderValue]);
  // Scroll to position based on slider value
  useEffect(() => {
    if (isOpen && messagesContainerRef.current && !loading && messages.length > 0) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      
      // Calculate scroll position (0 is oldest messages, 100 is newest)
      const scrollPosition = (scrollHeight - container.clientHeight) * (1 - sliderValue / 100);
      container.scrollTop = scrollPosition;
    }  }, [sliderValue, isOpen, loading, messages.length]);

  // Reset slider to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      setSliderValue(100); 
    }  }, [messages.length, isOpen]);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    // Trước kia có callback ở đây nhưng giờ đã chuyển sang dùng useEffect
  };

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    if (!currentChat) {
      try {
        await startNewChat(text);
        setText('');
      } catch (error) {
        console.error('Error starting chat:', error);
      }
    } else {
      sendMessage(text);
      setText('');
      setSliderValue(100);
    }
  };

  const handleStartChat = async () => {
    if (!initialMessage.trim()) return;    try {
      await startNewChat(initialMessage);
      setInitialMessage('');
      setIsOpen(true);
      // Không cần callback ở đây nữa, đã dùng useEffect
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  const renderMessages = () => (
    <div className="messages-list">
      {messages.map((message) => {
        if (!message) return null;
        const isCurrentUser = message.sender?._id === user?._id;
        return (
          <div 
            key={message._id} 
            className={isCurrentUser ? 'message-row current-user' : 'message-row other-user'}
          >            {!isCurrentUser && (
              <Avatar 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: themeOptions.mode === 'dark' ? 
                    themeOptions.preset === 'default' ? '#1677ff' : 
                    themeOptions.preset === 'blue' ? '#1890ff' : 
                    themeOptions.preset === 'green' ? '#52c41a' : '#722ed1' :
                    '#1677ff',
                  marginRight: '8px',
                  flexShrink: 0,
                  border: themeOptions.mode === 'dark' ? '1px solid #303030' : 'none'
                }} 
              />
            )}
            <div className={isCurrentUser ? 'message-bubble message-bubble-current-user' : 'message-bubble'}>
              <div>{message.text}</div>              <Text className="text-secondary" style={{
                display: 'block',
                fontSize: '10px',
                marginTop: '4px',
                textAlign: 'right',
                opacity: 0.7,
                color: isCurrentUser ? 'rgba(255, 255, 255, 0.8)' : ''
              }}>
                {message.createdAt ? format(new Date(message.createdAt), 'HH:mm') : ''}
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
  const renderChatWindow = () => {
    if (!isOpen) return null;

    return (
      <Card className="chat-window" bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>      <div className="chat-header">
          <div>
            <div className="chat-header-title">Hỗ trợ khách hàng</div>
            <div className="chat-status-indicator">
              <div className="status-dot"></div>
              <span>{isConnected ? 'Đang kết nối' : 'Mất kết nối'}</span>
            </div>
          </div>          <Button 
            className="close-button"
            type="text" 
            icon={<CloseOutlined />} 
            onClick={toggleChat}
            size="small"
          />
        </div>

        {!currentChat && !loading ? (
          <div className="new-chat-container">
            <Text>Bắt đầu cuộc trò chuyện với nhân viên hỗ trợ</Text>
            <div style={{ marginTop: '15px' }}>
              <Input.TextArea 
                placeholder="Nhập tin nhắn..." 
                rows={3}
                value={initialMessage}
                onChange={e => setInitialMessage(e.target.value)}
              />
              <Button 
                type="primary" 
                onClick={handleStartChat} 
                style={{ marginTop: '10px', float: 'right' }}
              >
                Gửi
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="messages-container" ref={messagesContainerRef}>
              {loading ? (
                <div className="loading-container">
                  <Spin />
                </div>
              ) : (
                <>
                  {messages.length > 0 ? (
                    <>
                      {renderMessages()}
                      <div ref={messagesEndRef} />
                      {messages.length >= 30 && (
                        <Button 
                          type="link" 
                          onClick={loadMoreMessages}
                          style={{ margin: '10px auto', display: 'block' }}
                        >
                          Xem thêm tin nhắn
                        </Button>
                      )}
                    </>
                  ) : (                    <div className="empty-messages">
                      <Text className="text-secondary">Chưa có tin nhắn nào</Text>
                    </div>
                  )}
                </>
              )}
            </div>


            <div className="message-input-container">
              <Input 
                placeholder="Nhập tin nhắn..." 
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{ flex: 1, marginRight: '10px' }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />} 
                onClick={handleSendMessage}
                disabled={!text.trim() || loading}
              />
            </div>
          </>
        )}
      </Card>
    );
  };
  return (
    <div className="chat-widget">
      {renderChatWindow()}
      {!isOpen && (
        <Button 
          className="chat-button"
          type="primary" 
          icon={
            <Badge count={unreadCount}>
              <CommentOutlined style={{ fontSize: '24px' }} />
            </Badge>
          }
          onClick={toggleChat}
        />
      )}
    </div>
  );
};

export default CustomerChatWidget;
