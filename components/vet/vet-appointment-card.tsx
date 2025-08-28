"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Stethoscope, MapPin, Phone, Edit, Trash2, Dog, Cat, MoreVertical, FileText, Bell, CheckCircle } from "lucide-react"
import type { VetAppointment, Pet } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface VetAppointmentCardProps {
  appointment: VetAppointment
  pet: Pet
  onEdit: () => void
  onDelete: () => void
  onComplete: () => void
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  scheduled: "outline",
  completed: "secondary",
  cancelled: "destructive",
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

export function VetAppointmentCard({ appointment, pet, onEdit, onDelete, onComplete }: VetAppointmentCardProps) {
  const isUpcoming = new Date(appointment.date) > new Date() && appointment.status === "scheduled"
  const isPastAndScheduled = new Date(appointment.date) <= new Date() && appointment.status === "scheduled"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className={`w-full flex flex-col transition-all ${isUpcoming ? "border-amber-300 bg-amber-50/50" : "border-amber-200"} shadow-sm hover:shadow-md`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-100/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-amber-200">
            {pet?.species?.toLowerCase() === "dog" ? (
              <Dog className="w-6 h-6 text-amber-600" />
            ) : (
              <Cat className="w-6 h-6 text-amber-600" />
            )}
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-amber-800">{appointment.title}</CardTitle>
            <p className="text-sm text-amber-600">For {pet?.name}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-amber-600 hover:text-amber-700 hover:bg-amber-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-amber-200">
            <DropdownMenuItem onClick={onEdit} className="hover:bg-amber-50 focus:bg-amber-50">
              <Edit className="w-4 h-4 mr-2 text-amber-600" />
              <span className="text-amber-800">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3 flex-grow bg-white">
        <InfoItem icon={Calendar} text={formatDateTime(new Date(appointment.date))} highlight={isUpcoming} />
        <InfoItem icon={Stethoscope} text={appointment.vetName} />
        <InfoItem icon={MapPin} text={appointment.location} />
        {appointment.notes && <InfoItem icon={FileText} text={appointment.notes} />}
        {appointment.reminder && appointment.reminderDetails && (
          <InfoItem 
            icon={Bell} 
            text={`Reminder: ${appointment.reminderDetails.value} ${appointment.reminderDetails.unit} before`} 
            highlight={true}
          />
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center bg-gradient-to-r from-white to-amber-50 border-t border-amber-100">
        <Badge 
          variant={statusVariant[appointment.status] || "outline"} 
          className={`capitalize ${appointment.status === 'scheduled' ? 'border-amber-400 text-amber-700 bg-amber-50' : appointment.status === 'completed' ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' : ''}`}
        >
          {appointment.status}
        </Badge>
        <div className="flex items-center gap-2">
          {isPastAndScheduled && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onComplete} 
              className="h-9 border-amber-400 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
          {appointment.phone && (
            <a
              href={`tel:${appointment.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-800 hover:underline"
            >
              <Phone className="w-4 h-4" />
              {appointment.phone}
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
    </motion.div>
  )
}

function InfoItem({ icon: Icon, text, highlight = false }: { icon: React.ElementType, text: string, highlight?: boolean }) {
  return (
    <motion.div 
      className={`flex items-start gap-3 p-1.5 rounded-md ${highlight ? 'bg-amber-50' : ''}`}
      whileHover={{ backgroundColor: 'rgb(254 243 199 / 0.5)' }}
    >
      <Icon className={`w-4 h-4 mt-1 ${highlight ? 'text-amber-600' : 'text-amber-500'} flex-shrink-0`} />
      <p className={`text-sm ${highlight ? 'text-amber-800 font-medium' : 'text-amber-700'} break-words`}>{text}</p>
    </motion.div>
  )
}
