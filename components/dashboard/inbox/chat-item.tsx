"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chat } from "@/lib/api/messageApi";
import { useAuthStore } from "@/lib/stores/auth";
import { MessageSquare, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // For individual chats, get the other participant
  const otherParticipant = chat.chatType === "individual"
    ? chat.participants.find(p => p._id !== user?._id)
    : null;
  
  // Determine chat name
  const chatName = chat.chatType === "individual" 
    ? otherParticipant?.name || t("messages.unknownUser")
    : chat.name || t("messages.unnamedChat");
  
  // Determine avatar
  const avatarSrc = chat.chatType === "individual"
    ? otherParticipant?.avatar
    : undefined;
  
  // Determine avatar fallback (initials)
  const avatarFallback = chat.chatType === "individual"
    ? otherParticipant?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"
    : chat.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "C";
  
  // Determine online status for individual chats
  const isOnline = chat.chatType === "individual" && otherParticipant?.isOnline;
  
  // Format last message time
  const lastMessageTime = chat.lastMessage?.createdAt 
    ? formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })
    : "";
  
  // Truncate last message content
  const lastMessageContent = chat.lastMessage?.content
    ? chat.lastMessage.content.length > 30
      ? chat.lastMessage.content.substring(0, 30) + "..."
      : chat.lastMessage.content
    : chat.chatType === "individual"
      ? t("messages.startConversation")
      : t("messages.joinDiscussion");

  return (
    <div 
      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? "bg-amber-100 hover:bg-amber-200" 
          : "hover:bg-amber-50"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border border-amber-200">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className="bg-amber-100 text-amber-800">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        
        {chat.chatType === "individual" ? (
          isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" title={t("messages.online")} />
          )
        ) : (
          <div className="absolute -bottom-1 -right-1 bg-amber-100 rounded-full p-0.5 border border-amber-200">
            <Users size={12} className="text-amber-600" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-800 truncate">{chatName}</h4>
          <span className="text-xs text-gray-500">{lastMessageTime}</span>
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-gray-500 truncate">{lastMessageContent}</p>
          
          {chat.unreadCount && chat.unreadCount > 0 && (
            <Badge className="ml-1 bg-amber-500 hover:bg-amber-600">
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
