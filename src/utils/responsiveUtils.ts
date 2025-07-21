/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

/**
 * Breakpoint values for responsive design
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};

/**
 * Hook to get current window dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return windowSize;
};

/**
 * Hook to get current responsive state based on Ant Design breakpoints
 */
export const useResponsive = () => {
  const screens = useBreakpoint();
  
  return {
    /**
     * Current breakpoint values (xs, sm, md, lg, xl, xxl)
     */
    screens,
    
    /**
     * Is current screen mobile size
     */
    isMobile: !screens.lg,
    
    /**
     * Is current screen tablet size
     */
    isTablet: screens.md && !screens.lg,
    
    /**
     * Is current screen desktop size
     */
    isDesktop: !!screens.lg,
    
    /**
     * Is current screen extra large
     */
    isLargeDesktop: !!screens.xl
  };
};

/**
 * Get responsive column spans for grid layouts
 * @param defaultSpan - Default column span
 * @param options - Custom spans for different breakpoints
 */
export const getResponsiveColumnSpans = (
  defaultSpan: number = 24,
  options?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  }
) => {
  return {
    xs: options?.xs || defaultSpan,
    sm: options?.sm || options?.xs || defaultSpan,
    md: options?.md || options?.sm || options?.xs || defaultSpan,
    lg: options?.lg || options?.md || options?.sm || options?.xs || defaultSpan,
    xl: options?.xl || options?.lg || options?.md || options?.sm || options?.xs || defaultSpan,
    xxl: options?.xxl || options?.xl || options?.lg || options?.md || options?.sm || options?.xs || defaultSpan
  };
};

/**
 * Generate responsive styles for an element
 * @param styleGenerator - Function that generates styles based on breakpoint
 */
export const responsiveStyles = <T extends object>(
  styleGenerator: (breakpoint: keyof typeof BREAKPOINTS | 'default') => T
): T & { [key: string]: any } => {
  const baseStyles = styleGenerator('default');
  const mediaQueries = {} as Record<string, any>;
  
  Object.entries(BREAKPOINTS).forEach(([breakpoint, value]) => {
    const breakpointStyles = styleGenerator(breakpoint as keyof typeof BREAKPOINTS);
    
    if (Object.keys(breakpointStyles).length > 0) {
      mediaQueries[`@media (min-width: ${value}px)`] = breakpointStyles;
    }
  });
  
  return {
    ...baseStyles,
    ...mediaQueries
  };
};
