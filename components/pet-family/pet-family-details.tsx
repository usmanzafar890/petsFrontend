"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, PlusCircle, Heart, ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { PetFamily, Pet, PetRole } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PetFamilyDetailsProps {
  family: PetFamily;
  pets: Pet[];
  availablePets: Pet[];
  onBack: () => void;
  onAddPet: (petId: string, role: PetRole, notes: string) => Promise<void>;
  onRemovePet: (petId: string) => Promise<void>;
  onUpdatePetRole: (petId: string, role: PetRole, notes: string) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}

export function PetFamilyDetails({ 
  family, 
  pets, 
  availablePets, 
  onBack, 
  onAddPet, 
  onRemovePet, 
  onUpdatePetRole,
  onEdit,
  onDelete
}: PetFamilyDetailsProps) {
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<PetRole>("sibling");
  const [relationshipNotes, setRelationshipNotes] = useState("");
  
  const [editingPet, setEditingPet] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<PetRole>("sibling");
  const [editNotes, setEditNotes] = useState("");

  const handleAddPet = async () => {
    if (selectedPet) {
      await onAddPet(selectedPet, selectedRole, relationshipNotes);
      setSelectedPet("");
      setSelectedRole("sibling");
      setRelationshipNotes("");
      setIsAddPetOpen(false);
    }
  };

  const handleEditRole = async (petId: string) => {
    if (editingPet) {
      await onUpdatePetRole(petId, editRole, editNotes);
      setEditingPet(null);
    }
  };

  const startEditingPet = (pet: Pet) => {
    setEditingPet(pet._id);
    setEditRole(pet.role || "sibling");
    setEditNotes(pet.relationshipNotes || "");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the ${family.name} family?`)) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Families
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Pencil className="w-4 h-4 mr-1" /> Edit Family
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      <Card className="border-purple-200 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl shadow-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-purple-800">
                {family.name}
              </CardTitle>
              {family.description && (
                <p className="text-sm text-gray-600 mt-1">{family.description}</p>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {family.familyPhoto && (
            <div className="rounded-lg overflow-hidden shadow-md max-h-64 flex items-center justify-center bg-gray-100">
              <Image 
                src={family.familyPhoto} 
                alt={`${family.name} family photo`} 
                width={600} 
                height={400} 
                className="object-cover w-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Family Members
              </h3>
              
              <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    disabled={availablePets.length === 0}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Pet
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Add Pet to Family</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="pet-select">Select Pet</Label>
                      <Select value={selectedPet} onValueChange={setSelectedPet}>
                        <SelectTrigger id="pet-select" className="w-full">
                          <SelectValue placeholder="Select a pet" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePets.map(pet => (
                            <SelectItem key={pet._id} value={pet._id}>
                              {pet.name} ({pet.species})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role-select">Role in Family</Label>
                      <Select value={selectedRole} onValueChange={(value: PetRole) => setSelectedRole(value)}>
                        <SelectTrigger id="role-select" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="relationship-notes">Relationship Notes (Optional)</Label>
                      <Textarea 
                        id="relationship-notes" 
                        value={relationshipNotes} 
                        onChange={(e) => setRelationshipNotes(e.target.value)}
                        placeholder="Add any notes about this pet's role in the family"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddPet} 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      disabled={!selectedPet}
                    >
                      Add to Family
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {pets.length > 0 ? (
              <div className="space-y-4">
                {pets.map(pet => (
                  <div 
                    key={pet._id} 
                    className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {editingPet === pet._id ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-purple-800">{pet.name}</h4>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {pet.species}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-role-${pet._id}`}>Role in Family</Label>
                          <Select value={editRole} onValueChange={(value: PetRole) => setEditRole(value)}>
                            <SelectTrigger id={`edit-role-${pet._id}`} className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-notes-${pet._id}`}>Relationship Notes</Label>
                          <Textarea 
                            id={`edit-notes-${pet._id}`} 
                            value={editNotes} 
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add any notes about this pet's role in the family"
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingPet(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleEditRole(pet._id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-purple-800">{pet.name}</h4>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {pet.species}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-pink-500" />
                          <span className="text-sm text-gray-600">Role:</span>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-none">
                            {pet.role || "Member"}
                          </Badge>
                        </div>
                        
                        {pet.relationshipNotes && (
                          <p className="text-sm text-gray-600 italic border-l-2 border-purple-200 pl-3 py-1">
                            {pet.relationshipNotes}
                          </p>
                        )}
                        
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startEditingPet(pet)}
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit Role
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onRemovePet(pet._id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No pets in this family yet</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddPetOpen(true)}
                  className="mt-4 border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={availablePets.length === 0}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Add Pet
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
