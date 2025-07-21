import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../../hooks/useChatContext';
import { useAuth } from '../../../hooks/useAuth';
import { Form } from 'antd';
import './AdminChatPanel.css';

import ChatSidebar from './ChatSidebar';
import ChatMain from './ChatMain';
import CustomerInfoPanel from './CustomerInfoPanel';
import TagsModal from './TagsModal';
import type { ExtendedChat, ChatTags } from './types';
import { useChatFilter } from './useChatFilter';
import { useResponsiveLayout } from './useResponsiveLayout';
import CustomCard from '../../shared/CustomCard';

const AdminChatPanel = () => {  const { 
    chats, 
    currentChat, 
    messages, 
    loading, 
    selectChat,
    sendMessage,
    loadMoreMessages
  } = useChatContext();  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  const { activeTab, setActiveTab, filteredChats, handleSearch } = useChatFilter(chats);
  const { showInfoPanel, setShowInfoPanel, showSidebar, setShowSidebar, isMobile } = useResponsiveLayout();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const [tagModalVisible, setTagModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  
  const [text, setText] = useState<string>('');
  const handleSendMessage = () => {
    if (!text.trim() || !currentChat) return;
    
    sendMessage(text);
    setText('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const handleManageTags = () => {
    if (!currentChat) return;
    const extendedChat = currentChat as ExtendedChat;
    
    form.setFieldsValue({
      tags: extendedChat.tags || [],
    });
    
    setTagModalVisible(true);
  };

  const handleTagsSubmit = (values: ChatTags) => {
    console.log('Updating tags:', values);
    setTagModalVisible(false);
  };

  return (
    <>      
    <CustomCard 
        title="Quản lý trò chuyện hỗ trợ" 
      >
        <div className="chat-layout">          <ChatSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredChats={filteredChats}
            currentChat={currentChat}
            selectChat={selectChat}
            isMobile={isMobile}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
            chats={chats}
            onSearch={handleSearch}
          />
          <ChatMain 
            currentChat={currentChat}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            showInfoPanel={showInfoPanel}
            setShowInfoPanel={setShowInfoPanel}
            messages={messages}
            loading={loading}
            loadMoreMessages={loadMoreMessages}            
            messagesEndRef={messagesEndRef}
            text={text}
            setText={setText}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
            user={user || { _id: '', name: 'Anonymous' }}
            isMobile={isMobile}
          />
          
          {showInfoPanel && currentChat && (
            <CustomerInfoPanel
              currentChat={currentChat as ExtendedChat}
              showInfoPanel={showInfoPanel}
              setShowInfoPanel={setShowInfoPanel}
              handleManageTags={handleManageTags}
            />
          )}
        </div>
      </CustomCard>
      
      <TagsModal
        visible={tagModalVisible}
        form={form}
        onCancel={() => setTagModalVisible(false)}
        onSubmit={handleTagsSubmit}
      />
    </>
  );
};

export default AdminChatPanel;
