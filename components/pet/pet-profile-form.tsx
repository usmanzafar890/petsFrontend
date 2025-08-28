"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dog, Cat, Rabbit, Bird, Fish, PawPrint, X, Plus, Heart, User, Calendar, Scale, Flag, MapPin, Tag, Info, Thermometer, Stethoscope, Clipboard, Dna, Pencil } from "lucide-react";
import type { Pet } from "@/lib/types"
import { usePetStore } from "@/lib/stores/pets"
import { motion } from "framer-motion"

interface PetProfileFormProps {
  pet?: Pet;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PetProfileForm({ pet, onSuccess, onCancel }: PetProfileFormProps) {
  const [formData, setFormData] = useState({
    species: pet?.species || "",
    countryOfOrigin: pet?.countryOfOrigin || "",
    passport: pet?.passport || "",
    placeOfBirth: pet?.placeOfBirth || "",
    identificationMark: pet?.identificationMark || "",
    nickname: pet?.nickname || "",
    custodyFrom: pet?.custodyFrom || ("Shelter" as const),
    registrationNumber: pet?.registrationNumber || "",
    aboutPet: pet?.aboutPet || "",
    colorOfPet: pet?.colorOfPet || "",
    sizeOfPet: pet?.sizeOfPet || "",
    name: pet?.name || "",
    breed: pet?.breed || "",
    age: pet?.age || 0,
    gender: pet?.gender || ("male" as const),
    microchipId: pet?.microchipId || "",
    weight: pet?.weight || 0,
    allergies: pet?.allergies || [],
    medicalHistory: pet?.medicalHistory || [],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newMedicalRecord, setNewMedicalRecord] = useState("");

  const { addPet, editPet } = usePetStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (pet) {
        await editPet(pet._id, formData);
      } else {
        await addPet(formData as any);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save pet", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = e.target.type === 'number' ? (name === 'age' ? parseInt(value) : parseFloat(value)) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addListItem = (field: 'allergies' | 'medicalHistory', value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setValue("");
    }
  };

  const removeListItem = (field: 'allergies' | 'medicalHistory', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }));
  };

  // Get pet icon based on species
  const getPetIcon = () => {
    const species = formData.species.toLowerCase();
    if (species.includes('dog')) return Dog;
    if (species.includes('cat')) return Cat;
    if (species.includes('rabbit')) return Rabbit;
    if (species.includes('bird')) return Bird;
    if (species.includes('fish')) return Fish;
    return PawPrint;
  };
  
  const PetIcon = getPetIcon();
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-amber-200 shadow-lg overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
        {/* Decorative paw prints in background */}
        <div className="absolute top-0 right-0 opacity-[0.03] z-0">
          <PawPrint className="w-40 h-40 text-amber-900" />
        </div>
        <div className="absolute bottom-20 left-0 opacity-[0.03] z-0 transform -rotate-12">
          <PawPrint className="w-32 h-32 text-amber-900" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-100/50 to-transparent pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 opacity-50 blur-md"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                  {pet ? <Pencil className="w-5 h-5 text-white" /> : <PetIcon className="w-5 h-5 text-white" />}
                </div>
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  {pet ? "Edit Pet Profile" : "Add New Pet"}
                </CardTitle>
                <CardDescription className="text-amber-700">
                  {pet ? "Update your pet's information" : "Fill in your pet's details to create a profile"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </motion.div>
        
        <CardContent className="space-y-6 relative z-10 pt-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-700 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pet Name</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Buddy" 
                    required 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <PawPrint className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="species" className="text-amber-700 flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-amber-500" />
                  <span>Species</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="species" 
                    name="species" 
                    value={formData.species} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Dog" 
                    required 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <PetIcon className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breed" className="text-amber-700 flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-amber-500" />
                  <span>Breed</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="breed" 
                    name="breed" 
                    value={formData.breed} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Golden Retriever" 
                    required 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <Dog className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Physical Details</span>
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-amber-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Age (years)</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    min="0" 
                    max="30" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                    required 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 text-amber-500 text-sm font-medium">Y</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-amber-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gender</span>
                </Label>
                <Select 
                  name="gender" 
                  value={formData.gender} 
                  onValueChange={(value: "male" | "female") => handleSelectChange('gender', value)}
                >
                  <SelectTrigger id="gender" className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-amber-700 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-500" />
                  <span>Weight (lbs)</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="weight" 
                    name="weight" 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={formData.weight} 
                    onChange={handleInputChange} 
                    placeholder="Optional" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 text-amber-500 text-sm font-medium">lb</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Identification</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="microchipId" className="text-amber-700 flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-amber-500" />
                  <span>Microchip ID</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="microchipId" 
                    name="microchipId" 
                    value={formData.microchipId} 
                    onChange={handleInputChange} 
                    placeholder="Enter microchip number (optional)" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 text-amber-500 text-sm font-medium">#</span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-amber-700 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nickname</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      id="nickname" 
                      name="nickname" 
                      value={formData.nickname} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Good boy" 
                      className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                    <span className="absolute left-3 top-2.5 text-amber-500 text-sm font-medium">♥</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="countryOfOrigin" className="text-amber-700 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-amber-500" />
                    <span>Country of Origin</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      id="countryOfOrigin" 
                      name="countryOfOrigin" 
                      value={formData.countryOfOrigin} 
                      onChange={handleInputChange} 
                      placeholder="e.g., USA" 
                      className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                    <Flag className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Origin Details</span>
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth" className="text-amber-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Place of Birth</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="placeOfBirth" 
                    name="placeOfBirth" 
                    value={formData.placeOfBirth} 
                    onChange={handleInputChange} 
                    placeholder="e.g., California" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passport" className="text-amber-700 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Passport Number</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="passport" 
                    name="passport" 
                    value={formData.passport} 
                    onChange={handleInputChange} 
                    placeholder="Enter passport number" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 text-amber-500 text-sm font-medium">ID</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Registration Details</span>
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="text-amber-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Registration Number</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="registrationNumber" 
                    name="registrationNumber" 
                    value={formData.registrationNumber} 
                    onChange={handleInputChange} 
                    placeholder="Enter registration number" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 text-amber-500 text-sm font-medium">R#</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="identificationMark" className="text-amber-700 flex items-center gap-1.5">
                  <PawPrint className="w-3.5 h-3.5 text-amber-500" />
                  <span>Identification Mark</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="identificationMark" 
                    name="identificationMark" 
                    value={formData.identificationMark} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Star on forehead" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <PawPrint className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Physical Appearance</span>
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="colorOfPet" className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></span>
                  <span>Color</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="colorOfPet" 
                    name="colorOfPet" 
                    value={formData.colorOfPet} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Golden" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sizeOfPet" className="text-amber-700 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-500" />
                  <span>Size</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="sizeOfPet" 
                    name="sizeOfPet" 
                    value={formData.sizeOfPet} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Large" 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <Scale className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custodyFrom" className="text-amber-700 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-500" />
                  <span>Custody From</span>
                </Label>
                <Select 
                  name="custodyFrom" 
                  value={formData.custodyFrom} 
                  onValueChange={(value: 'Shelter' | 'By birth' | 'Bought new') => handleSelectChange('custodyFrom', value)}
                >
                  <SelectTrigger id="custodyFrom" className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 pl-9 relative">
                    <Heart className="absolute left-3 w-4 h-4 text-amber-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shelter">Shelter</SelectItem>
                    <SelectItem value="By birth">By birth</SelectItem>
                    <SelectItem value="Bought new">Bought new</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-600" />
              <span>Pet Bio</span>
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="aboutPet" className="text-amber-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>About Pet</span>
              </Label>
              <div className="relative">
                <Textarea 
                  id="aboutPet" 
                  name="aboutPet" 
                  value={formData.aboutPet} 
                  onChange={(e) => setFormData(prev => ({...prev, aboutPet: e.target.value}))} 
                  placeholder="Tell us something about your pet" 
                  className="min-h-[100px] border-amber-200 focus:border-amber-400 focus:ring-amber-400 pl-10 pt-8"
                />
                <div className="absolute left-3 top-3">
                  <PawPrint className="w-5 h-5 text-amber-400/70" />
                </div>
                <div className="absolute right-3 top-3 opacity-10">
                  <PetIcon className="w-8 h-8" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span>Health Information</span>
            </h3>
            
            <div className="space-y-4">
              <Label className="text-amber-700 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
                <span>Allergies</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    value={newAllergy} 
                    onChange={(e) => setNewAllergy(e.target.value)} 
                    placeholder="Add an allergy and press Enter" 
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('allergies', newAllergy, setNewAllergy))} 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <Thermometer className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="button" 
                    onClick={() => addListItem('allergies', newAllergy, setNewAllergy)}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
              
              {formData.allergies.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2 p-3 bg-white/50 rounded-lg border border-amber-100"
                >
                  {formData.allergies.map((allergy, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 hover:from-amber-200 hover:to-amber-300 border border-amber-300">
                        {allergy}
                        <button 
                          type="button" 
                          onClick={() => removeListItem('allergies', index)} 
                          className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                        >
                          <X className="h-3 w-3 text-amber-600 hover:text-amber-800" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm"
          >
            <h3 className="text-sm font-medium text-amber-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-amber-600" />
              <span>Medical History</span>
            </h3>
            
            <div className="space-y-4">
              <Label className="text-amber-700 flex items-center gap-1.5">
                <Clipboard className="w-3.5 h-3.5 text-amber-500" />
                <span>Medical Records</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    value={newMedicalRecord} 
                    onChange={(e) => setNewMedicalRecord(e.target.value)} 
                    placeholder="Add a medical record and press Enter" 
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('medicalHistory', newMedicalRecord, setNewMedicalRecord))} 
                    className="pl-9 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                  <Clipboard className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="button" 
                    onClick={() => addListItem('medicalHistory', newMedicalRecord, setNewMedicalRecord)}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
              
              {formData.medicalHistory.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 p-3 bg-white/50 rounded-lg border border-amber-100"
                >
                  {formData.medicalHistory.map((record, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between rounded-lg border border-amber-200 p-3 shadow-sm bg-gradient-to-r from-amber-50 to-white"
                    >
                      <div className="space-y-1 flex items-center">
                        <Stethoscope className="w-4 h-4 text-amber-500 mr-2" />
                        <p className="text-sm font-medium leading-none text-amber-800">{record}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        type="button" 
                        onClick={() => removeListItem('medicalHistory', index)} 
                        className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 bg-amber-100 p-1"
                      >
                        <X className="h-4 w-4 text-amber-600 hover:text-amber-800" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-end gap-3 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 px-5"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 shadow-md"
              >
                <PawPrint className="mr-2 h-4 w-4" />
                {pet ? "Update Pet" : "Save Pet"}
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </form>
  )
}
