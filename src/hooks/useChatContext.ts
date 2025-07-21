import { useContext } from 'react';
import ChatContext from '../contexts/ChatContext';

// Export the hook for easier usage of the context
export const useChatContext = () => useContext(ChatContext);

export default useChatContext;
