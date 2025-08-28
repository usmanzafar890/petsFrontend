"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { InboxSidebar } from "@/components/dashboard/inbox/inbox-sidebar";
import { ChatInterface } from "@/components/dashboard/inbox/chat-interface";
import { getUserChats, Chat } from "@/lib/api/messageApi";
import { useSocket } from "@/lib/stores/socketContext";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { socket } = useSocket();
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get all chats and find the one matching the ID
        const chats = await getUserChats();
        const foundChat = chats.find(c => c._id === chatId);
        
        if (foundChat) {
          setChat(foundChat);
        } else {
          setError("Chat not found");
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching chat:", err);
        setError("Failed to load chat");
        setIsLoading(false);
      }
    };

    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  // Listen for chat updates
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleChatUpdate = (updatedChat: Chat) => {
      if (updatedChat._id === chatId) {
        setChat(updatedChat);
      }
    };

    socket.on("chat_updated", handleChatUpdate);

    return () => {
      socket.off("chat_updated", handleChatUpdate);
    };
  }, [socket, chatId]);

  return (
    <div className="flex h-full">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block w-80 h-full flex-shrink-0 border-r border-amber-100">
        <InboxSidebar />
      </div>
      
      {/* Chat interface */}
      <div className="flex-1 flex flex-col h-full">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        ) : chat ? (
          <ChatInterface chat={chat} />
        ) : null}
      </div>
    </div>
  );
}
