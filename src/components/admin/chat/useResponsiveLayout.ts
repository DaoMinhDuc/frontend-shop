// useResponsiveLayout.ts
import { useState, useEffect } from 'react';

export const useResponsiveLayout = () => {
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Effect for handling responsive behavior 
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        // Mobile layout
        setIsMobile(true);
        setShowInfoPanel(false);
        setShowSidebar(false);
      } else if (width < 1024) {
        // Tablet layout
        setIsMobile(false);
        setShowInfoPanel(false);
        setShowSidebar(true);
      } else if (width < 1280) {
        // Small desktop layout - hide info panel
        setIsMobile(false);
        setShowInfoPanel(false);
        setShowSidebar(true);
      } else {
        // Large desktop layout - show everything
        setIsMobile(false);
        setShowInfoPanel(true);
        setShowSidebar(true);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel);
  };

  return {
    showInfoPanel,
    setShowInfoPanel,
    showSidebar,
    setShowSidebar,
    isMobile,
    toggleSidebar,
    toggleInfoPanel
  };
};
