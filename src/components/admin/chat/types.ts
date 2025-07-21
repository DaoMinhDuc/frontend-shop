// types.ts
import { type Chat } from '../../../services/chatService';

// Chat tag interface
export interface ChatTags {
  tags: string[];
}

// Extended chat interface to include the properties used in admin panel
export interface ExtendedChat extends Chat {
  tags?: string[];
  notes?: Array<{
    text: string;
    createdBy: string;
    createdAt: string;
  }>;
  customerData?: {
    phone?: string;
    orderCount?: number;
    totalSpent?: number;
    lastOrderDate?: Date;
  };
}
