"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Edit, Trash2, PlusCircle, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { PetFamily } from "@/lib/types"
import { usePetStore } from "@/lib/stores/pets"

interface PetFamilyCardProps {
  family: PetFamily;
  onEdit: () => void;
  onDelete: () => void;
  onAddPet: () => void;
  onViewDetails: () => void;
}

export function PetFamilyCard({ family, onEdit, onDelete, onAddPet, onViewDetails }: PetFamilyCardProps) {
  const { pets } = usePetStore();
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the ${family.name} family?`)) {
      onDelete();
    }
  };

  // Get family pets from the pet store
  const familyPets = Array.isArray(family.pets) 
    ? family.pets.map(petId => {
        const petIdStr = typeof petId === 'string' ? petId : petId._id;
        return pets.find(p => p._id === petIdStr);
      }).filter(Boolean)
    : [];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="bg-white/90 backdrop-blur-sm border-0 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 to-pink-300"></div>
        <CardContent className="p-6 relative flex flex-col flex-grow">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 opacity-5 transform rotate-12">
            <Users className="w-32 h-32" />
          </div>
          
          <div className="flex items-start justify-between mb-5 relative z-10">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 opacity-70 blur-sm"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">{family.name}</h3>
                <p className="text-sm text-gray-600">{familyPets.length} pets</p>
              </div>
            </motion.div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={onEdit} className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} className="text-gray-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <motion.div 
            className="space-y-4 mt-4 flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Family description */}
            {family.description && (
              <p className="text-sm text-gray-600 italic">{family.description}</p>
            )}

            {/* Pet list */}
            <div className="bg-purple-50/50 p-3 rounded-lg flex-grow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                  <span className="text-sm font-medium text-purple-700">Family Members</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onAddPet}
                  className="text-purple-600 hover:bg-purple-100 hover:text-purple-700 p-1 h-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              
              {familyPets.length > 0 ? (
                <div className="space-y-2">
                  {familyPets.slice(0, 3).map((pet: any) => (
                    <div key={pet._id} className="flex items-center justify-between bg-white p-2 rounded-md border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-pink-500" />
                        <span className="text-sm font-medium">{pet.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs bg-white border-purple-200 text-purple-700">
                        {pet.role || "member"}
                      </Badge>
                    </div>
                  ))}
                  
                  {familyPets.length > 3 && (
                    <div className="text-center text-xs text-purple-600 mt-2">
                      +{familyPets.length - 3} more pets
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3 text-sm text-gray-500">
                  No pets in this family yet
                </div>
              )}
            </div>
          </motion.div>
          
          <div className="mt-4">
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={onViewDetails}
            >
              View Family Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
