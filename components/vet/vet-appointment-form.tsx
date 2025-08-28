"use client"

import { useState, useEffect } from "react"
import type { VetAppointment, Pet, AppointmentData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, Stethoscope, MapPin, Phone, FileText, Bell, PawPrint, User, Building, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"

interface VetAppointmentFormProps {
  pets: Pet[]
  appointment?: VetAppointment
  onSave: (data: AppointmentData) => void
  onCancel: () => void
}

export function VetAppointmentForm({ pets, appointment, onSave, onCancel }: VetAppointmentFormProps) {
  const [formData, setFormData] = useState<Omit<AppointmentData, 'date'> & { date: string, reminder: boolean, reminderDetails: { value: number, unit: 'hours' | 'days' | 'weeks' } }>({
    petId: "",
    title: "",
    vetName: "",
    location: "",
    address: "",
    phone: "",
    date: new Date().toISOString().slice(0, 16),
    notes: "",
    status: "scheduled",
    reminder: false,
    reminderDetails: {
      value: 1,
      unit: 'days',
    }
  })

  useEffect(() => {
    if (appointment) {
      setFormData({
        petId: appointment.petId,
        title: appointment.title,
        vetName: appointment.vetName,
        location: appointment.location,
        address: appointment.address,
        phone: appointment.phone || "",
        date: new Date(appointment.date).toISOString().slice(0, 16),
        notes: appointment.notes || "",
        status: appointment.status,
        reminder: appointment.reminder || false,
        reminderDetails: appointment.reminderDetails || { value: 1, unit: 'days' }
      })
    }
  }, [appointment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReminderDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      reminderDetails: {
        ...prev.reminderDetails,
        [name]: name === 'value' ? parseInt(value, 10) : value,
      },
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petId) {
      alert("Please select a pet.");
      return;
    }
    const dataToSave: AppointmentData = {
      ...formData,
      date: formData.date,
    };

    if (!formData.reminder) {
      delete dataToSave.reminderDetails;
    }

    onSave(dataToSave);
  };

  // Do not render the form until the formData is populated with the appointment details
  if (appointment && !formData.petId) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="max-w-8xl mx-auto">
        <Card className="border-amber-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCancel}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                    {appointment ? "Edit Appointment" : "Book New Appointment"}
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8 bg-amber-50/30">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <PawPrint className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="petId" className="font-medium text-amber-800">Pet</Label>
                </div>
                <Select
                  name="petId"
                  value={formData.petId}
                  onValueChange={(value) => handleSelectChange("petId", value)}
                  required
                >
                  <SelectTrigger id="petId" className="w-full border-amber-200 focus:ring-amber-500">
                    <SelectValue placeholder="Select a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet._id} value={pet._id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="title" className="font-medium text-amber-800">Appointment Type</Label>
                </div>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual Check-up"
                  required
                  className="border-amber-200 focus:ring-amber-500"
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2 bg-white p-4 rounded-lg border border-amber-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-amber-600" />
                <Label htmlFor="date" className="font-medium text-amber-800">Date & Time</Label>
              </div>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
                className="border-amber-200 focus:ring-amber-500"
              />
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="vetName" className="font-medium text-amber-800">Veterinarian Name</Label>
                </div>
                <Input
                  id="vetName"
                  name="vetName"
                  value={formData.vetName}
                  onChange={handleChange}
                  placeholder="Dr. Smith"
                  required
                  className="border-amber-200 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="location" className="font-medium text-amber-800">Clinic/Hospital Name</Label>
                </div>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Sunshine Pet Clinic"
                  required
                  className="border-amber-200 focus:ring-amber-500"
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2 bg-white p-4 rounded-lg border border-amber-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-amber-600" />
                <Label htmlFor="address" className="font-medium text-amber-800">Address</Label>
              </div>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Pet Lane"
                required
                className="border-amber-200 focus:ring-amber-500"
              />
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="phone" className="font-medium text-amber-800">Phone Number</Label>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="border-amber-200 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="status" className="font-medium text-amber-800">Status</Label>
                </div>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status" className="w-full border-amber-200 focus:ring-amber-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled" className="text-blue-600 font-medium">Scheduled</SelectItem>
                    <SelectItem value="completed" className="text-green-600 font-medium">Completed</SelectItem>
                    <SelectItem value="cancelled" className="text-red-600 font-medium">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2 bg-white p-4 rounded-lg border border-amber-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-amber-600" />
                <Label htmlFor="notes" className="font-medium text-amber-800">Notes</Label>
              </div>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g., Discuss diet options, bring medical records"
                rows={4}
                className="border-amber-200 focus:ring-amber-500"
              />
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-amber-50 transition-colors">
                <Checkbox
                  id="reminder"
                  name="reminder"
                  checked={formData.reminder}
                  onCheckedChange={(checked) => handleCheckboxChange("reminder", checked === true)}
                  className="border-amber-400 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-600" />
                  <Label htmlFor="reminder" className="font-medium text-amber-800 cursor-pointer">
                    Send reminder before appointment
                  </Label>
                </div>
              </div>

              {formData.reminder && (
                <div className="ml-6 p-4 bg-amber-50/50 rounded-lg border border-amber-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminderValue" className="text-amber-800">Remind me</Label>
                      <Input
                        id="reminderValue"
                        name="value"
                        type="number"
                        value={formData.reminderDetails.value}
                        onChange={handleReminderDetailsChange}
                        min={1}
                        className="border-amber-200 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminderUnit" className="text-amber-800">Time unit</Label>
                      <Select
                        name="unit"
                        value={formData.reminderDetails.unit}
                        onValueChange={(value: 'hours' | 'days' | 'weeks') => 
                          setFormData(prev => ({ 
                            ...prev, 
                            reminderDetails: { ...prev.reminderDetails, unit: value } 
                          }))
                        }
                      >
                        <SelectTrigger id="reminderUnit" className="border-amber-200 focus:ring-amber-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-t border-amber-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-amber-300 hover:bg-amber-100 text-amber-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.petId}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              Save Appointment
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
