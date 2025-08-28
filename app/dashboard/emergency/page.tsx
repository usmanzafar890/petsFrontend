"use client"

import { EmergencyDashboard } from "@/components/dashboard/emergency-dashboard"
import { useRouter } from "next/navigation"

export default function EmergencyPage() {
  const router = useRouter()

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <EmergencyDashboard onBack={() => router.push("/dashboard")} />
    </div>
  )
}
