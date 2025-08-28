"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Phone, Clock, Loader2, PawPrint } from "lucide-react"
import type { EmergencyVet, UserLocation } from "@/lib/types"
import { findNearbyVets } from "@/lib/api/emergency";
import { EmergencyVetCard } from "../vet/emergency-vet-card"
import { StatCard } from "../shared/stat-card"
import { motion } from "framer-motion"

export function EmergencyDashboard({ onBack }: { onBack: () => void }) {
  const [vets, setVets] = useState<EmergencyVet[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [userAddress, setUserAddress] = useState<string | null>(null)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setUserLocation(location)
        setLocationPermission("granted")
        loadNearbyVets(location.latitude, location.longitude)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setLocationPermission("denied")
        setError("Unable to get your location. Using default area.")
        const defaultLocation = { latitude: 34.0522, longitude: -118.2437 }
        setUserLocation(defaultLocation)
        loadNearbyVets(defaultLocation.latitude, defaultLocation.longitude)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const loadNearbyVets = async (lat: number, lon: number) => {
    try {
      const { userAddress, vets } = await findNearbyVets(lat, lon);
      setUserAddress(userAddress);
      setVets(vets);
    } catch (err: any) {
      console.error("Error loading vets:", err);
      setError(err.response?.data?.message || "Unable to load emergency vets");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  const openVets = vets.filter((v) => v.currentlyOpen)
  const closedVets = vets.filter((v) => !v.currentlyOpen)

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-amber-50/50 to-orange-50/30 min-h-screen rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-700 flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-amber-600" />
            Emergency Vet Locator
          </h1>
          <p className="text-amber-600">Find nearest emergency veterinary clinics.</p>
        </div>
        <Button onClick={getCurrentLocation} variant="outline" disabled={loading} className="border-amber-300 hover:bg-amber-100 text-amber-700 hover:text-amber-800">
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2" />
          )}
          Refresh Location
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">
                {locationPermission === "granted"
                  ? "Using your current location"
                  : "Using default location (LA Area)"}
              </p>
              {userAddress ? (
                <p className="text-sm text-amber-600">{userAddress}</p>
              ) : userLocation && (
                <p className="text-sm text-amber-600">
                  Locating...
                </p>
              )}
            </div>
          </div>
          {locationPermission === "denied" && <Badge variant="outline" className="border-amber-300 text-amber-700">Location Denied</Badge>}
        </CardContent>
      </Card>

      {error && (
        <div className="border-l-4 border-amber-400 bg-amber-100/50 p-4 rounded-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="font-medium text-amber-700">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-amber-600 mx-auto mb-4 animate-spin" />
          <p className="text-amber-700 font-medium">Finding emergency vets near you...</p>
        </div>
      ) : (
        <>
          {vets?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Nearby Clinics" value={vets?.length || 0} icon={MapPin} />
              <StatCard title="Open Now" value={openVets?.length || 0} icon={Clock} />
              <StatCard
                title="24/7 Available"
                value={openVets.filter((v) => v.isOpen24Hours).length}
                icon={Phone}
                variant="destructive"
              />
              <StatCard
                title="Within 5 miles"
                value={vets.filter((v) => v.distance && v.distance < 5).length}
                icon={AlertTriangle}
              />
            </div>
          )}

          {openVets?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-amber-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Open Now ({openVets?.length || 0})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {openVets?.map((vet) => (
                  <EmergencyVetCard
                    key={vet.id}
                    vet={vet}
                    onCall={() => handleCall(vet.phone)}
                    onGetDirections={() => handleGetDirections(vet.address)}
                  />
                ))}
              </div>
            </section>
          )}

          {closedVets.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-amber-700 flex items-center gap-2">
                Currently Closed ({closedVets.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {closedVets.map((vet) => (
                  <EmergencyVetCard
                    key={vet.id}
                    vet={vet}
                    onCall={() => handleCall(vet.phone)}
                    onGetDirections={() => handleGetDirections(vet.address)}
                  />
                ))}
              </div>
            </section>
          )}

          {vets.length === 0 && !error && (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-amber-100 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-amber-700 font-medium">No emergency vets found.</p>
                <p className="text-sm text-amber-600">Try refreshing your location.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
      </motion.div>
    </div>
  )
}
