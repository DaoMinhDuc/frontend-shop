export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CART: '/cart',
  CHECKOUT: '/checkout',
  UNAUTHORIZED: '/unauthorized',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  PRODUCTS: '/products',
    CUSTOMER: {
    ROOT: '/',
    PROFILE: '/customer/profile',
    ORDERS: '/customer/orders',
    WISHLIST: '/customer/wishlist',
    CHAT: '/customer/chat',
  },
  
  ADMIN: {
    ROOT: '/admin',
    USERS: {
      LIST: '/admin/users',
      ADD: '/admin/users/add',
      EDIT: (id: string) => `/admin/users/edit/${id}`,
      DETAIL: (id: string) => `/admin/users/detail/${id}`,
    },
    PRODUCTS: {
      LIST: '/admin/products',
      ADD: '/admin/products/add',
      EDIT: (id: string) => `/admin/products/edit/${id}`,
      DETAIL: (id: string) => `/admin/products/detail/${id}`,
    },
    CATEGORIES: {
      LIST: '/admin/categories',
      ADD: '/admin/categories/add',
      EDIT: (id: string) => `/admin/categories/edit/${id}`,
      DETAIL: (id: string) => `/admin/categories/detail/${id}`,
    },
    ORDERS: {
      LIST: '/admin/orders',
      EDIT: (id: string) => `/admin/orders/edit/${id}`,
      DETAIL: (id: string) => `/admin/orders/detail/${id}`,
    },
    CHAT: '/admin/chat',
  }
};

export default ROUTES;
