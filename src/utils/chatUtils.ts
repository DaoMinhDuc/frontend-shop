import type { AdminChat, Chat } from '../types/chat';

/**
 * Filter chats based on their status
 */
export const filterChatsByStatus = (chats: Chat[], status: string): Chat[] => {
  switch (status) {
    case 'active':
      return chats.filter(chat => chat.status === 'active');
    case 'pending':
      return chats.filter(chat => chat.status === 'pending');
    case 'closed':
      return chats.filter(chat => chat.status === 'closed');
    case 'all':
    default:
      return chats;
  }
};

/**
 * Get a color for chat status
 */
export const getChatStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'green';
    case 'pending':
      return 'orange';
    default:
      return 'default';
  }
};

/**
 * Get a display name for chat status
 */
export const getChatStatusName = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Đang mở';
    case 'pending':
      return 'Chờ xử lý';
    case 'closed':
      return 'Đã đóng';
    default:
      return status;
  }
};

/**
 * Cast a regular Chat to AdminChat with extended properties
 */
export const asAdminChat = (chat: Chat): AdminChat => {
  return chat as AdminChat;
};
