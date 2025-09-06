"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Image as ImageIcon, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { PetFamily, Pet } from "@/lib/types"
import { usePetStore } from "@/lib/stores/pets"
import { Checkbox } from "@/components/ui/checkbox"

interface PetFamilyFormProps {
  family?: PetFamily;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function PetFamilyForm({ family, onSave, onCancel }: PetFamilyFormProps) {
  const { pets } = usePetStore();
  
  const [formData, setFormData] = useState({
    name: family?.name || "",
    description: family?.description || "",
    familyPhoto: family?.familyPhoto || "",
    pets: family?.pets?.map(pet => typeof pet === 'string' ? pet : pet._id) || [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePetToggle = (petId: string) => {
    setFormData(prev => {
      const currentPets = [...prev.pets] as string[];
      if (currentPets.includes(petId)) {
        return { ...prev, pets: currentPets.filter(id => id !== petId) };
      } else {
        return { ...prev, pets: [...currentPets, petId] };
      }
    });
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
      <Card className="border-purple-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 p-2 rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-purple-800">
              {family ? "Edit Pet Family" : "Create New Pet Family"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 bg-gradient-to-br from-purple-50/30 to-pink-50/20 p-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-purple-800">
              <Users className="w-4 h-4 text-purple-600" />
              Family Name
            </Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g., Smith Family Pets" 
              required 
              className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-purple-800">
              <Heart className="w-4 h-4 text-purple-600" />
              Description (Optional)
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Tell us about this pet family" 
              className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyPhoto" className="flex items-center gap-2 text-purple-800">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              Family Photo URL (Optional)
            </Label>
            <Input 
              id="familyPhoto" 
              name="familyPhoto" 
              value={formData.familyPhoto} 
              onChange={handleInputChange} 
              placeholder="Enter image URL" 
              className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-purple-800">
              <Heart className="w-4 h-4 text-purple-600" />
              Select Pets for this Family
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pets.map((pet) => (
                <div 
                  key={pet._id} 
                  className={`flex items-center space-x-3 rounded-md border p-3 transition-colors ${
                    formData.pets.includes(pet._id) 
                      ? 'bg-purple-50 border-purple-300' 
                      : 'bg-white border-gray-200 hover:bg-purple-50/50'
                  }`}
                >
                  <Checkbox 
                    id={`pet-${pet._id}`}
                    checked={formData.pets.includes(pet._id)}
                    onCheckedChange={() => handlePetToggle(pet._id)}
                    className="border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <label 
                    htmlFor={`pet-${pet._id}`}
                    className="flex flex-1 items-center justify-between text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>{pet.name}</span>
                      <span className="text-xs text-gray-500">({pet.species})</span>
                    </div>
                    {pet.family && pet.family !== family?._id && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        In another family
                      </span>
                    )}
                  </label>
                </div>
              ))}
              
              {pets.length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  No pets available. Please add pets first.
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-200 p-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-purple-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 text-purple-800 transition-colors"
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
            >
              {family ? "Update Family" : "Create Family"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.form>
  );
}
