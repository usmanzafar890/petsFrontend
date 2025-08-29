"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getPendingInvitations, acceptFamilyInvitation, declineFamilyInvitation } from "@/lib/api/family";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function ProfileInvitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Refresh the page to update the UI with new family status
      // This will ensure all components reflect the new family membership
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

  // If no invitations, show a message that there are no pending invitations
  const hasInvitations = invitations.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-amber-200 shadow-sm mb-8">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Family Invitations</CardTitle>
              </CardTitle>
              <CardDescription>
                {hasInvitations ? 'Accept or decline invitations to join family accounts' : 'No pending family invitations'}
              </CardDescription>
            </div>
            {invitations.length > 0 && (
              <Badge className="bg-red-500">{invitations.length}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin mr-2" />
              <span>Loading invitations...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {hasInvitations ? invitations.map((invitation) => (
                <div 
                  key={invitation.adminId} 
                  className="p-4 border border-amber-100 rounded-lg bg-amber-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-amber-800">
                      {invitation.adminName} has invited you to join their family account
                    </p>
                    <p className="text-sm text-gray-500">
                      {invitation.adminEmail}
                    </p>
                  </div>
                  <div className="flex gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleAcceptInvitation(invitation.adminId)}
                      disabled={isLoading}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeclineInvitation(invitation.adminId)}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center border border-amber-100 rounded-lg bg-amber-50">
                  <p className="text-amber-800">You don't have any pending family invitations</p>
                  <p className="text-sm text-gray-500 mt-1">When someone invites you to join their family, it will appear here</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
