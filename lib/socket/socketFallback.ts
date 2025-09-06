import { io, Socket } from 'socket.io-client';

// Socket connection state tracking
let connectionAttempts = 0;
const MAX_WEBSOCKET_ATTEMPTS = 3;
let currentTransport: 'websocket' | 'polling' = 'polling';

/**
 * Creates a Socket.IO connection with automatic fallback from WebSocket to polling
 * This is especially important for Vercel deployments where WebSockets may be blocked
 */
export const createSocketConnection = (url: string, options: any): Socket => {
  // Start with polling for initial connection (more reliable on Vercel)
  const socket = io(url, {
    ...options,
    transports: [currentTransport],
  });

  // Track connection status
  let isConnected = false;
  let reconnectTimer: NodeJS.Timeout | null = null;

  // Connection event handlers
  socket.on('connect', () => {
    console.log(`Socket connected using ${currentTransport}`);
    isConnected = true;
    connectionAttempts = 0;
    
    // If we're connected with polling, try to upgrade to WebSocket
    if (currentTransport === 'polling') {
      tryWebSocketUpgrade(socket);
    }
  });

  socket.on('connect_error', (error) => {
    console.error(`Socket connection error (${currentTransport}):`, error.message);
    handleConnectionFailure(socket);
  });

  socket.io.on('reconnect_attempt', (attempt) => {
    console.log(`Socket reconnection attempt ${attempt} using ${currentTransport}`);
  });

  socket.io.on('reconnect_error', (error) => {
    console.error(`Socket reconnection error (${currentTransport}):`, error);
    handleConnectionFailure(socket);
  });

  socket.io.on('reconnect_failed', () => {
    console.error(`Socket reconnection failed using ${currentTransport}`);
    handleConnectionFailure(socket);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${reason}`);
    isConnected = false;
    
    // If the server closed the connection, try to reconnect
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  return socket;
};

/**
 * Try to upgrade from polling to WebSocket after successful connection
 */
const tryWebSocketUpgrade = (socket: Socket): void => {
  if (connectionAttempts < MAX_WEBSOCKET_ATTEMPTS) {
    console.log('Attempting to upgrade to WebSocket...');
    
    // Wait a bit before trying WebSocket
    setTimeout(() => {
      // Disconnect and reconnect with WebSocket
      socket.disconnect();
      
      // Update transport preference
      if (socket.io && socket.io.opts) {
        socket.io.opts.transports = ['websocket', 'polling'];
      }
      currentTransport = 'websocket';
      
      // Reconnect
      socket.connect();
      
      // Monitor if WebSocket connection succeeds
      const wsTimeout = setTimeout(() => {
        if (!socket.connected) {
          console.log('WebSocket upgrade failed, falling back to polling');
          socket.disconnect();
          if (socket.io && socket.io.opts) {
            socket.io.opts.transports = ['polling'];
          }
          currentTransport = 'polling';
          socket.connect();
        }
      }, 5000);
      
      socket.once('connect', () => {
        clearTimeout(wsTimeout);
        console.log('Successfully upgraded to WebSocket');
      });
    }, 1000);
    
    connectionAttempts++;
  }
};

/**
 * Handle connection failures by falling back to polling if needed
 */
const handleConnectionFailure = (socket: Socket): void => {
  connectionAttempts++;
  
  if (currentTransport === 'websocket' && connectionAttempts >= MAX_WEBSOCKET_ATTEMPTS) {
    console.log('Falling back to polling transport');
    if (socket.io && socket.io.opts) {
      socket.io.opts.transports = ['polling'];
    }
    currentTransport = 'polling';
    
    // Force reconnect with new transport
    if (!socket.connected) {
      socket.disconnect().connect();
    }
  }
};

/**
 * Create a socket connection with automatic retry
 */
export const createReliableSocketConnection = (url: string, options: any): Socket => {
  let socket = createSocketConnection(url, options);
  
  // Add global error handler
  window.addEventListener('online', () => {
    console.log('Network connection restored, reconnecting socket');
    if (!socket.connected) {
      socket.connect();
    }
  });
  
  return socket;
};
