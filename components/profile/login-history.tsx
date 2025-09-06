"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Trash2, Shield, AlertTriangle, Monitor, Smartphone, Laptop, Info, MapPin, RefreshCw } from "lucide-react";
import { getLoginHistory, clearLoginHistory } from "@/lib/api/users";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginHistoryItem {
  _id: string;
  ipAddress: string;
  userAgent: string;
  deviceInfo: string;
  location: string;
  status: 'success' | 'failed';
  failureReason: string | null;
  createdAt: string;
}

export function LoginHistory() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const fetchLoginHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getLoginHistory();
      setLoginHistory(response.data || []);
    } catch (error: any) {
      toast({
        title: "Failed to fetch login history",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      await clearLoginHistory();
      setLoginHistory([]);
      toast({
        title: "Login history cleared",
        description: "Your login history has been successfully cleared.",
        variant: "default",
      });
      setShowClearDialog(false);
    } catch (error: any) {
      toast({
        title: "Failed to clear login history",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const getDeviceIcon = (deviceInfo: string) => {
    switch (deviceInfo.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Laptop className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <Card className="border-amber-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-amber-800">Login History</CardTitle>
                <CardDescription>Recent account access activity</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLoginHistory}
                disabled={isLoading}
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                disabled={isLoading || isClearing || loginHistory.length === 0}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-3" />
                <p className="text-amber-800">Loading login history...</p>
              </div>
            </div>
          ) : loginHistory.length === 0 ? (
            <div className="flex items-center justify-center py-12 px-4">
              <div className="text-center">
                <Info className="h-10 w-10 text-amber-400 mx-auto mb-3 opacity-70" />
                <p className="text-amber-800 font-medium mb-1">No login history available</p>
                <p className="text-amber-600 text-sm">Your login activity will appear here</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-amber-100">
              <AnimatePresence>
                {loginHistory.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 ${
                      item.status === 'failed' ? 'bg-red-50/50' : 'hover:bg-amber-50/50'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-1.5 rounded-full ${
                          item.status === 'success' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {item.status === 'success' ? (
                            <Shield className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.status === 'success' ? 'Successful login' : 'Failed login attempt'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              {getDeviceIcon(item.deviceInfo)}
                              <span>{item.deviceInfo}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>IP: {item.ipAddress}</span>
                            </div>
                          </div>
                          {item.failureReason && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-1.5 rounded border border-red-100">
                              {item.failureReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-t border-amber-100 py-3 px-4">
          <p className="text-xs text-amber-700">
            For security, we track all login attempts to your account.
          </p>
        </CardFooter>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Login History</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your login history records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleClearHistory();
              }}
              disabled={isClearing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isClearing ? "Clearing..." : "Clear History"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
