import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../../../hooks/useChatContext';
import ChatMessage from '../../shared/ChatMessage';

import { Card, Button, Input, List, Typography, Spin, Empty, Tabs } from 'antd';
import { SendOutlined, CommentOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import './CustomerProfileChat.css';
import { useAuth } from '../../../hooks/useAuth';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const CustomerProfileChat = () => {
  const { user } = useAuth();
  const { 
    chats, 
    currentChat, 
    messages, 
    loading, 
    sendMessage, 
    startNewChat,
    selectChat,
    loadMoreMessages
  } = useChatContext();

  const [text, setText] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('active');

  // Get filtered chats based on status
  const filteredChats = chats.filter(chat => {
    if (activeTab === 'active') return chat.status === 'active';
    if (activeTab === 'closed') return chat.status === 'closed';
    return true; // 'all' tab
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    }
  };

  const handleStartChat = async () => {
    if (!initialMessage.trim()) return;

    try {
      await startNewChat(initialMessage);
      setInitialMessage('');
      setActiveTab('active');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };  const renderMessages = () => (
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
  );
  const renderChatSidebar = () => (
    <div className="chat-sidebar">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ padding: '0 10px' }}
        size="small"
      >
        <TabPane tab="Đang mở" key="active" />
        <TabPane tab="Đã đóng" key="closed" />
        <TabPane tab="Tất cả" key="all" />
      </Tabs>
      
      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <div 
              key={chat._id} 
              className={`chat-item ${currentChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => selectChat(chat._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Hỗ trợ #{chat._id.substring(0, 5)}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {format(new Date(chat.updatedAt), 'dd/MM/yyyy')}
                </Text>
              </div>
              <Text type="secondary" ellipsis>
                {chat.lastMessage?.text || 'Chưa có tin nhắn'}
              </Text>
            </div>
          ))
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Không có cuộc trò chuyện"
            style={{ padding: '20px 0' }}
          />
        )}
      </div>      {(filteredChats.length === 0 || !chats.some(chat => chat.status === 'active')) && (
        <div style={{ padding: '10px', borderTop: '1px solid #f0f0f0' }}>
          <Button 
            type="primary" 
            icon={<CommentOutlined />}
            onClick={() => setActiveTab('new')}
            block
          >
            Tạo cuộc trò chuyện mới
          </Button>
        </div>
      )}
    </div>
  );
  const renderChatMain = () => {
    if (activeTab === 'new') {
      return (
        <div className="chat-main">
          <div className="chat-new-section">
            <Title level={4}>Bắt đầu cuộc trò chuyện mới</Title>
            <div style={{ marginTop: '15px', maxWidth: '500px', margin: '0 auto' }}>
              <Input.TextArea 
                placeholder="Nhập tin nhắn..." 
                rows={5}
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
        </div>
      );
    }

    if (!currentChat) {
      return (
        <div className="chat-main">
          <div className="chat-empty-state">
            <CommentOutlined style={{ fontSize: '48px', marginBottom: '20px' }} />
            <Text>Chọn một cuộc trò chuyện hoặc tạo cuộc trò chuyện mới</Text>
          </div>
        </div>
      );
    }

    return (
      <div className="chat-main">
        <div className="chat-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Hỗ trợ #{currentChat._id.substring(0, 5)}</Text>
            <Text type="secondary">
              {currentChat.status === 'active' ? 'Đang mở' : 'Đã đóng'}
            </Text>
          </div>
          <Text type="secondary">
            {format(new Date(currentChat.createdAt), 'dd/MM/yyyy HH:mm')}
          </Text>
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
                  {renderMessages()}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">Chưa có tin nhắn nào</Text>
                </div>
              )}
            </>
          )}
        </div>

        {currentChat.status === 'active' && (
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
        )}

        {currentChat.status !== 'active' && (
          <div className="chat-closed-footer">
            <Text type="secondary">Cuộc trò chuyện này đã kết thúc</Text>
          </div>
        )}
      </div>
    );
  };
  return (
    <Card title="Trò chuyện hỗ trợ" style={{ marginBottom: '24px' }}>
      <div className="chat-container">
        {renderChatSidebar()}
        {renderChatMain()}
      </div>
    </Card>
  );
};

export default CustomerProfileChat;
