"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Calendar, Clock, AlertTriangle, Plus, ArrowLeft } from "lucide-react"
import type { Pet } from "@/lib/types"
import { PetProfileForm } from "../pet/pet-profile-form"
import { PetCard } from "../pet/pet-card"
import { usePetStore } from "@/lib/stores/pets"
import { useScheduleStore } from "@/lib/stores/schedules"
import { useAppointmentStore } from "@/lib/stores/appointments"
import { useHealthRecordStore } from "@/lib/stores/health"

export function PetDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const { pets, fetchPets, removePet } = usePetStore()
  const { schedules, fetchSchedules } = useScheduleStore()
  const { appointments, fetchAppointments } = useAppointmentStore()
  const { healthRecords, fetchHealthRecords } = useHealthRecordStore()

  useEffect(() => {
    fetchPets()
    fetchSchedules()
    fetchAppointments()
    fetchHealthRecords()
  }, [fetchPets, fetchSchedules, fetchAppointments, fetchHealthRecords])

  const todaySchedules = schedules.filter((schedule) => {
    const today = new Date().toDateString()
    return new Date(schedule.createdAt).toDateString() === today || schedule.frequency === "daily"
  })

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "scheduled" && new Date(apt.date) > new Date())
    .slice(0, 3)

  const overdueVaccinations = healthRecords.filter((record) => {
    if (record.type !== 'vaccine' || !record.nextDueDate) return false
    return new Date(record.nextDueDate) < new Date()
  })

  if (activeView === "add-pet" || (activeView === "edit-pet" && editingPet)) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setActiveView("dashboard")
              setEditingPet(null)
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {activeView === "edit-pet" ? "Edit Pet Profile" : "Add New Pet"}
          </h1>
        </div>
        <PetProfileForm
          pet={editingPet ?? undefined}
          onSuccess={() => {
            fetchPets()
            setEditingPet(null)
            setActiveView("dashboard")
          }}
          onCancel={() => {
            setEditingPet(null)
            setActiveView("dashboard")
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pets" value={pets.length} icon={Heart} />
        <StatCard title="Today's Tasks" value={todaySchedules.length} icon={Clock} />
        <StatCard title="Upcoming" value={upcomingAppointments.length} icon={Calendar} />
        <StatCard title="Health Alerts" value={overdueVaccinations.length} icon={AlertTriangle} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">My Pets</CardTitle>
            <Button size="sm" onClick={() => setActiveView("add-pet")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pet
            </Button>
          </CardHeader>
          <CardContent>
            {pets.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-muted rounded-full mb-4">
                  <Heart className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No pets added yet.</p>
                <p className="text-sm text-muted-foreground mb-4">Add your first pet to get started!</p>
                <Button onClick={() => setActiveView("add-pet")}>Add Pet</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pets.slice(0, 3).map((pet) => (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    onEdit={() => {
                      setEditingPet(pet)
                      setActiveView("edit-pet")
                    }}
                    onDelete={() => removePet(pet._id)}
                  />
                ))}
                {pets.length > 3 && (
                  <Button variant="outline" className="w-full">
                    View All Pets ({pets.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todaySchedules.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-muted rounded-full mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No tasks for today.</p>
                <p className="text-sm text-muted-foreground">Enjoy the quiet day!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedules.map((schedule) => (
                  <div key={schedule._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.title}</p>
                      <p className="text-sm text-muted-foreground">{pets.find((p) => p._id === schedule.petId)?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: number | string; icon: React.ElementType; variant?: "destructive" }) {
  const isDestructive = variant === "destructive" && typeof value === "number" && value > 0
  return (
    <Card className={isDestructive ? "bg-destructive/10 border-destructive/20" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${isDestructive ? "text-destructive" : "text-muted-foreground"}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${isDestructive ? "text-destructive" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isDestructive ? "text-destructive" : "text-foreground"}`}>{value}</div>
      </CardContent>
    </Card>
  )
}
