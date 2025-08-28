"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, Stethoscope, PawPrint, Filter } from "lucide-react"
import { motion } from "framer-motion"
import type { VetAppointment, Pet, AppointmentData } from "@/lib/types"
import { useAppointmentStore } from "@/lib/stores/appointments"
import { usePetStore } from "@/lib/stores/pets"
import { VetAppointmentForm } from "../vet/vet-appointment-form"
import { VetAppointmentCard } from "../vet/vet-appointment-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatCard } from "../shared/stat-card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function VetDashboard({ onBack }: { onBack: () => void }) {
  const { appointments, fetchAppointments, addAppointment, editAppointment, removeAppointment } = useAppointmentStore()
  const { pets, fetchPets } = usePetStore()
  const [showForm, setShowForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<VetAppointment | null>(null)
  const [selectedPet, setSelectedPet] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [notifiedAppointments, setNotifiedAppointments] = useState<string[]>([])

  useEffect(() => {
    fetchAppointments()
    fetchPets()
  }, [fetchAppointments, fetchPets])

  const upcomingAppointments = appointments?.filter((a) => new Date(a.date) > new Date() && a.status === "scheduled")

  useEffect(() => {
    if (!upcomingAppointments) return

    const now = new Date()

    upcomingAppointments.forEach((appointment) => {
      if (appointment.reminder && appointment.reminderDetails && !notifiedAppointments.includes(appointment._id)) {
        const appointmentDate = new Date(appointment.date)
        let reminderTime = new Date(appointmentDate)

        const { value, unit } = appointment.reminderDetails

        if (unit === 'hours') {
          reminderTime.setHours(reminderTime.getHours() - value)
        } else if (unit === 'days') {
          reminderTime.setDate(reminderTime.getDate() - value)
        } else if (unit === 'weeks') {
          reminderTime.setDate(reminderTime.getDate() - (value * 7))
        }

        if (now >= reminderTime && now < appointmentDate) {
          const pet = pets.find((p) => p._id === appointment.petId)
          alert(
            `Reminder: Your appointment "${appointment.title}" for ${pet?.name} is coming up soon!`
          )
          setNotifiedAppointments((prev) => [...prev, appointment._id])
        }
      }
    })
  }, [appointments, pets, notifiedAppointments, upcomingAppointments])

  const handleSaveAppointment = async (data: AppointmentData) => {
    if (selectedAppointment) {
      await editAppointment(selectedAppointment._id, data)
    } else {
      await addAppointment(data)
    }
    setShowForm(false)
    setSelectedAppointment(null)
  }

  const handleDeleteAppointment = async (id: string) => {
    await removeAppointment(id)
  }

  const handleCompleteAppointment = async (appointment: VetAppointment) => {
    const { _id, user, createdAt, ...appointmentData } = appointment;
    await editAppointment(_id, { ...appointmentData, status: 'completed' });
  };

  const filteredAppointments = appointments?.filter((appointment) => {
    const petMatch = selectedPet === "all" || appointment.petId === selectedPet
    const statusMatch = statusFilter === "all" || appointment.status === statusFilter
    return petMatch && statusMatch
  })

  const completedAppointments = appointments?.filter((a) => a.status === "completed")
  const cancelledAppointments = appointments?.filter((a) => a.status === "cancelled")

  if (showForm) {
    return (
      <VetAppointmentForm
        pets={pets}
        appointment={selectedAppointment || undefined}
        onSave={handleSaveAppointment}
        onCancel={() => {
          setShowForm(false)
          setSelectedAppointment(null)
        }}
      />
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div 
        className="flex flex-col space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-xl">
              <Stethoscope className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">Vet Appointments</h1>
              <p className="text-muted-foreground">Book and track veterinary appointments for your pets.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <StatCard 
          icon={Calendar} 
          title="Total Appointments" 
          value={appointments?.length || 0} 
        />
        <StatCard 
          icon={Clock} 
          title="Upcoming" 
          value={upcomingAppointments?.length || 0} 
        />
        <StatCard 
          icon={CheckCircle} 
          title="Completed" 
          value={completedAppointments?.length || 0} 
        />
        <StatCard 
          icon={XCircle} 
          title="Cancelled" 
          value={cancelledAppointments?.length || 0} 
          variant="destructive" 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-amber-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <CardTitle className="text-lg font-bold text-amber-800">Manage Appointments</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 bg-amber-50/30 pt-6">
            <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PawPrint className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Filter by Pet</span>
                  </div>
                  <Select value={selectedPet} onValueChange={setSelectedPet}>
                    <SelectTrigger className="w-full md:w-[200px] border-amber-200 focus:ring-amber-500">
                      <SelectValue placeholder="Filter by pet..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pets</SelectItem>
                      {pets?.map((pet) => (
                        <SelectItem key={pet._id} value={pet._id}>
                          {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Filter className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Filter by Status</span>
                  </div>
                  <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    <ToggleGroup
                      type="single"
                      value={statusFilter}
                      onValueChange={(value) => value && setStatusFilter(value)}
                      className="w-full justify-start flex-wrap gap-2"
                    >
                      <ToggleGroupItem 
                        value="all"
                        className="data-[state=on]:bg-amber-500 data-[state=on]:text-white hover:bg-amber-100 hover:text-amber-800 px-3 py-1"
                      >
                        All
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="scheduled"
                        className="data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-blue-100 hover:text-blue-800 px-3 py-1"
                      >
                        Scheduled
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="completed"
                        className="data-[state=on]:bg-green-500 data-[state=on]:text-white hover:bg-green-100 hover:text-green-800 px-3 py-1"
                      >
                        Completed
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="cancelled"
                        className="data-[state=on]:bg-red-500 data-[state=on]:text-white hover:bg-red-100 hover:text-red-800 px-3 py-1"
                      >
                        Cancelled
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </div>
            </div>

          {filteredAppointments?.length === 0 ? (
            <motion.div 
              className="py-12 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mb-4 shadow-inner">
                <PawPrint className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800">No appointments found</h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">
                Try adjusting your filters or book a new appointment to get started.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredAppointments
                ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                ?.map((appointment, index) => {
                  const pet = pets.find((p) => p._id === appointment.petId)
                  if (!pet) return null
                  return (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <VetAppointmentCard
                        appointment={appointment}
                        pet={pet}
                        onEdit={() => {
                          setSelectedAppointment(appointment)
                          setShowForm(true)
                        }}
                        onDelete={() => handleDeleteAppointment(appointment._id)}
                        onComplete={() => handleCompleteAppointment(appointment)}
                      />
                    </motion.div>
                  )
                })}
            </motion.div>
          )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}
