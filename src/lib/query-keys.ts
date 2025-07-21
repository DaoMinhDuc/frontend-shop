// Query Keys for React Query
// Centralized location for all query keys to avoid conflicts and enable better caching

export const QUERY_KEYS = {
  // User related queries
  USER: {
    ALL: ['users'] as const,
    PROFILE: ['users', 'profile'] as const,
    LIST: ['users', 'list'] as const,
    ADDRESSES: ['users', 'addresses'] as const,
    WISHLIST: ['users', 'wishlist'] as const,
    DETAIL: (id: string) => ['users', 'detail', id] as const,
  },
  // Product related queries
  PRODUCT: {
    ALL: ['products'] as const,
    LIST: (filters?: Record<string, unknown>) => ['products', 'list', filters] as const,
    DETAIL: (id: string) => ['products', 'detail', id] as const,
    SEARCH: (searchText: string) => ['products', 'search', searchText] as const,
    FEATURED: ['products', 'featured'] as const,
    RECOMMENDED: (categoryId?: string, productId?: string) => ['products', 'recommended', categoryId, productId] as const,
  },
  // Category related queries
  CATEGORY: {
    ALL: ['categories'] as const,
    LIST: (filters?: Record<string, unknown>) => ['categories', 'list', filters] as const,
    DETAIL: (id: string) => ['categories', 'detail', id] as const,
  },  // Order related queries
  ORDER: {
    ALL: ['orders'] as const,
    USER_ORDERS: ['orders', 'user'] as const,
    DETAIL: (id: string) => ['orders', 'detail', id] as const,
    LIST: (filters?: Record<string, unknown>) => ['orders', 'list', { ...filters }] as const,
  },

  // Cart related queries
  CART: {
    ALL: ['cart'] as const,
    DETAIL: ['cart', 'detail'] as const,
  },

  // Chat related queries
  CHAT: {
    ALL: ['chats'] as const,
    LIST: ['chats', 'list'] as const,
    DETAIL: (id: string) => ['chats', 'detail', id] as const,
    MESSAGES: (chatId: string) => ['chats', 'messages', chatId] as const,
  },

  // Discount related queries
  DISCOUNT: {
    ALL: ['discounts'] as const,
    LIST: ['discounts', 'list'] as const,
    DETAIL: (id: string) => ['discounts', 'detail', id] as const,
    AVAILABLE: ['discounts', 'available'] as const,
  },
} as const;

// Helper function to create query keys with parameters
export const createQueryKey = {
  products: {
    list: (filters?: Record<string, unknown>) => QUERY_KEYS.PRODUCT.LIST(filters),
    detail: (id: string) => QUERY_KEYS.PRODUCT.DETAIL(id),
    search: (searchText: string) => QUERY_KEYS.PRODUCT.SEARCH(searchText),
    recommended: (categoryId?: string, productId?: string) => 
      QUERY_KEYS.PRODUCT.RECOMMENDED(categoryId, productId),
  },
  categories: {
    detail: (id: string) => QUERY_KEYS.CATEGORY.DETAIL(id),
  },
  orders: {
    detail: (id: string) => QUERY_KEYS.ORDER.DETAIL(id),
    list: (filters?: Record<string, unknown>) => QUERY_KEYS.ORDER.LIST(filters),
  },
  users: {
    detail: (id: string) => QUERY_KEYS.USER.DETAIL(id),
  },
  chats: {
    detail: (id: string) => QUERY_KEYS.CHAT.DETAIL(id),
    messages: (chatId: string) => QUERY_KEYS.CHAT.MESSAGES(chatId),
  },
  discounts: {
    detail: (id: string) => QUERY_KEYS.DISCOUNT.DETAIL(id),
  },
};
