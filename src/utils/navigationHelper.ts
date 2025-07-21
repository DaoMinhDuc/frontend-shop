import { ROUTES } from '../constants/routes';
import type { NavigateFunction } from 'react-router-dom';

/**
 * Navigation helper functions for admin dashboard
 */
export const adminNavigationHelper = {
  /**
   * Navigate to the admin users page
   * @param navigate - React Router navigate function
   */
  navigateToUsers: (navigate: NavigateFunction) => {
    navigate(ROUTES.ADMIN.USERS.LIST);
  },

  /**
   * Navigate to the admin products page
   * @param navigate - React Router navigate function
   */
  navigateToProducts: (navigate: NavigateFunction) => {
    navigate(ROUTES.ADMIN.PRODUCTS.LIST);
  },

  /**
   * Navigate to the admin dashboard page
   * @param navigate - React Router navigate function
   */
  navigateToDashboard: (navigate: NavigateFunction) => {
    navigate(ROUTES.ADMIN.ROOT);
  },

  /**
   * Navigate to the admin categories page
   * @param navigate - React Router navigate function
   */
  navigateToCategories: (navigate: NavigateFunction) => {
    navigate(ROUTES.ADMIN.CATEGORIES.LIST);
  },

  /**
   * Navigate to the admin orders page
   * @param navigate - React Router navigate function
   */
  navigateToOrders: (navigate: NavigateFunction) => {
    navigate(ROUTES.ADMIN.ORDERS.LIST);
  },

  /**
   * Navigate to the admin chat page
   * @param navigate - React Router navigate function
   */
  navigateToChat: (navigate: NavigateFunction) => {
    navigate(ROUTES.ADMIN.CHAT);
  }
};

/**
 * Navigation helper functions for customer dashboard
 */
export const customerNavigationHelper = {
  /**
   * Navigate to the customer profile page
   * @param navigate - React Router navigate function
   */
  navigateToProfile: (navigate: NavigateFunction) => {
    navigate(ROUTES.CUSTOMER.PROFILE);
  },

  /**
   * Navigate to the customer orders page
   * @param navigate - React Router navigate function
   */
  navigateToOrders: (navigate: NavigateFunction) => {
    navigate(ROUTES.CUSTOMER.ORDERS);
  },

  /**
   * Navigate to the customer wishlist page
   * @param navigate - React Router navigate function
   */
  navigateToWishlist: (navigate: NavigateFunction) => {
    navigate(ROUTES.CUSTOMER.WISHLIST);
  },

  /**
   * Navigate to the store home page
   * @param navigate - React Router navigate function
   */
  navigateToStore: (navigate: NavigateFunction) => {
    navigate(ROUTES.HOME);
  },

  /**
   * Navigate to the shopping cart page
   * @param navigate - React Router navigate function
   */
  navigateToCart: (navigate: NavigateFunction) => {
    navigate(ROUTES.CART);
  },

  /**
   * Navigate to the customer chat page
   * @param navigate - React Router navigate function
   */
  navigateToChat: (navigate: NavigateFunction) => {
    navigate(ROUTES.CUSTOMER.CHAT);
  }
};

/**
 * Maps admin sidebar menu keys to their corresponding routes
 * @param key - The menu key
 * @param navigate - React Router navigate function
 */
export const handleAdminMenuNavigation = (key: string, navigate: NavigateFunction) => {
  switch(key) {
    case '1':
      adminNavigationHelper.navigateToUsers(navigate);
      break;
    case '2':
      adminNavigationHelper.navigateToProducts(navigate);
      break;
    case '3':
      adminNavigationHelper.navigateToDashboard(navigate);
      break;
    case '4':
      adminNavigationHelper.navigateToCategories(navigate);
      break;
    case '6':
      adminNavigationHelper.navigateToOrders(navigate);
      break;
    case '7':
      adminNavigationHelper.navigateToChat(navigate);
      break;
    default:
      adminNavigationHelper.navigateToDashboard(navigate);
  }
};
