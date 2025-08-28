"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users } from "lucide-react";
import { Chat } from "@/lib/api/messageApi";
import { useTranslation } from "@/lib/i18n/client";

interface CommunityParticipantsProps {
  chat: Chat;
}

export function CommunityParticipants({ chat }: CommunityParticipantsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Only show for community chats
  if (chat.chatType !== "community") {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Users className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {chat.participants.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t("community.participants")}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {chat.participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-amber-50"
            >
              <Avatar className="h-10 w-10 border border-amber-200">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="bg-amber-100 text-amber-800">
                  {participant.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{participant.name}</p>
                <div className="flex items-center gap-1">
                  {participant.isOnline ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-500">
                        {t("chat.online")}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {t("chat.offline")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
