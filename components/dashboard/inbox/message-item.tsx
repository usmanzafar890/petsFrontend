"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/lib/api/messageApi";
import { useAuthStore } from "@/lib/stores/auth";
import { Check, CheckCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";

interface MessageItemProps {
  message: Message;
  isConsecutive?: boolean;
}

export function MessageItem({ message, isConsecutive = false }: MessageItemProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const isCurrentUser = message.sender._id === user?._id;
  
  // Format message time
  const messageTime = formatDistanceToNow(new Date(message.createdAt), { 
    addSuffix: true,
    includeSeconds: true
  });
  
  // Get avatar fallback (initials)
  const avatarFallback = message.sender.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] items-end gap-2`}>
        {/* Avatar - only show if not consecutive messages from same sender */}
        {!isConsecutive && !isCurrentUser && (
          <Avatar className="h-8 w-8 border border-amber-200 flex-shrink-0">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        )}
        
        {/* Message bubble */}
        <div className={`flex flex-col ${isConsecutive && !isCurrentUser ? 'ml-10' : ''}`}>
          {/* Sender name - only show if not consecutive */}
          {!isConsecutive && !isCurrentUser && (
            <span className="text-xs text-gray-500 mb-1 ml-1">
              {message.sender.name}
            </span>
          )}
          
          {/* Message content */}
          <div 
            className={`py-2 px-3 rounded-lg ${
              isCurrentUser 
                ? 'bg-amber-500 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          {/* Message metadata */}
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}>
            <span>{messageTime}</span>
            
            {/* Read status for current user's messages */}
            {isCurrentUser && (
              <span className="ml-1">
                {message.read ? (
                  <CheckCheck className="h-3 w-3 text-amber-500" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
