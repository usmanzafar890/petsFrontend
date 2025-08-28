"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/dashboard/inbox/inbox-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOrCreateIndividualChat, getAllUsers } from "@/lib/api/messageApi";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Search } from "lucide-react";

interface User {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
}

export default function NewMessagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Fetch users from API using our new function
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Start individual chat
  const handleStartChat = async (userId: string) => {
    try {
      setIsLoading(true);
      const chat = await getOrCreateIndividualChat(userId);
      
      if (!chat || !chat._id) {
        throw new Error("Invalid chat response");
      }
      
      router.push(`/dashboard/messages/${chat._id}`);
    } catch (error: any) {
      console.error("Error starting chat:", error);
      
      // Show a more specific error message if available
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to start conversation. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block w-80 h-full flex-shrink-0 border-r border-amber-100">
        <InboxSidebar />
      </div>
      
      {/* New message content */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center p-3 border-b border-amber-100">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-amber-800">New Message</h2>
        </div>
        
        {/* Direct message content */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-9 bg-amber-50 border-amber-200 focus:border-amber-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-amber-50"
                  onClick={() => handleStartChat(user._id)}
                >
                  <Avatar className="h-10 w-10 border border-amber-200">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-amber-100 text-amber-800">
                      {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-800">{user.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <MessageSquare className="h-8 w-8 mb-2 text-amber-400" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
