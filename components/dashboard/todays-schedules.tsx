"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Pill, Footprints, Dumbbell, ArrowRight, Clock } from "lucide-react"
import type { Schedule, Pet } from "@/lib/types"

interface TodaysSchedulesProps {
  schedules: Schedule[];
  pets: Pet[];
}

const typeIcons = {
  meal: Utensils,
  medicine: Pill,
  walk: Footprints,
  exercise: Dumbbell,
}

export function TodaysSchedules({ schedules, pets }: TodaysSchedulesProps) {
  const router = useRouter()

  const todaySchedules = schedules
    ?.sort((a, b) => a.time.localeCompare(b.time))
    ?.filter((s) => {
      if (!s.isActive) return false
      if (s.frequency === "daily") return true
      if (s.frequency === "weekly") {
        const today = new Date().getDay()
        return s.days?.includes(today) || false
      }
      return false
    })
    ?.slice(0, 3)

  if (todaySchedules?.length === 0) {
    return null
  }

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p._id === petId)
    return pet ? pet.name : "Unknown Pet"
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" />
          Today's Schedule
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/schedules")}
        >
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todaySchedules?.map((schedule) => {
          const Icon = typeIcons[schedule.type] || Utensils
          return (
            <Card
              key={schedule._id}
              className="bg-card/50 backdrop-blur-sm border-border/20 hover:shadow-lg hover:border-border/50 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{schedule.title}</p>
                    <p className="text-sm text-muted-foreground">{getPetName(schedule.petId)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-primary">{formatTime(schedule.time)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    Mark Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
