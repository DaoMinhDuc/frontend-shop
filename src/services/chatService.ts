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
  notes?: Array<{
    text: string;
    createdBy: string;
    createdAt: string;
  }>;
}

interface PaginatedMessages {
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

// Get all chats for current user
export const getUserChats = async (): Promise<Chat[]> => {
  const { data } = await axios.get('/chats');
  return data;
};

// Get one chat by ID
export const getChatById = async (chatId: string): Promise<Chat> => {
  const { data } = await axios.get(`/chats/${chatId}`);
  return data;
};

// Get messages for a chat
export const getChatMessages = async (
  chatId: string,
  page: number = 1,
  limit: number = 30
): Promise<PaginatedMessages> => {
  const { data } = await axios.get(
    `/chats/${chatId}/messages?page=${page}&limit=${limit}`
  );
  return data;
};

// Create a new chat with initial message
export const createChat = async (message: string): Promise<Chat> => {
  const { data } = await axios.post('/chats', { message });
  return data;
};

// Update chat status (open/close)
export const updateChatStatus = async (
  chatId: string,
  status: 'active' | 'closed' | 'pending'
): Promise<Chat> => {
  const { data } = await axios.put(`/chats/${chatId}`, { status });
  return data;
};

// Add a note to a chat (admin only)
export const addChatNote = async (chatId: string, note: string): Promise<Chat> => {
  const { data } = await axios.post(`/chats/${chatId}/notes`, { note });
  return data;
};

// Update tags for a chat (admin only)
export const updateChatTags = async (chatId: string, tags: string[]): Promise<Chat> => {
  const { data } = await axios.put(`/chats/${chatId}/tags`, { tags });
  return data;
};

// Update customer data in a chat (admin only)
export const updateCustomerData = async (
  chatId: string,
  customerData: {
    name?: string;
    email?: string;
    phone?: string;
    orderCount?: number;
    totalSpent?: number;
    lastOrderDate?: Date;
  }
): Promise<Chat> => {
  const { data } = await axios.put(`/chats/${chatId}/customer-data`, { customerData });
  return data;
};
