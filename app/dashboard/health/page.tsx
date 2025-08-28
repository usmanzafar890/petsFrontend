"use client"

import { HealthDashboard } from "@/components/dashboard/health-dashboard"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PawPrint } from "lucide-react"

export default function HealthPage() {
  const router = useRouter()

  return (

      <div className="max-w-8xl mx-auto p-4 md:p-6 pt-16 md:pt-6 relative z-10">
        <HealthDashboard onBack={() => router.push("/dashboard")} />
      </div>
  )
}
