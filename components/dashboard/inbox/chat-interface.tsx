"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageItem } from "./message-item";
import { MessageInput } from "./message-input";
import { getChatMessages, Message, Chat } from "@/lib/api/messageApi";
import { useSocket } from "@/lib/stores/socketContext";
import { useAuthStore } from "@/lib/stores/auth";
import { ArrowLeft, MoreVertical, Phone, Video, Users } from "lucide-react";
import { CommunityParticipants } from "./community-participants";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/client";

interface ChatInterfaceProps {
  chat: Chat;
}

export function ChatInterface({ chat }: ChatInterfaceProps) {
  const router = useRouter();
  const { socket } = useSocket();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get other participant for individual chats
  const otherParticipant =
    chat.chatType === "individual"
      ? chat.participants.find((p) => p._id !== user?._id)
      : null;

  // Determine chat name
  const chatName =
    chat.chatType === "individual"
      ? otherParticipant?.name || "Unknown User"
      : chat.name || "Unnamed Chat";

  // Determine avatar
  const avatarSrc =
    chat.chatType === "individual" ? otherParticipant?.avatar : undefined;

  // Determine avatar fallback (initials)
  const avatarFallback =
    chat.chatType === "individual"
      ? otherParticipant?.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "U"
      : chat.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "C";

  // Determine online status for individual chats
  const isOnline = chat.chatType === "individual" && otherParticipant?.isOnline;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getChatMessages(chat._id, 1, 20);
        setMessages(response.messages.reverse());
        setHasMore(response.pagination.page < response.pagination.pages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chat._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Join community chat room
  useEffect(() => {
    if (!socket || chat.chatType !== "community") return;

    console.log(`Joining community: ${chat._id}`);
    socket.emit("join_community", chat._id);

    // Listen for join confirmation
    const handleJoinedCommunity = (data: { communityId: string }) => {
      console.log("Successfully joined community:", data.communityId);
    };

    socket.on("joined_community", handleJoinedCommunity);

    return () => {
      socket.off("joined_community", handleJoinedCommunity);
    };
  }, [socket, chat._id, chat.chatType]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      console.log("Received message:", message);
      if (message.chatId === chat._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleMessageSent = (message: Message) => {
      console.log("Message sent confirmation:", message);
      if (message.chatId === chat._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleSocketError = (error: any) => {
      console.error("Socket error:", error);
    };

    // Listen for individual messages
    socket.on("new_message", handleNewMessage);

    // Listen for community messages
    socket.on("new_community_message", handleNewMessage);

    // Listen for sent message confirmations
    socket.on("message_sent", handleMessageSent);

    // Listen for socket errors
    socket.on("error", handleSocketError);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("new_community_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("error", handleSocketError);
    };
  }, [socket, chat._id, chat.chatType]);

  // Mark messages as read
  useEffect(() => {
    if (!socket || !chat._id) return;

    socket.emit("mark_messages_read", { chatId: chat._id });
  }, [socket, chat._id, messages]);

  // Load more messages
  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const response = await getChatMessages(chat._id, nextPage, 20);

      // Save scroll position
      const container = messagesContainerRef.current;
      const scrollHeight = container?.scrollHeight || 0;

      // Add older messages to the beginning
      setMessages((prevMessages) => [
        ...response.messages.reverse(),
        ...prevMessages,
      ]);
      setPage(nextPage);
      setHasMore(response.pagination.page < response.pagination.pages);

      // Restore scroll position
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - scrollHeight;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading more messages:", error);
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!socket || !content.trim() || !user) return;

    // Simple approach - just send the message without optimistic UI updates
    return new Promise<void>((resolve, reject) => {
      const eventName = chat.chatType === "individual" ? "private_message" : "community_message";
      
      const messageData = chat.chatType === "individual"
        ? {
            recipientId: otherParticipant?._id,
            content,
            attachments: []
          }
        : {
            communityId: chat._id,
            content,
            attachments: []
          };

      // Send the message
      socket.emit(eventName, messageData);
      
      // The socket.io server doesn't use acknowledgements for these events
      // so we resolve immediately and rely on the message_sent event
      setTimeout(() => {
        console.log(`${chat.chatType} message sent`);
        resolve();
      }, 100);
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Avatar className="h-10 w-10 border border-amber-200">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className="bg-amber-100 text-amber-800">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            {chat.chatType === "individual" && isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>

          <div>
            <h3 className="font-medium">{chatName}</h3>
            {chat.chatType === "individual" ? (
              <p className="text-xs text-gray-500">
                {isOnline
                  ? t("chat.online")
                  : otherParticipant?.lastActive
                  ? `${t("chat.lastSeen")} ${new Date(
                      otherParticipant.lastActive
                    ).toLocaleString()}`
                  : t("chat.offline")}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                {chat.participants.length} {t("chat.participants")}
                {chat.topic && ` • ${chat.topic}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {chat.chatType === "individual" ? (
            <>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <CommunityParticipants chat={chat} />
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 bg-amber-50/30 relative">
        <div
          className="absolute inset-0 overflow-hidden"
        >
          <div
            ref={messagesContainerRef}
            className="h-full p-4 overflow-y-auto absolute inset-0 pr-[20px] mr-[-20px]"
          >
        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-amber-200 text-amber-600 hover:bg-amber-50"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mr-1" />
              ) : null}
              {t("messages.loadOlder")}
            </Button>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 ? (
          messages.map((message, index) => {
            // Check if this message is consecutive (same sender as previous)
            const isConsecutive =
              index > 0 &&
              messages[index - 1].sender._id === message.sender._id;

            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <MessageItem message={message} isConsecutive={isConsecutive} />
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            ) : (
              <>
                <div className="bg-amber-100 rounded-full p-4 mb-3">
                  {chat.chatType === "individual" ? (
                    <MessageItem
                      message={{
                        _id: "placeholder",
                        sender: {
                          _id: "system",
                          name: "System",
                        },
                        content: t("messages.beginningConversation", {
                          name: chatName,
                        }),
                        chatType: "individual",
                        chatId: chat._id,
                        read: true,
                        attachments: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }}
                    />
                  ) : (
                    <Users className="h-8 w-8 text-amber-500" />
                  )}
                </div>
                <p className="text-sm">
                  {chat.chatType === "individual"
                    ? `Start a conversation with ${chatName}`
                    : `Welcome to ${chatName}! Start the conversation.`}
                </p>
              </>
            )}
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message input */}
      <MessageInput
        chatId={chat._id}
        chatType={chat.chatType}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
