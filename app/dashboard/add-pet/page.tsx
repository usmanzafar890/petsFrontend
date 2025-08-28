"use client"

import { PetProfileForm } from "@/components/pet/pet-profile-form"
import { useRouter } from "next/navigation"

export default function AddPetPage() {
  const router = useRouter()

  return (
    <div className="mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <PetProfileForm onSuccess={() => router.push("/dashboard")} onCancel={() => router.push("/dashboard")} />
    </div>
  )
}
