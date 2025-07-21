import type { User } from './user';

export interface Message {
  _id: string;
  text: string;
  sender: User;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
}

export interface UnreadCount {
  customer: number;
  agent: number;
}

export interface Chat {
  _id: string;
  customer: Customer;
  agents: string[];
  status: 'active' | 'pending' | 'closed';
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  unreadCount?: UnreadCount;
}

export interface CustomerData {
  phone?: string;
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: Date;
}

export interface ChatNote {
  text: string;
  createdBy: string;
  createdAt: string;
}

export interface AdminChat extends Chat {
  tags?: string[];
  notes?: ChatNote[];
  customerData?: CustomerData;
}

export interface ChatTags {
  tags: string[];
}
