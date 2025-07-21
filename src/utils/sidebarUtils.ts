/**
 * Sidebar utility functions for handling responsive layout and other sidebar functionality
 */

/**
 * Handle window resize and set collapse state accordingly
 * @param setCollapsed - Function to set collapse state
 */
export const handleSidebarResize = (setCollapsed: (collapsed: boolean) => void) => {
  if (window.innerWidth < 768) {
    setCollapsed(true);
  } else if (window.innerWidth >= 1200) {
    setCollapsed(false);
  }
};

/**
 * Handle menu item click
 * @param key - Menu item key
 * @param onTabChange - Callback function when tab changes
 * @param isMobile - Is mobile view
 * @param onDrawerClose - Function to close drawer (mobile)
 * @param setCollapsed - Function to set collapse state
 */
export const handleSidebarMenuClick = (
  key: string,
  onTabChange?: (key: string) => void,
  isMobile?: boolean,
  onDrawerClose?: () => void,
  setCollapsed?: (collapsed: boolean) => void
) => {
  // Call tab change callback if provided
  if (onTabChange) {
    onTabChange(key);
  }
  
  // Close drawer on mobile when item is selected
  if (isMobile && onDrawerClose) {
    onDrawerClose();
  }
  
  // Auto-collapse menu on small screens after selection
  if (window.innerWidth < 768 && !isMobile && setCollapsed) {
    setCollapsed(true);
  }
};
