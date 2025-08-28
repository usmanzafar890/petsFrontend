"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, ArrowRight, Calendar } from "lucide-react"
import type { VetAppointment, Pet } from "@/lib/types"

interface UpcomingAppointmentsProps {
  appointments: VetAppointment[];
  pets: Pet[];
}

export function UpcomingAppointments({ appointments, pets }: UpcomingAppointmentsProps) {
  const router = useRouter()

  const upcoming = appointments
    ?.filter((a) => new Date(a.date) > new Date() && a.status === "scheduled")
    ?.slice(0, 2)

  if (upcoming?.length === 0) {
    return null
  }

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p._id === petId)
    return pet ? pet.name : "Unknown Pet"
  }

  const formatDateTime = (date: Date) => {
    const appointmentDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const timeStr = appointmentDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    if (appointmentDate.toDateString() === today.toDateString()) {
      return `Today at ${timeStr}`
    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${timeStr}`
    } else {
      return `${appointmentDate.toLocaleDateString()} at ${timeStr}`
    }
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          Upcoming Vet Visits
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/appointments")}
        >
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {upcoming?.map((appointment) => (
          <Card
            key={appointment._id}
            className="bg-card/50 backdrop-blur-sm border-border/20 hover:shadow-lg hover:border-border/50 transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Stethoscope className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-foreground">{appointment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {getPetName(appointment.petId)} • {appointment.vetName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-blue-600">
                  {formatDateTime(appointment.date)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/dashboard/appointments')}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      }
      </div>
    </div>
  )
}
