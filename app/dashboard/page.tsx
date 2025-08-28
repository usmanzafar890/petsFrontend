"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { usePetStore } from "@/lib/stores/pets"
import { useScheduleStore } from "@/lib/stores/schedules"
import { useAppointmentStore } from "@/lib/stores/appointments"
import { useHealthRecordStore } from "@/lib/stores/health"
import { PetCard } from "@/components/pet/pet-card"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { WelcomeEmptyState } from '@/components/dashboard/welcome-empty-state'
import { StatCards } from '@/components/dashboard/stat-cards'
import { EmergencyCard } from '@/components/dashboard/emergency-card'
import { HealthAlerts } from '@/components/dashboard/health-alerts'
import { UpcomingAppointments } from '@/components/dashboard/upcoming-appointments'
import { TodaysSchedules } from '@/components/dashboard/todays-schedules'
import { PawPrint, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Pet } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const { pets, isLoading, fetchPets, removePet } = usePetStore()
  const { schedules, fetchSchedules } = useScheduleStore()
  const { appointments, fetchAppointments } = useAppointmentStore()
  const { healthRecords, fetchHealthRecords } = useHealthRecordStore()

  useEffect(() => {
    fetchPets()
    fetchSchedules()
    fetchAppointments()
    fetchHealthRecords()
  }, [fetchPets, fetchSchedules, fetchAppointments, fetchHealthRecords])

  const handleDeletePet = async (id: string) => {
    // Added confirmation dialog for safety
    if (window.confirm("Are you sure you want to permanently delete this pet and all its data?")) {
      try {
        await removePet(id);
      } catch (error) {
        console.error("Failed to delete pet:", error);
        // Optionally, show a toast notification for the error
      }
    }
  };

  if (isLoading && pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-300 to-amber-200 opacity-50 blur-md animate-pulse"></div>
            <div className="relative bg-white rounded-full p-4">
              <PawPrint className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 animate-pulse mt-4 font-medium">Loading your pet dashboard...</p>
        </div>
      </div>
    )
  }

  if (pets.length === 0) {
    return <WelcomeEmptyState />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Decorative elements */}

      
      <div className="p-4 md:p-6 pt-16 md:pt-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 opacity-75 blur-sm"></div>
                  <div className="relative bg-white rounded-full p-2">
                    <PawPrint className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Pet Dashboard
                </h1>
              </div>
              <p className="text-gray-500 mt-1 ml-1">Manage your pet family's health and care</p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/add-pet')} 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Pet
            </Button>
          </div>
          
          <div className="space-y-8">
            {/* Stat cards with animation */}
            <div className="animate-in fade-in-50 duration-500">
              <StatCards pets={pets} schedules={schedules} appointments={appointments} healthRecords={healthRecords} />
            </div>

            {/* Emergency card with animation */}
            <div className="animate-in fade-in-50 duration-500" style={{ animationDelay: '100ms' }}>
              <EmergencyCard />
            </div>

            {/* Health alerts with animation */}
            <div className="animate-in fade-in-50 duration-500" style={{ animationDelay: '200ms' }}>
              <HealthAlerts healthRecords={healthRecords} pets={pets} />
            </div>

            {/* Upcoming appointments with animation */}
            <div className="animate-in fade-in-50 duration-500" style={{ animationDelay: '300ms' }}>
              <UpcomingAppointments appointments={appointments} pets={pets} />
            </div>

            {/* Today's schedules with animation */}
            <div className="animate-in fade-in-50 duration-500" style={{ animationDelay: '400ms' }}>
              <TodaysSchedules schedules={schedules} pets={pets} />
            </div>

            {/* Pet family section with enhanced styling */}
            <div className="animate-in fade-in-50 duration-500" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Pet Family</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-300 rounded-full"></div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pets?.map((pet: Pet, index: number) => (
                  <div
                    key={pet._id}
                    className="animate-in fade-in-50 duration-500 transform hover:scale-[1.02] transition-all"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <PetCard
                      pet={pet}
                      onEdit={() => router.push(`/dashboard/edit-pet/${pet._id}`)}
                      onDelete={() => handleDeletePet(pet._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
