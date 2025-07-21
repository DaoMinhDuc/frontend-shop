import React, { createContext, useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { SOCKET_URL } from '../config';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
  reconnect: () => {}
});


interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const initializeSocket = useCallback(() => {
    // Clear any existing reconnect timer
    clearReconnectTimer();
    
    // Close existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (!user) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    try {
      // Get token from session storage
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError(new Error('No authentication token found'));
        return;
      }

      console.log('Initializing socket connection with token');
      
      // Initialize socket with auth
      const socketInstance = io(SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current = socketInstance;
      setSocket(socketInstance);

      // Socket event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
        
        // Setup heartbeat to keep connection alive
        const heartbeatInterval = setInterval(() => {
          if (socketInstance.connected) {
            socketInstance.emit('heartbeat');
          } else {
            clearInterval(heartbeatInterval);
          }
        }, 30000); // Send heartbeat every 30 seconds
        
        // Listen for heartbeat response
        socketInstance.on('heartbeat_response', () => {
          console.log('Heartbeat response received');
        });
        
        // Clean up interval on disconnect
        socketInstance.on('disconnect', () => {
          clearInterval(heartbeatInterval);
        });
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        
        // If this is an unexpected disconnect, try to reconnect
        if (reason === 'io server disconnect' || reason === 'io client disconnect') {
          // Don't auto-reconnect, this was intentional
        } else {
          // Auto reconnect with exponential backoff
          const delay = Math.min(1000 * (2 ** reconnectAttempts.current), 30000);
          if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
            console.log(`Attempting to reconnect in ${delay/1000} seconds...`);
            reconnectTimerRef.current = setTimeout(() => {
              reconnectAttempts.current += 1;
              initializeSocket();
            }, delay);
          }
        }
      });

      socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError(err);
        setIsConnected(false);
      });

      socketInstance.on('error', (err) => {
        console.error('Socket error:', err);
        setError(new Error(err));
      });

    } catch (err) {
      console.error('Error initializing socket:', err);
      setError(err as Error);
    }
  }, [user]);

  // Initialize socket when user changes
  useEffect(() => {
    initializeSocket();
    
    return () => {
      clearReconnectTimer();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initializeSocket]);

  // Reconnect function
  const reconnect = () => {
    reconnectAttempts.current = 0; // Reset reconnect attempts
    initializeSocket();
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, error, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
