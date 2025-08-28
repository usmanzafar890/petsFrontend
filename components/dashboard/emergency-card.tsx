"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Siren, Phone, MapPin, PawPrint } from "lucide-react"
import { motion } from "framer-motion"

export function EmergencyCard() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative">
        {/* Red gradient border at top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-red-400"></div>
        
        {/* Background paw prints */}
        <div className="absolute top-0 right-0 opacity-5 transform rotate-12">
          <PawPrint className="w-40 h-40" />
        </div>
        
        <CardContent className="p-6 bg-gradient-to-br from-red-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <motion.div 
                className="relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10 
                }}
              >
                <div className="absolute -inset-2 rounded-full bg-red-500 opacity-20 blur-md animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center shadow-md">
                  <Siren className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-1">Emergency Pet Help</h3>
                <p className="text-red-600/80 mb-3">
                  Quick access to emergency care for your pet when every minute counts.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>24/7 Vet Hotline</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Nearby Emergency Clinics</span>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => router.push("/dashboard/emergency")}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 h-auto"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="font-bold">Get Emergency Help</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
