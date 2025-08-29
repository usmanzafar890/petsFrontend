"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getPendingInvitations, acceptFamilyInvitation, declineFamilyInvitation } from "@/lib/api/family";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function InvitationNotification() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch pending invitations
  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingInvitations();
      // Backend returns the invitations array directly, not wrapped in an object
      setInvitations(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept invitation
  const handleAcceptInvitation = async (adminId: string) => {
    try {
      setIsLoading(true);
      await acceptFamilyInvitation(adminId);
      
      // Remove the accepted invitation from the list
      setInvitations(invitations.filter(inv => inv.adminId !== adminId));
      
      toast({
        title: "Invitation accepted!",
        description: "You are now a family member",
      });
      
      // Close the dropdown
      setIsOpen(false);
      
      // Refresh the page to update the UI with new family status
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Decline invitation
  const handleDeclineInvitation = async (adminId: string) => {
    try {
      setIsLoading(true);
      await declineFamilyInvitation(adminId);
      
      // Remove the declined invitation from the list
      setInvitations(invitations.filter(inv => inv.adminId !== adminId));
      
      toast({
        title: "Invitation declined",
        description: "The invitation has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to decline invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch invitations on component mount
  useEffect(() => {
    fetchInvitations();
  }, []);

  // Track if there are any invitations
  const hasInvitations = invitations.length > 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-amber-600" />
        {hasInvitations && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {invitations.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="p-3 shadow-lg border-amber-200">
              <h3 className="font-medium text-amber-800 mb-2">Family Invitations</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {hasInvitations ? invitations.map((invitation) => (
                  <div 
                    key={invitation.adminId} 
                    className="p-3 border border-amber-100 rounded-lg bg-amber-50"
                  >
                    <p className="text-sm font-medium text-amber-800">
                      {invitation.adminName} has invited you
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {invitation.adminEmail}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white w-full"
                        onClick={() => handleAcceptInvitation(invitation.adminId)}
                        disabled={isLoading}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 w-full"
                        onClick={() => handleDeclineInvitation(invitation.adminId)}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="p-3 text-center border border-amber-100 rounded-lg bg-amber-50">
                    <p className="text-sm text-amber-800">No pending invitations</p>
                    <p className="text-xs text-gray-500 mt-1">When someone invites you, it will appear here</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
