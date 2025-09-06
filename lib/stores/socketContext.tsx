"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./auth";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!user || !token) return;

    // Dynamically determine the socket URL based on the current protocol
    const getSocketUrl = () => {
      // For production with HTTPS
      if (typeof window !== 'undefined') {
        // Use the same protocol as the current page
        const protocol = window.location.protocol === 'https:' ? 'https://' : 'http://';
        // Use environment variable if available, otherwise fallback to current domain
        if (process.env.NEXT_PUBLIC_API_URL_SOCKET) {
          // Remove any protocol prefix from the env variable
          const socketUrl = process.env.NEXT_PUBLIC_API_URL_SOCKET.replace(/^https?:\/\//, '');
          return `${protocol}${socketUrl}`;
        } else {
          // Fallback to current domain with default port
          return `${protocol}${window.location.hostname}:5000`;
        }
      }
      // Fallback for SSR
      return process.env.NEXT_PUBLIC_API_URL_SOCKET || "http://localhost:5000";
    };

    const SOCKET_URL = getSocketUrl();
    console.log('Connecting to socket at:', SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // Use same transport options as server
      transports: ['websocket', 'polling'],
      // Automatically try to reconnect if connection is lost
      reconnectionDelayMax: 10000,
      // Timeout for connection attempt
      timeout: 20000,
      // Force new connection (don't reuse old one)
      forceNew: true,
      // Ensure secure connection in production
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      // Reopen closed connection
      autoConnect: true,
      // Path for Socket.IO endpoint if you're using a proxy
      path: process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io',
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("user_status_change", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (isOnline) {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
