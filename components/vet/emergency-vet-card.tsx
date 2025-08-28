"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Star, Navigation, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import type { EmergencyVet } from "@/lib/types"

interface EmergencyVetCardProps {
  vet: EmergencyVet
  onCall: () => void
  onGetDirections: () => void
}

export function EmergencyVetCard({ vet, onCall, onGetDirections }: EmergencyVetCardProps) {
  const formatDistance = (distance: number | string) => {
    const numericDistance = typeof distance === 'string' ? parseFloat(distance) : distance;
    if (numericDistance < 1) {
      return `${(numericDistance * 1000).toFixed(0)} m`;
    }
    return `${numericDistance.toFixed(1)} km`;
  };

  const getOpenStatus = () => {
    if (vet.isOpen24Hours) {
      return { text: "Open 24/7", color: "bg-amber-100 text-amber-800" }
    } else if (vet.currentlyOpen) {
      return { text: "Open Now", color: "bg-amber-100 text-amber-800" }
    } else {
      const openTime = vet.opensAt ? vet.opensAt : "Unknown"
      return { text: `Opens at ${openTime}`, color: "bg-orange-100 text-orange-800" }
    }
  }

  const openStatus = getOpenStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
    <Card
      className={`bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow ${
        vet.currentlyOpen ? "ring-2 ring-amber-300" : "ring-2 ring-orange-300"
      }`}
    >
      <div className={`h-1 w-full bg-gradient-to-r from-amber-300 to-orange-300`}></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-amber-800 mb-1">{vet.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={openStatus.color}>
                {openStatus.text}
              </Badge>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {vet.distance && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 font-semibold border-amber-200">
                {formatDistance(vet.distance)} away
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-amber-700">{vet.rating}</span>
            </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-700">{vet.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">{vet.phone}</span>
          </div>

          {vet.services.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-amber-700 flex items-center gap-1">
                <PawPrint className="w-3 h-3" />
                Services:
              </span>
              <div className="flex flex-wrap gap-1">
                {vet.services.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-amber-200 text-amber-700">
                    {service}
                  </Badge>
                ))}
                {vet.services.length > 3 && (
                  <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
                    +{vet.services.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-3">
            <Button
              onClick={onCall}
              className={`flex-1 ${
                vet.currentlyOpen
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-orange-400 hover:bg-orange-500 text-white"
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <Button variant="outline" onClick={onGetDirections} className="flex-1 bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50">
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
