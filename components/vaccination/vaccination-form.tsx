"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Syringe } from "lucide-react"
import type { VaccinationRecord, Pet, VaccinationData } from "@/lib/types"

interface VaccinationFormProps {
  pets: Pet[]
  vaccination?: VaccinationRecord
  onSave: (vaccination: VaccinationData) => void
  onCancel: () => void
}

export function VaccinationForm({ pets, vaccination, onSave, onCancel }: VaccinationFormProps) {
  const [formData, setFormData] = useState({
    petId: vaccination?.petId || pets[0]?._id || "",
    type: vaccination?.type || ("vaccine" as const),
    name: vaccination?.name || "",
    dateGiven: vaccination?.dateGiven ? new Date(vaccination.dateGiven).toISOString().slice(0, 10) : "",
    nextDue: vaccination?.nextDue ? new Date(vaccination.nextDue).toISOString().slice(0, 10) : "",
    veterinarian: vaccination?.veterinarian || "",
    notes: vaccination?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const vaccinationData: VaccinationData = {
      ...formData,
      dateGiven: new Date(formData.dateGiven),
      nextDue: formData.nextDue ? new Date(formData.nextDue) : undefined,
    }

    onSave(vaccinationData)
  }

  const getDefaultNextDue = (type: string, name: string) => {
    const given = new Date(formData.dateGiven)
    if (!formData.dateGiven) return ""

    // Common vaccination schedules
    if (type === "vaccine") {
      if (name.toLowerCase().includes("rabies")) {
        given.setFullYear(given.getFullYear() + 3) // Rabies every 3 years
      } else {
        given.setFullYear(given.getFullYear() + 1) // Most vaccines annually
      }
    } else if (type === "flea-tick") {
      given.setMonth(given.getMonth() + 3) // Flea/tick every 3 months
    } else if (type === "deworming") {
      given.setMonth(given.getMonth() + 6) // Deworming every 6 months
    }

    return given.toISOString().slice(0, 10)
  }

  const handleDateGivenChange = (date: string) => {
    setFormData((prev) => ({
      ...prev,
      dateGiven: date,
      nextDue: prev.nextDue || getDefaultNextDue(prev.type, prev.name),
    }))
  }

  const handleTypeChange = (type: "vaccine" | "flea-tick" | "deworming") => {
    setFormData((prev) => ({
      ...prev,
      type,
      nextDue: formData.dateGiven ? getDefaultNextDue(type, prev.name) : prev.nextDue,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{vaccination ? "Edit Health Record" : "Add Health Record"}</h1>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-blue-500" />
            Health Record Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Selection */}
            <div className="space-y-2">
              <Label htmlFor="pet">Pet *</Label>
              <Select
                value={formData.petId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, petId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet._id} value={pet._id}>
                      {pet.name} ({pet.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type and Name */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaccine">💉 Vaccination</SelectItem>
                    <SelectItem value="flea-tick">🐛 Flea & Tick Prevention</SelectItem>
                    <SelectItem value="deworming">🪱 Deworming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name/Description *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., DHPP, Rabies, Frontline"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateGiven">Date Given *</Label>
                <Input
                  id="dateGiven"
                  type="date"
                  value={formData.dateGiven}
                  onChange={(e) => handleDateGivenChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDue">Next Due Date</Label>
                <Input
                  id="nextDue"
                  type="date"
                  value={formData.nextDue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nextDue: e.target.value }))}
                />
              </div>
            </div>

            {/* Veterinarian */}
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinarian *</Label>
              <Input
                id="veterinarian"
                value={formData.veterinarian}
                onChange={(e) => setFormData((prev) => ({ ...prev, veterinarian: e.target.value }))}
                placeholder="Dr. Smith at Happy Paws Clinic"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes or reactions..."
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                {vaccination ? "Update Record" : "Add Record"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
