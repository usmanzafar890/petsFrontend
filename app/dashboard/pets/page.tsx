"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, Loader2 } from "lucide-react"
import { PetCard } from "@/components/pet/pet-card"
import { PetProfileForm } from "@/components/pet/pet-profile-form"
import { PetFamilyCard } from "@/components/pet-family/pet-family-card"
import { PetFamilyForm } from "@/components/pet-family/pet-family-form"
import { PetFamilyDetails } from "@/components/pet-family/pet-family-details"
import { usePetStore } from "@/lib/stores/pets"
import { usePetFamilyStore } from "@/lib/stores/petFamilies"
import { Pet, PetFamily, PetRole } from "@/lib/types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

export default function PetsPage() {
  const { pets, fetchPets, addPet, editPet, removePet } = usePetStore();
  const { 
    petFamilies, 
    fetchPetFamilies, 
    createPetFamily, 
    updatePetFamily, 
    deletePetFamily,
    addPetToFamily,
    removePetFromFamily,
    updatePetRole,
    loading: familyLoading,
    error: familyError
  } = usePetFamilyStore();
  
  const [activeTab, setActiveTab] = useState("all-pets");
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [editingFamily, setEditingFamily] = useState<PetFamily | null>(null);
  const [viewingFamily, setViewingFamily] = useState<PetFamily | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPets(), fetchPetFamilies()]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchPets, fetchPetFamilies]);

  // Handle pet operations
  const handleAddPet = async (data: any) => {
    await addPet(data);
    setIsAddPetOpen(false);
  };

  const handleEditPet = async (id: string, data: any) => {
    await editPet(id, data);
    setEditingPet(null);
  };

  const handleDeletePet = async (id: string) => {
    await removePet(id);
  };

  // Handle family operations
  const handleAddFamily = async (data: any) => {
    await createPetFamily(data);
    setIsAddFamilyOpen(false);
  };

  const handleEditFamily = async (id: string, data: any) => {
    await updatePetFamily(id, data);
    setEditingFamily(null);
  };

  const handleDeleteFamily = async (id: string) => {
    await deletePetFamily(id);
    if (viewingFamily && viewingFamily._id === id) {
      setViewingFamily(null);
    }
  };

  const handleAddPetToFamily = async (petId: string, role: PetRole, notes: string) => {
    if (viewingFamily) {
      await addPetToFamily(viewingFamily._id, petId, role, notes);
      // Refresh data
      await Promise.all([fetchPets(), fetchPetFamilies()]);
    }
  };

  const handleRemovePetFromFamily = async (petId: string) => {
    if (viewingFamily) {
      await removePetFromFamily(viewingFamily._id, petId);
      // Refresh data
      await Promise.all([fetchPets(), fetchPetFamilies()]);
    }
  };

  const handleUpdatePetRole = async (petId: string, role: PetRole, notes: string) => {
    if (viewingFamily) {
      await updatePetRole(viewingFamily._id, petId, role, notes);
      // Refresh data
      await Promise.all([fetchPets(), fetchPetFamilies()]);
    }
  };

  // Get family pets
  const getFamilyPets = (family: PetFamily) => {
    if (!family.pets) return [];
    
    return pets.filter(pet => {
      const petIds = family.pets.map(p => typeof p === 'string' ? p : p._id);
      return petIds.includes(pet._id);
    });
  };

  // Get available pets (not in any family or in the current family)
  const getAvailablePets = (family: PetFamily) => {
    return pets.filter(pet => {
      // Include pets that don't have a family or are in the current family
      return !pet.family || pet.family === family._id;
    });
  };

  if (loading || familyLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pets and families...</p>
        </div>
      </div>
    );
  }

  if (viewingFamily) {
    const familyPets = getFamilyPets(viewingFamily);
    const availablePets = getAvailablePets(viewingFamily);
    
    return (
      <PetFamilyDetails 
        family={viewingFamily}
        pets={familyPets}
        availablePets={availablePets}
        onBack={() => setViewingFamily(null)}
        onAddPet={handleAddPetToFamily}
        onRemovePet={handleRemovePetFromFamily}
        onUpdatePetRole={handleUpdatePetRole}
        onEdit={() => {
          setEditingFamily(viewingFamily);
          setViewingFamily(null);
        }}
        onDelete={() => handleDeleteFamily(viewingFamily._id)}
      />
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pets Dashboard</h1>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddPetOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Add Pet
          </Button>
          <Button 
            onClick={() => setIsAddFamilyOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Users className="w-4 h-4 mr-1" /> Create Family
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-pets">All Pets</TabsTrigger>
          <TabsTrigger value="families">Pet Families</TabsTrigger>
          <TabsTrigger value="orphans">Pets Without Family</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-pets" className="mt-6">
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map(pet => (
                <PetCard 
                  key={pet._id} 
                  pet={pet} 
                  onEdit={() => setEditingPet(pet)} 
                  onDelete={() => handleDeletePet(pet._id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pets yet</h3>
              <p className="text-gray-500 mb-4">Add your first pet to get started</p>
              <Button 
                onClick={() => setIsAddPetOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Pet
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="families" className="mt-6">
          {petFamilies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {petFamilies.map(family => (
                <PetFamilyCard 
                  key={family._id} 
                  family={family} 
                  onEdit={() => setEditingFamily(family)} 
                  onDelete={() => handleDeleteFamily(family._id)}
                  onAddPet={() => {
                    setViewingFamily(family);
                  }}
                  onViewDetails={() => setViewingFamily(family)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pet families yet</h3>
              <p className="text-gray-500 mb-4">Create your first pet family to organize your pets</p>
              <Button 
                onClick={() => setIsAddFamilyOpen(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Users className="w-4 h-4 mr-1" /> Create Family
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="orphans" className="mt-6">
          {pets.filter(pet => !pet.family).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.filter(pet => !pet.family).map(pet => (
                <PetCard 
                  key={pet._id} 
                  pet={pet} 
                  onEdit={() => setEditingPet(pet)} 
                  onDelete={() => handleDeletePet(pet._id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">All pets are in families</h3>
              <p className="text-gray-500">Great job organizing your pets!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Pet Dialog */}
      <Dialog open={isAddPetOpen || !!editingPet} onOpenChange={(open) => {
        if (!open) {
          setIsAddPetOpen(false);
          setEditingPet(null);
        }
      }}>
        <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-auto">
          <DialogTitle className="sr-only">
            {editingPet ? `Edit ${editingPet.name}` : 'Add New Pet'}
          </DialogTitle>
          <PetProfileForm 
            pet={editingPet || undefined}
            onSuccess={() => {
              setIsAddPetOpen(false);
              setEditingPet(null);
            }}
            onCancel={() => {
              setIsAddPetOpen(false);
              setEditingPet(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add/Edit Family Dialog */}
      <Dialog open={isAddFamilyOpen || !!editingFamily} onOpenChange={(open) => {
        if (!open) {
          setIsAddFamilyOpen(false);
          setEditingFamily(null);
        }
      }}>
        <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-auto">
          <DialogTitle className="sr-only">
            {editingFamily ? `Edit ${editingFamily.name}` : 'Create New Pet Family'}
          </DialogTitle>
          <PetFamilyForm 
            family={editingFamily || undefined}
            onSave={(data) => {
              if (editingFamily) {
                handleEditFamily(editingFamily._id, data);
              } else {
                handleAddFamily(data);
              }
            }}
            onCancel={() => {
              setIsAddFamilyOpen(false);
              setEditingFamily(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
