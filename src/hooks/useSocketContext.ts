import { useContext } from 'react';
import SocketContext from '../contexts/SocketContext';

/**
 * Custom hook to access the socket connection
 * Provides access to socket instance, connection status, errors and reconnect function
 * @returns SocketContextType object with socket, isConnected, error, and reconnect
 */
export const useSocketContext = () => useContext(SocketContext);

export default useSocketContext;
