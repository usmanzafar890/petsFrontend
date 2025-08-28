"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PawPrint, Heart, Home, AlertTriangle } from "lucide-react"

export function WelcomeEmptyState() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
          <PawPrint className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
          Welcome to Your Pet Family Hub!
          <Home className="w-7 h-7 text-muted-foreground" />
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Start by adding your first furry family member to track their health, schedule loving care, and never miss important appointments. All data is stored safely on your device.
          <Heart className="w-4 h-4 inline-block ml-1 text-red-500" />
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push("/dashboard/add-pet")}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <PawPrint className="w-5 h-5 mr-2" />
            Add Your First Pet
          </Button>
          <Button
            onClick={() => router.push("/dashboard/emergency")}
            size="lg"
            variant="outline"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Help
          </Button>
        </div>
      </div>
    </div>
  )
}
