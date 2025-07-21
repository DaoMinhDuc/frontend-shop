// useChatFilter.ts
import { useState, useCallback, useMemo } from 'react';
import { type Chat } from '../../../services/chatService';
import { debounce } from 'lodash-es';

export const useChatFilter = (chats: Chat[]) => {
  const [activeTab, setActiveTab] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tạo một debounced handler cho việc tìm kiếm
  const debouncedSetSearchQuery = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300), // 300ms debounce time
    []
  );

  // Search filter function with debounce
  const handleSearch = useCallback((query: string) => {
    debouncedSetSearchQuery(query);
  }, [debouncedSetSearchQuery]);

  // Get filtered chats based on status and search query
  const filteredChats = chats.filter(chat => {
    // First filter by tab/status
    const statusMatch = 
      activeTab === 'all' || 
      (activeTab === 'active' && chat.status === 'active') ||
      (activeTab === 'pending' && chat.status === 'pending') ||
      (activeTab === 'closed' && chat.status === 'closed');
    
    // Then filter by search query if it exists
    if (!statusMatch) return false;
    if (!searchQuery.trim()) return true;
    
    // Search in customer name and possibly other fields
    const query = searchQuery.toLowerCase();
    return (
      chat.customer.name.toLowerCase().includes(query) ||
      (chat.customer.email && chat.customer.email.toLowerCase().includes(query)) ||
      (chat.lastMessage?.text && chat.lastMessage.text.toLowerCase().includes(query))
    );
  });
  
  return {
    activeTab,
    setActiveTab,
    filteredChats,
    searchQuery,
    handleSearch
  };
};
