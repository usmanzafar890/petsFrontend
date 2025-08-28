"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Heart, Dog, Cat, Rabbit, Bird, Fish, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Pet } from "@/lib/types"

interface PetCardProps {
  pet: Pet;
  onEdit: () => void;
  onDelete: () => void;
}

export function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${pet.name}'s profile?`)) {
      onDelete();
    }
  };

  // Function to determine which pet icon to use based on species or type
  const getPetIcon = () => {
    const type = pet.species?.toLowerCase() || '';
    if (type.includes('dog')) return Dog;
    if (type.includes('cat')) return Cat;
    if (type.includes('rabbit')) return Rabbit;
    if (type.includes('bird')) return Bird;
    if (type.includes('fish')) return Fish;
    return PawPrint; // Default icon
  };

  const PetIcon = getPetIcon();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-0 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-300"></div>
        <CardContent className="p-6 relative">
          {/* Background paw prints */}
          <div className="absolute top-0 right-0 opacity-5 transform rotate-12">
            <PawPrint className="w-32 h-32" />
          </div>
          
          <div className="flex items-start justify-between mb-5 relative z-10">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 opacity-70 blur-sm"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <PetIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed}</p>
              </div>
            </motion.div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={onEdit} className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} className="text-gray-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <motion.div 
            className="space-y-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Pet details with improved styling */}
            <div className="grid grid-cols-2 gap-3 bg-orange-50/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                <span className="text-sm text-gray-600">Age:</span>
              </div>
              <span className="text-sm font-medium text-gray-900 text-right">{pet.age} years</span>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                <span className="text-sm text-gray-600">Gender:</span>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="capitalize bg-white border-orange-200 text-orange-700">
                  {pet.gender}
                </Badge>
              </div>
              
              {pet.weight && pet.weight > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                    <span className="text-sm text-gray-600">Weight:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-right">{pet.weight} lbs</span>
                </>
              )}
              
              {pet.microchipId && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                    <span className="text-sm text-gray-600">Microchip:</span>
                  </div>
                  <span className="font-mono text-xs text-gray-900 text-right">{pet.microchipId}</span>
                </>
              )}
            </div>

            {/* Allergies with improved styling */}
            {pet?.allergies?.length > 0 && (
              <div className="space-y-2 bg-red-50/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-sm font-medium text-red-700">Allergies</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pet.allergies.slice(0, 3).map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-white border border-red-200 text-red-700">
                      {allergy}
                    </Badge>
                  ))}
                  {pet.allergies.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-white border border-gray-200">
                      +{pet.allergies.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Medical history with improved styling */}
            {pet.medicalHistory.length > 0 && (
              <div className="space-y-2 bg-blue-50/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-700">Medical History</span>
                </div>
                <div className="text-xs text-blue-700 bg-white border border-blue-100 p-2 rounded flex items-center justify-center">
                  {pet.medicalHistory.length} record{pet.medicalHistory.length !== 1 ? "s" : ""} on file
                </div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
