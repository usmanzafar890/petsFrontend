"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PawPrint, Calendar, Stethoscope, FileText } from "lucide-react"
import { motion } from "framer-motion"
import type { Pet, HealthRecord, HealthRecordData } from "@/lib/types"

interface HealthRecordFormProps {
  pets: Pet[]
  record?: HealthRecord
  onSave: (data: HealthRecordData) => void
  onCancel: () => void
}

export function HealthRecordForm({ pets, record, onSave, onCancel }: HealthRecordFormProps) {
  const [formData, setFormData] = useState<HealthRecordData>({
    petId: record?.petId || pets[0]?._id || "",
    type: record?.type || ("vaccine" as const),
    name: record?.name || "",
    date: record?.date ? new Date(record.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    nextDueDate: record?.nextDueDate ? new Date(record.nextDueDate).toISOString().split('T')[0] : "",
    lotNumber: record?.lotNumber || "",
    notes: record?.notes || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <Stethoscope className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-amber-800">
              {record ? "Edit Health Record" : "Add New Health Record"}
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
              <Select name="petId" value={formData.petId} onValueChange={(value) => handleSelectChange('petId', value)} required>
                <SelectTrigger id="petId" className="w-full border-amber-200 focus:ring-amber-500 focus:border-amber-500 bg-white"><SelectValue placeholder="Select a pet" /></SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet._id} value={pet._id}>{pet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2 text-amber-800">
                <FileText className="w-4 h-4 text-amber-600" />
                Record Type
              </Label>
              <Select name="type" value={formData.type} onValueChange={(value: "vaccine" | "medication" | "checkup" | "preventive") => handleSelectChange('type', value)} required>
                <SelectTrigger id="type" className="w-full border-amber-200 focus:ring-amber-500 focus:border-amber-500 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccine">Vaccine</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="preventive">Preventive Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-amber-800">
              <FileText className="w-4 h-4 text-amber-600" />
              Record Name
            </Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g., Rabies Vaccine, Monthly Flea Treatment" 
              required 
              className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-amber-800">
                <Calendar className="w-4 h-4 text-amber-600" />
                Date Administered
              </Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                required 
                className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextDueDate" className="flex items-center gap-2 text-amber-800">
                <Calendar className="w-4 h-4 text-amber-600" />
                Next Due Date (Optional)
              </Label>
              <Input 
                id="nextDueDate" 
                name="nextDueDate" 
                type="date" 
                value={formData.nextDueDate} 
                onChange={handleInputChange} 
                className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {formData.type === 'vaccine' && (
            <div className="space-y-2">
              <Label htmlFor="lotNumber" className="flex items-center gap-2 text-amber-800">
                <FileText className="w-4 h-4 text-amber-600" />
                Lot Number (Optional)
              </Label>
              <Input 
                id="lotNumber" 
                name="lotNumber" 
                value={formData.lotNumber} 
                onChange={handleInputChange} 
                placeholder="Enter vaccine lot number" 
                className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-amber-800">
              <FileText className="w-4 h-4 text-amber-600" />
              Notes
            </Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              placeholder="Optional notes about the record" 
              className="border-amber-200 focus:ring-amber-500 focus:border-amber-500"
            />
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
            >
              {record ? "Update Record" : "Save Record"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.form>
  );
}
