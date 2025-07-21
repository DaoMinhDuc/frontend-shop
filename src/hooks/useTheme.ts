import { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export default useTheme;
