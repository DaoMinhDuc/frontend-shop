import { useState } from 'react';
import axios from '../lib/axios';

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
}

interface UseChatResult {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  startNewChat: (message: string) => Promise<Chat>;
  closeChat: (chatId: string) => Promise<void>;
  addNote: (chatId: string, note: string) => Promise<void>;
  updateTags: (chatId: string, tags: string[]) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useChat = (): UseChatResult => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/chats');
      setChats(response.data);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/chats/${chatId}/messages`);
      setMessages(response.data.messages);
      
      // Set current chat
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        setCurrentChat(chat);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const startNewChat = async (message: string): Promise<Chat> => {
    try {
      setLoading(true);
      const response = await axios.post('/chats', { message });
      const newChat = response.data;
      
      // Update chats list
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      
      setLoading(false);
      return newChat;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  const closeChat = async (chatId: string): Promise<void> => {
    try {
      setLoading(true);
      await axios.put(`/chats/${chatId}`, { status: 'closed' });
      
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
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  const addNote = async (chatId: string, note: string): Promise<void> => {
    try {
      setLoading(true);
      await axios.post(`/chats/${chatId}/notes`, { note });
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  const updateTags = async (chatId: string, tags: string[]): Promise<void> => {
    try {
      setLoading(true);
      await axios.put(`/chats/${chatId}/tags`, { tags });
      
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
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return {
    chats,
    currentChat,
    messages,
    fetchChats,
    fetchMessages,
    startNewChat,
    closeChat,
    addNote,
    updateTags,
    loading,
    error
  };
};
