"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage && isOnline) return null

  return (
    <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
      <Card
        className={`transition-all duration-300 ${
          isOnline
            ? "bg-green-50 border-green-200 animate-in slide-in-from-top-2"
            : "bg-orange-50 border-orange-200 animate-in slide-in-from-top-2"
        }`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {isOnline ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-orange-600" />}
            <div>
              <p className={`font-medium text-sm ${isOnline ? "text-green-700" : "text-orange-700"}`}>
                {isOnline ? "Back Online" : "Offline Mode"}
              </p>
              <p className={`text-xs ${isOnline ? "text-green-600" : "text-orange-600"}`}>
                {isOnline
                  ? "All features are now available"
                  : "Your data is saved locally and will sync when reconnected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
