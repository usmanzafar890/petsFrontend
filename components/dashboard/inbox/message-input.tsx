"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/lib/stores/socketContext";
import { Paperclip, Send, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n/client";

interface MessageInputProps {
  chatId: string;
  chatType: "individual" | "community";
  onSendMessage: (content: string) => Promise<void>;
}

export function MessageInput({ chatId, chatType, onSendMessage }: MessageInputProps) {
  const { socket } = useSocket();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || isSubmitting || !socket) return;
    
    const messageContent = message.trim();

    try {
      // Clear the message input immediately to give better UX feedback
      setMessage("");
      
      // Send the message
      await onSendMessage(messageContent);
      setIsSubmitting(false);
      // Focus back on textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Restore the message if sending failed
      setMessage(messageContent);
      
      toast({
        title: t("common.error"),
        description: error?.message || t("messages.sendError"),
        variant: "destructive",
      });
    } finally {
      // Make sure to reset the submitting state
      setIsSubmitting(false);
    }
  };
  
  // Handle typing indicators
  const handleTyping = () => {
    if (!socket || chatType !== 'individual') return;
    
    // Only emit typing events for individual chats
    socket.emit('typing', { recipientId: chatId, isTyping: message.trim().length > 0 });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-amber-100 bg-white p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder={t("messages.typeMessage")}
            className="min-h-[60px] max-h-[150px] pr-10 resize-none bg-amber-50 border-amber-200 focus:border-amber-300"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 h-6 w-6 text-amber-500 hover:text-amber-600 hover:bg-transparent"
            onClick={() => {/* TODO: Implement emoji picker */}}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 border-amber-200 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
            disabled={isSubmitting}
            onClick={() => {/* TODO: Implement file attachment */}}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            className="h-10 w-10 bg-amber-500 hover:bg-amber-600 text-white"
            disabled={!message.trim() || isSubmitting}
            onClick={handleSendMessage}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
