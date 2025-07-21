/**
 * UI styling utility functions and constants
 */

// Dark mode related styles
export const getDarkModeStyles = (isDarkMode: boolean) => {
  return {
    // Text color based on theme
    textColor: isDarkMode ? '#fff' : '#000',
    
    // Background colors
    primaryBackground: isDarkMode ? '#141414' : '#fff',
    secondaryBackground: isDarkMode ? '#1f1f1f' : '#f0f0f0',
    
    // Border colors
    borderColor: isDarkMode ? '#303030' : '#f0f0f0',
    
    // Button styles
    buttonBackground: isDarkMode ? '#1f1f1f' : '#fff',
    
    // Header styles
    headerBackground: isDarkMode ? '#1f1f1f' : '#fff',
    
    // Sider styles
    siderTheme: isDarkMode ? 'dark' as const : 'light' as const,
    
    // Drawer styles
    drawerStyles: {
      header: {
        background: isDarkMode ? '#1f1f1f' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
      },
      body: {
        background: isDarkMode ? '#141414' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        padding: 0
      }
    },
    
    // Toggle button styles
    toggleButtonStyle: {
      background: isDarkMode ? '#1f1f1f' : '#fff',
      color: isDarkMode ? '#fff' : undefined,
      border: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
    }
  };
};

// Get mobile menu trigger styles
export const getMobileMenuTriggerStyles = (isDarkMode: boolean) => {
  return {
    background: isDarkMode ? '#1f1f1f' : '#fff',
    color: isDarkMode ? '#fff' : undefined,
    border: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
    borderRadius: '4px',
    padding: '0 8px',
    margin: '8px 16px'
  };
};

// Get text button styles for mobile menus
export const getTextButtonStyles = (isDarkMode: boolean) => {
  return {
    color: isDarkMode ? '#fff' : undefined
  };
};
