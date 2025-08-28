"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PawPrint, Calendar, HeartPulse, Bell, Dog, Cat, Rabbit } from "lucide-react"
import { motion } from "framer-motion"
import type { Pet, Schedule, VetAppointment, HealthRecord } from "@/lib/types"

interface StatCardsProps {
  pets: Pet[];
  schedules: Schedule[];
  appointments: VetAppointment[];
  healthRecords: HealthRecord[];
}

export function StatCards({ pets, schedules, appointments, healthRecords }: StatCardsProps) {
  const upcomingAppointmentsCount = appointments?.filter(
    (a) => new Date(a.date) > new Date() && a.status === "scheduled"
  )?.length

  const todaySchedulesCount = schedules?.filter((s) => {
    if (!s.isActive) return false
    if (s.frequency === "daily") return true
    if (s.frequency === "weekly") {
      const today = new Date().getDay()
      return s.days?.includes(today) || false
    }
    return false
  }).length

  const healthAlertsCount = healthRecords?.filter(
    (r) => r.nextDueDate && new Date(r.nextDueDate) < new Date()
  ).length

  const stats = [
    {
      title: "Total Pets",
      value: pets.length,
      icon: PawPrint,
      color: "text-orange-500",
      gradient: "from-orange-400 to-amber-300",
      description: "Furry family members",
      animalIcon: Dog
    },
    {
      title: "Upcoming Visits",
      value: upcomingAppointmentsCount,
      icon: Calendar,
      color: "text-blue-500",
      gradient: "from-blue-400 to-cyan-300",
      description: "Scheduled vet appointments",
      animalIcon: Cat
    },
    {
      title: "Today's Care",
      value: todaySchedulesCount,
      icon: HeartPulse,
      color: "text-rose-500",
      gradient: "from-rose-400 to-pink-300",
      description: "Daily care activities",
      animalIcon: Rabbit
    },
    {
      title: "Health Alerts",
      value: healthAlertsCount,
      icon: Bell,
      color: "text-red-500",
      gradient: "from-red-400 to-orange-300",
      description: "Items needing attention",
      animalIcon: PawPrint
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats?.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`}></div>
            <CardContent className="p-5 relative">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                <stat.animalIcon className="w-32 h-32" />
              </div>
              
              {/* Icon with gradient background */}
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 blur-sm`}></div>
                  <div className="relative bg-white rounded-full p-2.5">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>
              
              {/* Value with animation */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10, 
                  delay: index * 0.1 + 0.3 
                }}
              >
                <p className={`text-3xl font-bold pb-1 mb-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
