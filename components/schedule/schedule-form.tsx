"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CalendarClock, Clock, PawPrint, Repeat, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { Schedule, Pet, ScheduleData } from "@/lib/types"

interface ScheduleFormProps {
  pets: Pet[]
  schedule?: Schedule
  onSave: (schedule: ScheduleData) => void
  onCancel: () => void
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export function ScheduleForm({ pets, schedule, onSave, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    priority: schedule?.priority || ("medium" as const),
    petId: schedule?.petId || pets[0]?._id || "",
    type: schedule?.type || ("meal" as const),
    title: schedule?.title || "",
    description: schedule?.description || "",
    dateTime: schedule?.dateTime ? new Date(schedule.dateTime).toISOString().substring(0, 16) : new Date().toISOString().substring(0, 16),
    frequency: schedule?.frequency || ("once" as const),
    days: schedule?.days || [],
    isActive: schedule?.isActive ?? true,
    completed: schedule?.completed || false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      days: checked ? [...prev.days, day].sort() : prev.days.filter(d => d !== day),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petId) {
      // This can be replaced with a more user-friendly toast notification
      alert("Please select a pet.");
      return;
    }
    onSave(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-sm">
              <CalendarClock className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-amber-800">
              {schedule ? "Edit Schedule" : "Create New Schedule"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 bg-gradient-to-br from-amber-50/30 to-orange-50/20 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="petId" className="flex items-center gap-2 text-amber-800">
                <PawPrint className="w-4 h-4 text-amber-600" />
                Pet
              </Label>
              <Select name="petId" value={formData.petId} onValueChange={(value) => handleSelectChange('petId', value)}>
                <SelectTrigger id="petId" className="w-full border-amber-200 focus:ring-amber-500 focus:border-amber-500 bg-white">
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet._id} value={pet._id}>{pet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2 text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                Activity Type
              </Label>
              <Select name="type" value={formData.type} onValueChange={(value: 'meal' | 'medicine' | 'walk' | 'exercise' | 'Medicine appointment' | 'Pet Care' | 'Pet day care') => handleSelectChange('type', value)}>
                <SelectTrigger id="type" className="w-full border-amber-200 focus:ring-amber-500 focus:border-amber-500 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meal">Meal</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="walk">Walk</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="Medicine appointment">Medicine appointment</SelectItem>
                  <SelectItem value="Pet Care">Pet Care</SelectItem>
                  <SelectItem value="Pet day care">Pet day care</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Title
              </Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="e.g., Morning Meal" 
                required 
                className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTime" className="flex items-center gap-2 text-amber-800">
                <CalendarClock className="w-4 h-4 text-amber-600" />
                Date and Time
              </Label>
              <Input 
                id="dateTime" 
                name="dateTime" 
                type="datetime-local" 
                value={formData.dateTime} 
                onChange={handleInputChange} 
                required 
                className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-amber-800">
              <PawPrint className="w-4 h-4 text-amber-600" />
              Description
            </Label>
            <Input 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Optional notes (e.g., 1 cup of kibble)" 
              className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="flex items-center gap-2 text-amber-800">
              <Repeat className="w-4 h-4 text-amber-600" />
              Frequency
            </Label>
            <Select name="frequency" value={formData.frequency} onValueChange={(value: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly') => handleSelectChange('frequency', value)}>
              <SelectTrigger id="frequency" className="w-full border-amber-200 focus:ring-amber-500 focus:border-amber-500 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.frequency === "weekly" && (
            <div className="space-y-3 pt-2 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 shadow-sm">
              <Label className="flex items-center gap-2 text-amber-800 font-medium">
                <CalendarClock className="w-4 h-4 text-amber-600" />
                Days of the Week
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2 bg-white p-2 rounded-md border border-amber-200 shadow-sm hover:border-amber-300 transition-colors">
                    <Checkbox 
                      id={`day-${day.value}`} 
                      checked={formData.days.includes(day.value)} 
                      onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                      className="text-amber-600 border-amber-300 focus:ring-amber-500"
                    />
                    <Label htmlFor={`day-${day.value}`} className="text-sm font-medium text-amber-700">{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-lg border border-amber-200 shadow-sm">
            <Checkbox 
              id="isActive" 
              checked={formData.isActive} 
              onCheckedChange={(checked) => handleCheckboxChange('isActive', checked as boolean)}
              className="text-amber-600 border-amber-300 focus:ring-amber-500"
            />
            <Label htmlFor="isActive" className="text-amber-800 font-medium">Set as active</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Priority
            </Label>
            <Select name="priority" value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => handleSelectChange('priority', value)}>
              <SelectTrigger id="priority" className="w-full border-amber-200 focus:ring-amber-500 focus:border-amber-500 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 p-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-amber-300 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 text-amber-800 transition-colors"
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              type="submit" 
              disabled={!formData.petId}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
            >
              {schedule ? "Update Schedule" : "Save Schedule"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.form>
  )
}
