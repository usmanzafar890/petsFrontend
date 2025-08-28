"use client";

import { useState, useEffect } from "react";
import { InboxSidebar } from "@/components/dashboard/inbox/inbox-sidebar";
import { getUserChats } from "@/lib/api/messageApi";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Preload chats data
    const preloadChats = async () => {
      try {
        await getUserChats();
        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading chats:", error);
        setIsLoading(false);
      }
    };
    
    preloadChats();
  }, []);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-full md:w-80 h-full flex-shrink-0 border-r border-amber-100">
        <InboxSidebar />
      </div>
      
      {/* Empty state */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-amber-50/30">
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto bg-amber-100 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-4">
            <MessageSquare className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Select a conversation</h2>
          <p className="text-gray-600">
            Choose a conversation from the sidebar or start a new one to begin messaging
          </p>
        </div>
      </div>
    </div>
  );
}
