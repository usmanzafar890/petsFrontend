"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatItem } from "./chat-item";
import { getUserChats, getCommunityChats, Chat } from "@/lib/api/messageApi";
import { useSocket } from "@/lib/stores/socketContext";
import { MessageSquare, Users, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/client";


export function InboxSidebar() {
  const router = useRouter();
  const { socket } = useSocket();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const userChats = await getUserChats();
        setChats(userChats);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Filter chats based on search query and active tab
  useEffect(() => {
    let filtered = chats;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((chat) => {
        // For individual chats, search in participant names
        if (chat.chatType === "individual") {
          return chat.participants.some((p) => 
            p.name.toLowerCase().includes(query)
          );
        }
        // For community chats, search in name and description
        return (
          (chat.name?.toLowerCase().includes(query)) ||
          (chat.description?.toLowerCase().includes(query))
        );
      });
    }

    // Filter by tab
    if (activeTab === "individual") {
      filtered = filtered.filter((chat) => chat.chatType === "individual");
    } else if (activeTab === "community") {
      filtered = filtered.filter((chat) => chat.chatType === "community");
    }

    // Sort by last message time (newest first)
    filtered = [...filtered].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    setFilteredChats(filtered);
  }, [chats, searchQuery, activeTab]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              lastMessage: message,
              unreadCount: chat.unreadCount ? chat.unreadCount + 1 : 1,
            };
          }
          return chat;
        });
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("new_community_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("new_community_message", handleNewMessage);
    };
  }, [socket]);

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId);
    router.push(`/dashboard/messages/${chatId}`);
  };

  const handleNewChat = () => {
    router.push("/dashboard/messages/new");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-amber-100">
      <div className="p-4 border-b border-amber-100">
        <h2 className="text-lg font-semibold text-amber-800 mb-3">{t("messages.title")}</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("messages.searchMessages")}
            className="pl-9 bg-amber-50 border-amber-200 focus:border-amber-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full bg-amber-50">
            <TabsTrigger value="all" className="flex-1">
              {t("messages.all")}
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              {t("messages.direct")}
            </TabsTrigger>
            <TabsTrigger value="community" className="flex-1">
              <Users className="h-4 w-4 mr-1" />
              {t("messages.groups")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="all"
          className="flex-1 overflow-y-auto p-2 space-y-1 mt-0"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatItem
                  chat={chat}
                  isActive={activeChat === chat._id}
                  onClick={() => handleChatClick(chat._id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <MessageSquare className="h-8 w-8 mb-2 text-amber-400" />
              <p className="text-sm">{t("messages.noMessages")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="individual"
          className="flex-1 overflow-y-auto p-2 space-y-1 mt-0"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatItem
                  chat={chat}
                  isActive={activeChat === chat._id}
                  onClick={() => handleChatClick(chat._id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <MessageSquare className="h-8 w-8 mb-2 text-amber-400" />
              <p className="text-sm">{t("messages.noDirectMessages")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="community"
          className="flex-1 overflow-y-auto p-2 space-y-1 mt-0"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatItem
                  chat={chat}
                  isActive={activeChat === chat._id}
                  onClick={() => handleChatClick(chat._id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Users className="h-8 w-8 mb-2 text-amber-400" />
              <p className="text-sm">{t("messages.noCommunityChats")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="p-3 border-t border-amber-100">
        <Button
          onClick={handleNewChat}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("messages.newMessage")}
        </Button>
      </div>
    </div>
  );
}
