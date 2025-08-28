"use client"

import { PetProfileForm } from "@/components/pet/pet-profile-form"
import { usePetStore } from "@/lib/stores/pets";
import type { Pet, PetData } from "@/lib/types";
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function EditPetPage() {
  const router = useRouter()
  const params = useParams()
    const { pets, editPet, fetchPets } = usePetStore();
  const [pet, setPet] = useState<Pet | null>(null);

    useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    if (params.id && pets.length > 0) {
      const petId = Array.isArray(params.id) ? params.id[0] : params.id;
      const existingPet = pets.find(p => p._id === petId);
      if (existingPet) {
        setPet(existingPet);
      } else {
        router.push("/dashboard");
      }
    }
  }, [params.id, pets, router]);

  if (!pet) {
    return <div>Loading...</div> // Or a proper loading spinner
  }

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <PetProfileForm pet={pet} onSuccess={() => router.push("/dashboard")} onCancel={() => router.push("/dashboard")} />
    </div>
  )
}
