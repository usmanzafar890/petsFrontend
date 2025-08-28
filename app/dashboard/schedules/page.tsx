"use client"

import { ScheduleDashboard } from "@/components/dashboard/schedule-dashboard"
import { useRouter } from "next/navigation"

export default function SchedulesPage() {
  const router = useRouter()

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <ScheduleDashboard onBack={() => router.push("/dashboard")} />
    </div>
  )
}
