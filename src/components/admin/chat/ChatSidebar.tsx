// ChatSidebar.tsx
import React from 'react';
import { Input, Tabs, Badge, Empty, Button, Tag, Typography, Avatar, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { type Chat } from '../../../services/chatService';
import type { ExtendedChat } from './types';
import { useTheme } from '../../../hooks/useTheme';

const { TabPane } = Tabs;
const { Text } = Typography;

interface ChatSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredChats: Chat[];
  currentChat: Chat | null;
  selectChat: (chatId: string) => void;
  isMobile: boolean;
  setShowSidebar: (show: boolean) => void;
  showSidebar: boolean;
  chats: Chat[];
  onSearch: (query: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeTab,
  setActiveTab,
  filteredChats,
  currentChat,
  selectChat,
  isMobile,
  setShowSidebar,
  showSidebar,
  chats,
  onSearch
}) => {
  const { themeOptions } = useTheme();
  
  return (
    <div className={`chat-sidebar ${!showSidebar ? 'chat-sidebar-collapsed' : ''}`}>      <div className="chat-header-search">        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>          <Input.Search 
            placeholder="Tìm kiếm khách hàng..." 
            style={{ flex: 1, marginRight: '8px' }}
            onSearch={onSearch}
            // Using onChange without immediate API call to prevent UI freeze
            // The debounced search is handled in useChatFilter
            onChange={(e) => onSearch(e.target.value)}
            allowClear
          />
          <Button 
            icon={<LeftOutlined />} 
            onClick={() => setShowSidebar(false)}
            title="Thu gọn danh sách"
          />
        </div>
      </div>
      
      {!showSidebar && (
        <div className="collapsed-actions">
          <Tooltip title="Mở rộng danh sách">
            <Button 
              type="text"
              icon={<RightOutlined />} 
              onClick={() => setShowSidebar(true)}
              style={{ margin: '12px auto' }}
            />
          </Tooltip>
        </div>
      )}
      
      {/* Tabs for filtering chats */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="chat-tabs"
      >
        <TabPane tab={<Badge count={chats.filter(c => c.status === 'active').length}>Đang mở</Badge>} key="active" />
        <TabPane tab={<Badge count={chats.filter(c => c.status === 'pending').length}>Chờ</Badge>} key="pending" />
        <TabPane tab="Đã đóng" key="closed" />
        <TabPane tab="Tất cả" key="all" />
      </Tabs>
      
      {/* Chat list */}
      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => {
            const extChat = chat as ExtendedChat;
            return (
              <div
                key={chat._id} 
                className={`chat-item ${currentChat?._id === chat._id ? 'active' : ''}`}
                onClick={() => {
                  selectChat(chat._id);
                  if (isMobile) {
                    setShowSidebar(false);
                  }
                }}
              > 
                <Avatar 
                  style={{ 
                    backgroundColor: themeOptions.mode === 'dark' ? '#1f1f1f' : 
                      themeOptions.preset === 'default' ? '#1677ff' : 
                      themeOptions.preset === 'blue' ? '#1890ff' : 
                      themeOptions.preset === 'green' ? '#52c41a' : '#722ed1',
                    marginRight: showSidebar ? '8px' : '0' 
                  }}
                >
                  {chat.customer.name.charAt(0)}
                </Avatar>
                
                <div className="chat-item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{chat.customer.name}</Text>
                    <Text className="text-secondary" style={{ fontSize: '12px' }}>
                      {format(new Date(chat.updatedAt), 'HH:mm')}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                    <Text className="text-secondary" ellipsis style={{ maxWidth: '180px' }}>
                      {chat.lastMessage?.text || 'Chưa có tin nhắn'}
                    </Text>
                    {chat.unreadCount?.agent > 0 && (
                      <Badge 
                        count={chat.unreadCount.agent} 
                        style={{ backgroundColor: '#52c41a' }}
                      />
                    )}
                  </div>
                  {extChat.tags && extChat.tags.length > 0 && (
                    <div style={{ marginTop: '5px' }}>
                      {extChat.tags.map((tag: string, index: number) => (
                        <Tag key={index} color="blue" style={{ marginRight: '5px' }}>{tag}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Không có cuộc trò chuyện nào"
            style={{ padding: '40px 0' }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
