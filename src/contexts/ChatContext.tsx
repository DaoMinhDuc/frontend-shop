import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as chatService from '../services/chatService';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';

// Define types
export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  text: string;
  isRead: boolean;
  createdAt: string;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
}

export interface Chat {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  agents: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  lastMessage?: {
    text: string;
    sender: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: {
    customer: number;
    agent: number;
  };
  status: 'active' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  notes?: Array<{
    text: string;
    createdBy: string;
    createdAt: string;
  }>;
}

export interface ChatNotification {
  _id: string;
  chatId: string;
  title: string;
  message: string;
  type: 'new_chat' | 'new_message' | 'chat_closed';
  read: boolean;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
}

// Define the shape of our context
interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  notifications: ChatNotification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  selectChat: (chatId: string) => void;
  startNewChat: (message: string) => Promise<Chat>;
  sendMessage: (message: string) => void;
  closeChat: (chatId: string) => Promise<void>;
  addNote: (chatId: string, note: string) => Promise<void>;
  updateTags: (chatId: string, tags: string[]) => Promise<void>;
  markAsRead: () => void;
  loadMoreMessages: () => Promise<void>;
  clearNotification: (chatId: string) => void;
  clearAllNotifications: () => void;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  messages: [],
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  fetchChats: async () => {},
  fetchMessages: async () => {},
  selectChat: () => {},
  startNewChat: async () => { throw new Error('Not implemented'); },
  sendMessage: () => {},
  closeChat: async () => {},
  addNote: async () => {},
  updateTags: async () => {},
  markAsRead: () => {},
  loadMoreMessages: async () => {},
  clearNotification: () => {},
  clearAllNotifications: () => {}
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 });
  
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  // Calculate unread messages count
  const unreadCount = notifications.filter(n => !n.read).length;
  // Mark messages as read
  const markAsRead = useCallback(() => {
    if (!currentChat || !socket || !isConnected) return;
    
    // Only emit mark_messages_read if there are unread messages
    const hasUnreadMessages = currentChat.unreadCount && 
      ((user?.role === 'customer' && currentChat.unreadCount.customer > 0) || 
       (user?.role === 'agent' && currentChat.unreadCount.agent > 0));
      
    if (hasUnreadMessages) {
      console.log('Marking messages as read for chat:', currentChat._id);
      socket.emit('mark_messages_read', {
        chatId: currentChat._id
      });
      
      // Update chat in the list
      setChats(prev => 
        prev.map(chat => {
          if (chat._id === currentChat._id) {
            const newUnreadCount = { ...chat.unreadCount };
            if (user?.role === 'customer') {
              newUnreadCount.customer = 0;
            } else {
              newUnreadCount.agent = 0;
            }
            return { ...chat, unreadCount: newUnreadCount };
          }
          return chat;
        })
      );
      
      // Update current chat
      setCurrentChat(prev => {
        if (!prev) return null;
        const newUnreadCount = { ...prev.unreadCount };
        if (user?.role === 'customer') {
          newUnreadCount.customer = 0;
        } else {
          newUnreadCount.agent = 0;
        }
        return { ...prev, unreadCount: newUnreadCount };
      });
    }
  }, [currentChat, socket, isConnected, user]);
  // Fetch all chats
  const fetchChats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedChats = await chatService.getUserChats();
      setChats(fetchedChats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for a specific chat
  const fetchMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      const response = await chatService.getChatMessages(chatId);
      setMessages(response.messages);
      setPagination(response.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, []);  // Select a chat
  const selectChat = useCallback((chatId: string) => {
    const selected = chats.find(chat => chat._id === chatId);
    if (selected) {
      setCurrentChat(selected);
      
      // Only fetch messages if we don't have them already or if they match a different chat
      const shouldFetchMessages = messages.length === 0 || 
                                messages[0].chat !== chatId ||
                                (selected.lastMessage && 
                                 messages.length > 0 && 
                                 new Date(selected.lastMessage.createdAt) > new Date(messages[messages.length - 1].createdAt));
      
      if (shouldFetchMessages) {
        fetchMessages(chatId);
      }
      
      // Mark notifications as read
      setNotifications(prev => 
        prev.map(notification => 
          notification.chatId === chatId 
            ? { ...notification, read: true } 
            : notification
        )
      );

      if (socket && isConnected && selected.unreadCount && 
          ((user?.role === 'customer' && selected.unreadCount.customer > 0) || 
           (user?.role === 'agent' && selected.unreadCount.agent > 0))) {
        markAsRead();
      }
    }
  }, [chats, fetchMessages, messages, markAsRead, socket, isConnected, user]);

  const startNewChat = useCallback(async (message: string): Promise<Chat> => {
    try {
      setLoading(true);
      const newChat = await chatService.createChat(message);
      
      // Update chats list
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      
      // Update messages
      setMessages([{
        _id: `temp-${Date.now()}`,
        chat: newChat._id,
        sender: {
          _id: user?._id || '',
          name: user?.name || '',
          role: user?.role || ''
        },
        text: message,
        isRead: false,
        createdAt: new Date().toISOString()
      }]);
      
      setLoading(false);
      return newChat;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback((message: string) => {
    if (!currentChat || !socket || !isConnected) {
      console.error('Cannot send message: chat not selected or socket not connected');
      return;
    }
    
    // Create temporary message to show immediately
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      chat: currentChat._id,
      sender: {
        _id: user?._id || '',
        name: user?.name || '',
        role: user?.role || ''
      },
      text: message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    // Add to messages
    setMessages(prev => [...prev, tempMessage]);
      // Send through socket
    socket.emit('send_message', {
      chatId: currentChat._id,
      text: message
    });
  }, [currentChat, socket, isConnected, user]);

  // Close a chat
  const closeChat = useCallback(async (chatId: string): Promise<void> => {
    try {
      setLoading(true);
      await chatService.updateChatStatus(chatId, 'closed');
      
      // Update chats list
      setChats(prev => 
        prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, status: 'closed' } 
            : chat
        )
      );
      
      // Update current chat if it's the one being closed
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat({ ...currentChat, status: 'closed' });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error closing chat:', err);
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, [currentChat]);

  // Add a note to a chat
  const addNote = useCallback(async (chatId: string, note: string): Promise<void> => {
    try {
      setLoading(true);
      await chatService.addChatNote(chatId, note);
      setLoading(false);
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update tags for a chat
  const updateTags = useCallback(async (chatId: string, tags: string[]): Promise<void> => {
    try {
      setLoading(true);
      await chatService.updateChatTags(chatId, tags);
      
      // Update chats list
      setChats(prev => 
        prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, tags } 
            : chat
        )
      );
      
      // Update current chat if it's the one being updated
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat({ ...currentChat, tags });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating tags:', err);
      setError(err as Error);
      setLoading(false);
      throw err;
    }  }, [currentChat]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!currentChat || pagination.page >= pagination.pages) return;
    try {
      setLoading(true);
      const nextPage = pagination.page + 1;
      const response = await chatService.getChatMessages(currentChat._id, nextPage);
      
      // Append older messages to the beginning
      setMessages(prev => [...response.messages, ...prev]);
      setPagination(response.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error loading more messages:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [currentChat, pagination]);

  // Clear a specific notification
  const clearNotification = useCallback((chatId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.chatId === chatId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  // Socket event handlers
  useEffect(() => {
    if (!socket || !isConnected || !user) return;
    
    console.log('Setting up socket event listeners for chat');

    // Handle temporary message replacement
    const updateTempMessages = (newMessage: Message) => {
      setMessages(prev => {
        // Replace temporary message with real one or add new message
        const tempIndex = prev.findIndex(m => 
          m._id.startsWith('temp-') && 
          m.text === newMessage.text &&
          m.sender._id === newMessage.sender._id
        );
        
        if (tempIndex >= 0) {
          const updated = [...prev];
          updated[tempIndex] = newMessage;
          return updated;
        } else {
          return [...prev, newMessage];
        }
      });
    };

    // Listen for new messages
    const handleNewMessage = (data: { message: Message }) => {
      console.log('New message received:', data);
      const { message } = data;
      
      // If message is for current chat, add to messages
      if (currentChat && message.chat === currentChat._id) {
        updateTempMessages(message);
        
        // If chat window is open and message is not from current user, mark as read
        if (message.sender._id !== user._id) {
          markAsRead();
        }
      } else {
        // Otherwise, add notification if we have this chat
        const chatExists = chats.some(chat => chat._id === message.chat);
        if (chatExists) {
          const newNotification: ChatNotification = {
            _id: `notification-${Date.now()}`,
            chatId: message.chat,
            title: 'Tin nhắn mới',
            message: `${message.sender.name}: ${message.text}`,
            type: 'new_message',
            read: false,
            createdAt: new Date().toISOString()
          };
          
          setNotifications(prev => {
            // Check if notification for this message already exists
            const exists = prev.some(n => 
              n.chatId === message.chat && 
              n.message === `${message.sender.name}: ${message.text}`
            );
            
            if (exists) return prev;
            return [newNotification, ...prev];
          });
        }
      }
      
      // Update chat in list with last message
      setChats(prev => 
        prev.map(chat => {
          if (chat._id === message.chat) {
            const newUnreadCount = chat.unreadCount ? { ...chat.unreadCount } : { customer: 0, agent: 0 };
            
            // Increment appropriate unread count
            if (message.sender._id !== user._id) {
              if (user.role === 'customer') {
                newUnreadCount.customer = (newUnreadCount.customer || 0) + 1;
              } else {
                newUnreadCount.agent = (newUnreadCount.agent || 0) + 1;
              }
            }
            
            return {
              ...chat,
              lastMessage: {
                text: message.text,
                sender: message.sender._id,
                createdAt: message.createdAt,
                isRead: message.isRead
              },
              unreadCount: newUnreadCount
            };
          }
          return chat;
        })
      );
    };

    // Handle direct notification
    const handleNotification = (data: { type: string, chatId: string, message: Message }) => {
      console.log('Notification received:', data);
      const { type, chatId, message } = data;
      
      if (type === 'new_message' && message) {
        // If we're not in the chat where the message was sent, create notification
        if (!currentChat || currentChat._id !== chatId) {
          const newNotification: ChatNotification = {
            _id: `notification-${Date.now()}`,
            chatId,
            title: 'Tin nhắn mới',
            message: `${message.sender.name}: ${message.text}`,
            type: 'new_message',
            read: false,
            createdAt: new Date().toISOString()
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Update unread count in chats list
          setChats(prev => 
            prev.map(chat => {
              if (chat._id === chatId) {
                const newUnreadCount = { ...chat.unreadCount };
                if (user.role === 'customer') {
                  newUnreadCount.customer = (newUnreadCount.customer || 0) + 1;
                } else {
                  newUnreadCount.agent = (newUnreadCount.agent || 0) + 1;
                }
                
                return {
                  ...chat,
                  unreadCount: newUnreadCount,
                  lastMessage: {
                    text: message.text,
                    sender: message.sender._id,
                    createdAt: message.createdAt,
                    isRead: false
                  }
                };
              }
              return chat;
            })
          );
        }
      }
    };

    // Listen for chat status updates
    const handleChatStatusUpdate = (data: { chatId: string, status: 'active' | 'closed' | 'pending' }) => {
      const { chatId, status } = data;
      
      // Update chat in list
      setChats(prev => 
        prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, status } 
            : chat
        )
      );
      
      // Update current chat if it's the one being updated
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat({ ...currentChat, status });
      }
      
      // Add notification for chat closed
      if (status === 'closed') {
        const newNotification: ChatNotification = {
          _id: `notification-${Date.now()}`,
          chatId,
          title: 'Đóng cuộc hội thoại',
          message: 'Cuộc hội thoại này đã được đóng',
          type: 'chat_closed',
          read: false,
          createdAt: new Date().toISOString()
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    };

    // Set up event listeners
    socket.on('new_message', handleNewMessage);
    socket.on('notification', handleNotification);
    socket.on('chat_status_update', handleChatStatusUpdate);
    socket.on('messages_marked_read', (data) => {
      console.log('Messages marked as read:', data);
      // Update unread counts
      if (data.chatId) {
        setChats(prev => 
          prev.map(chat => {
            if (chat._id === data.chatId) {
              const newUnreadCount = { ...chat.unreadCount };
              if (user.role === 'customer') {
                newUnreadCount.customer = 0;
              } else {
                newUnreadCount.agent = 0;
              }
              
              return {
                ...chat,
                unreadCount: newUnreadCount
              };
            }
            return chat;
          })
        );
      }
    });    if (Array.isArray(chats)) {
      chats.forEach(chat => {
        socket.emit('join_chat', chat._id);
      });
    }

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('notification', handleNotification);
      socket.off('chat_status_update', handleChatStatusUpdate);
      socket.off('messages_marked_read');
    };
  }, [socket, isConnected, currentChat, user, markAsRead, chats]);
  useEffect(() => {
    if (user) {
      if (chats.length === 0) {
        fetchChats();
      }
    } else {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
      setNotifications([]);
    }
  }, [user, fetchChats, chats.length]);

  // Create context value
  const value: ChatContextType = {
    chats,
    currentChat,
    messages,
    notifications,
    unreadCount,
    loading,
    error,
    fetchChats,
    fetchMessages,
    selectChat,
    startNewChat,
    sendMessage,
    closeChat,
    addNote,
    updateTags,
    markAsRead,
    loadMoreMessages,
    clearNotification,
    clearAllNotifications
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;