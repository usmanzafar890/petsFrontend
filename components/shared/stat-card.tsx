"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  variant?: "default" | "destructive"
  className?: string
  iconClassName?: string
}

export function StatCard({ title, value, icon: Icon, variant = "default", className, iconClassName }: StatCardProps) {
  const isDestructive = variant === "destructive" && (typeof value === 'number' ? value > 0 : !!value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`overflow-hidden ${className || `border-amber-200 ${isDestructive ? "bg-red-50" : "bg-gradient-to-br from-amber-50 to-white"}`}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${isDestructive ? "text-red-600" : "text-amber-700"}`}>
            {title}
          </CardTitle>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClassName || `${isDestructive ? "bg-red-100" : "bg-amber-100"}`}`}>
            <Icon className={`h-4 w-4 ${isDestructive ? "text-red-500" : "text-amber-600"}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isDestructive ? "text-red-600" : "text-amber-700"}`}>
            {value}
          </div>
          <div className="absolute bottom-0 right-0 opacity-5">
            <Icon className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
