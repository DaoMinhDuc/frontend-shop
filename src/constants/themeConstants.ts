import type { ThemeConfig } from 'antd';

export type ThemeMode = 'light' | 'dark';
export type ThemePreset = 'default' | 'blue' | 'green' | 'purple';

export interface ThemeColorConfig {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBgBase?: string;
  colorTextBase?: string;
}

export interface ThemeOptions {
  mode: ThemeMode;
  preset: ThemePreset;
}

// Color preset configurations
export const COLOR_PRESETS: Record<ThemePreset, Record<ThemeMode, ThemeColorConfig>> = {
  default: {
    light: {
      colorPrimary: '#1677ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1677ff'
    },
    dark: {
      colorPrimary: '#1668dc',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#dc4446',
      colorInfo: '#1668dc',
      colorBgBase: '#141414',
      colorTextBase: 'rgba(255, 255, 255, 0.85)'
    }
  },
  blue: {
    light: {
      colorPrimary: '#1890ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1890ff'
    },
    dark: {
      colorPrimary: '#177ddc',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#dc4446',
      colorInfo: '#177ddc',
      colorBgBase: '#141414',
      colorTextBase: 'rgba(255, 255, 255, 0.85)'
    }
  },
  green: {
    light: {
      colorPrimary: '#52c41a',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1677ff'
    },
    dark: {
      colorPrimary: '#49aa19',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#dc4446',
      colorInfo: '#1668dc',
      colorBgBase: '#141414',
      colorTextBase: 'rgba(255, 255, 255, 0.85)'
    }
  },
  purple: {
    light: {
      colorPrimary: '#722ed1',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1677ff'
    },
    dark: {
      colorPrimary: '#642ab5',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#dc4446',
      colorInfo: '#1668dc',
      colorBgBase: '#141414',
      colorTextBase: 'rgba(255, 255, 255, 0.85)'
    }
  }
};

// Default theme options
export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  mode: 'light',
  preset: 'default'
};

// Function to get Ant Design theme config based on theme options
export const getThemeConfig = (options: ThemeOptions): ThemeConfig => {
  const { mode, preset } = options;
  const presetColors = COLOR_PRESETS[preset][mode];

  const config: ThemeConfig = {
    token: {
      ...presetColors,
      fontSize: 14,
      borderRadius: 4,
    },
    components: {
      Button: {
        colorPrimary: presetColors.colorPrimary,
        algorithm: true,
        controlHeight: 32,
        controlOutline: 'none',
        controlTmpOutline: 'none',
        controlOutlineWidth: 0,
        defaultBg: 'transparent',
        defaultShadow: 'none',
        primaryShadow: 'none',
      },
      Menu: {
        colorPrimary: presetColors.colorPrimary,
        algorithm: true,
      },
      Table: {
        colorPrimary: presetColors.colorPrimary,
        algorithm: true,
        headerBg: mode === 'dark' ? '#1f1f1f' : '#fafafa',
        headerColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
        rowHoverBg: mode === 'dark' ? '#262626' : '#f5f5f5',
        colorBgContainer: mode === 'dark' ? '#141414' : '#ffffff',
        colorBorder: mode === 'dark' ? '#303030' : '#f0f0f0',
        colorText: mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
      },
      Input: {
        colorPrimary: presetColors.colorPrimary,
        algorithm: true,
        colorBorder: mode === 'dark' ? '#434343' : '#d9d9d9',
        colorBgContainer: mode === 'dark' ? '#1f1f1f' : '#ffffff',
        colorText: mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
        colorTextPlaceholder: mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.25)',
        activeBorderColor: presetColors.colorPrimary,
        hoverBorderColor: presetColors.colorPrimary,
      },
      Select: {
        colorPrimary: presetColors.colorPrimary,
        algorithm: true,
        colorBorder: mode === 'dark' ? '#434343' : '#d9d9d9',
        colorBgContainer: mode === 'dark' ? '#1f1f1f' : '#ffffff',
        colorText: mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
        optionSelectedBg: mode === 'dark' ? '#262626' : '#f0f0f0',
        optionActiveBg: mode === 'dark' ? '#1f1f1f' : '#f5f5f5',
      },
      Form: {
        labelColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
        itemMarginBottom: 16,
      }
    }
  };

  return config;
};
