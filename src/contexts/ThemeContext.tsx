import React, { createContext, useState, useEffect, useCallback } from 'react';
import { type ThemeConfig } from 'antd';
import type { 
  ThemePreset, 
  ThemeOptions
} from '../constants/themeConstants';
import { 
  DEFAULT_THEME_OPTIONS, 
  getThemeConfig, 
  COLOR_PRESETS 
} from '../constants/themeConstants';

// Define the shape of our context
interface ThemeContextType {
  themeOptions: ThemeOptions;
  themeConfig: ThemeConfig;
  toggleThemeMode: () => void;
  setThemePreset: (preset: ThemePreset) => void;
  COLOR_PRESETS: typeof COLOR_PRESETS;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  themeOptions: DEFAULT_THEME_OPTIONS,
  themeConfig: getThemeConfig(DEFAULT_THEME_OPTIONS),
  toggleThemeMode: () => {},
  setThemePreset: () => {},
  COLOR_PRESETS
});

// Helper function to save theme settings to localStorage
const saveThemeSettings = (themeOptions: ThemeOptions) => {
  localStorage.setItem('themeOptions', JSON.stringify(themeOptions));
};

// Helper function to load theme settings from localStorage
const loadThemeSettings = (): ThemeOptions => {
  try {
    const savedTheme = localStorage.getItem('themeOptions');
    if (savedTheme) {
      return JSON.parse(savedTheme) as ThemeOptions;
    }
  } catch (error) {
    console.error('Error loading theme settings:', error);
  }
  return DEFAULT_THEME_OPTIONS;
};

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(loadThemeSettings);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getThemeConfig(themeOptions));
  // Update theme config when options change
  useEffect(() => {
    setThemeConfig(getThemeConfig(themeOptions));
    saveThemeSettings(themeOptions);
    
    // Apply theme mode to body for CSS targeting
    document.body.setAttribute('data-theme-mode', themeOptions.mode);
    document.body.setAttribute('data-theme-preset', themeOptions.preset);

    // Update CSS custom properties for dynamic theming
    const colors = COLOR_PRESETS[themeOptions.preset][themeOptions.mode];
    const root = document.documentElement;
    root.style.setProperty('--ant-color-primary', colors.colorPrimary);
    root.style.setProperty('--ant-color-success', colors.colorSuccess);
    root.style.setProperty('--ant-color-warning', colors.colorWarning);
    root.style.setProperty('--ant-color-error', colors.colorError);
    root.style.setProperty('--ant-color-info', colors.colorInfo);
  }, [themeOptions]);
  // Apply initial theme mode to body
  useEffect(() => {
    document.body.setAttribute('data-theme-mode', themeOptions.mode);
    document.body.setAttribute('data-theme-preset', themeOptions.preset);
  }, [themeOptions.mode, themeOptions.preset]);

  // Toggle between light and dark mode
  const toggleThemeMode = useCallback(() => {
    setThemeOptions(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }));
  }, []);

  // Set theme preset
  const setThemePreset = useCallback((preset: ThemePreset) => {
    setThemeOptions(prev => ({
      ...prev,
      preset
    }));
  }, []);

  const value = {
    themeOptions,
    themeConfig,
    toggleThemeMode,
    setThemePreset,
    COLOR_PRESETS
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Export the context (this will be imported in a separate hook file)
export default ThemeContext;
