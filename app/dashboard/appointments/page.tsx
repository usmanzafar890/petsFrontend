"use client"

import { VetDashboard } from "@/components/dashboard/vet-dashboard"
import { useRouter } from "next/navigation"

export default function AppointmentsPage() {
  const router = useRouter()

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <VetDashboard onBack={() => router.push("/dashboard")} />
    </div>
  )
}
