"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Clock, Check, Utensils, Pill, Footprints, Dumbbell, PawPrint } from "lucide-react"
import type { Schedule, Pet } from "@/lib/types"
import { motion } from "framer-motion"

interface ScheduleCardProps {
  schedule: Schedule
  pet: Pet
  onEdit: () => void
  onDelete: () => void
  onComplete: () => void
}

const TYPE_ICONS: { [key: string]: React.ElementType } = {
  meal: Utensils,
  medicine: Pill,
  walk: Footprints,
  exercise: Dumbbell,
};

const TYPE_COLORS: { [key: string]: { bg: string, text: string, border: string, gradient: string, bgOpacity: string, borderOpacity: string } } = {
  meal: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    gradient: "from-amber-100 to-amber-50",
    bgOpacity: "bg-amber-50/30",
    borderOpacity: "border-amber-200/50"
  },
  medicine: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    gradient: "from-orange-100 to-orange-50",
    bgOpacity: "bg-orange-50/30",
    borderOpacity: "border-orange-200/50"
  },
  walk: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-300",
    gradient: "from-amber-200 to-amber-50",
    bgOpacity: "bg-amber-50/30",
    borderOpacity: "border-amber-300/50"
  },
  exercise: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-300",
    gradient: "from-orange-200 to-orange-50",
    bgOpacity: "bg-orange-50/30",
    borderOpacity: "border-orange-300/50"
  },
};

export function ScheduleCard({ schedule, pet, onEdit, onDelete, onComplete }: ScheduleCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this schedule?`)) {
      onDelete();
    }
  };

  const formatTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return "00:00 AM";
    }
  };

  const getFrequencyText = () => {
    if (schedule.frequency === "daily") return "Daily";
    if (schedule.frequency === "weekly") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return schedule.days?.map((d) => dayNames[d]).join(", ") || "Weekly";
    }
    return "Monthly";
  };

  const Icon = TYPE_ICONS[schedule.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`overflow-hidden border-amber-200 shadow-md ${schedule.completed ? "opacity-70" : ""}`}>
        <div className={`h-1 w-full bg-gradient-to-r from-amber-300 to-orange-300`}></div>
        <CardContent className="p-4 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${TYPE_COLORS[schedule.type].bg} border ${TYPE_COLORS[schedule.type].border}`}>
                <Icon className={`w-6 h-6 ${TYPE_COLORS[schedule.type].text}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${TYPE_COLORS[schedule.type].text}`}>{schedule.title}</h3>
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <PawPrint className="w-3 h-3" />
                  <span>{pet.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600">
                  <Edit className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 bg-opacity-50 p-2 rounded-md">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{formatTime(schedule.dateTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="capitalize py-1 px-2 text-xs border-dashed border-amber-300 text-amber-700"
            >
              {getFrequencyText()}
            </Badge>
            <Badge 
              variant={schedule.isActive ? "default" : "secondary"} 
              className={`capitalize ${schedule.isActive ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white" : ""}`}
            >
              {schedule.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {schedule.description && (
            <div className="text-sm text-amber-700 bg-amber-50/30 p-3 rounded-md border border-amber-200/50">
              {schedule.description}
            </div>
          )}
        </div>

        <motion.div 
          className="mt-4" 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="sm"
            className={`w-full ${schedule.completed ? "bg-gray-50" : "hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white border-amber-200"}`}
            onClick={onComplete}
            disabled={schedule.completed}
          >
            <Check className="w-4 h-4 mr-2" />
            {schedule.completed ? "Completed" : "Mark as Completed"}
          </Button>
        </motion.div>
        
        <div className="absolute bottom-0 right-0 opacity-10 text-amber-300">
          <Icon className="w-24 h-24" />
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
