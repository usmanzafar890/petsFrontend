"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Bell, ArrowRight, Calendar, HeartPulse, PawPrint, Syringe, Pill } from "lucide-react"
import { motion } from "framer-motion"
import type { HealthRecord, Pet } from "@/lib/types"

interface HealthAlertsProps {
  healthRecords: HealthRecord[];
  pets: Pet[];
}

export function HealthAlerts({ healthRecords, pets }: HealthAlertsProps) {
  const router = useRouter()

  const overdueRecords = healthRecords
    .filter((r) => r.nextDueDate && new Date(r.nextDueDate) < new Date())
    .slice(0, 2);

  const dueSoonRecords = healthRecords
    .filter((r) => {
      if (!r.nextDueDate) return false;
      const dueDate = new Date(r.nextDueDate);
      const today = new Date();
      const inAWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      return dueDate > today && dueDate <= inAWeek;
    })
    .slice(0, 2 - overdueRecords.length);

  const alerts = [...overdueRecords, ...dueSoonRecords];

  if (alerts.length === 0) {
    return null
  }

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p._id === petId)
    return pet ? pet.name : "Unknown Pet"
  }

  // Function to get appropriate icon based on health record type
  const getHealthIcon = (recordName: string) => {
    const name = recordName.toLowerCase();
    if (name.includes('vaccine') || name.includes('vaccination')) return Syringe;
    if (name.includes('medication') || name.includes('medicine')) return Pill;
    if (name.includes('check') || name.includes('exam')) return HeartPulse;
    return Shield;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative"
    >
      {/* Background decorative element */}
      <div className="absolute -top-6 -right-6 opacity-5 z-0">
        <PawPrint className="w-32 h-32 text-rose-500" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400 to-red-300 opacity-50 blur-sm"></div>
              <div className="relative bg-white rounded-full p-2">
                <Bell className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Health Alerts</h2>
              <p className="text-sm text-gray-500">Upcoming and overdue pet care</p>
            </div>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/health")}
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.map((record, index) => {
            const isOverdue = record.nextDueDate && new Date(record.nextDueDate) < new Date();
            const HealthIcon = getHealthIcon(record.name);
            const petName = getPetName(record.petId);
            
            return (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className={`overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <div className={`h-1 w-full ${isOverdue ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-amber-400 to-yellow-300'}`}></div>
                  <CardContent className={`p-5 ${isOverdue ? 'bg-gradient-to-br from-red-50 to-white' : 'bg-gradient-to-br from-amber-50 to-white'}`}>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`absolute -inset-1.5 rounded-full ${isOverdue ? 'bg-red-400' : 'bg-amber-400'} opacity-20 blur-sm`}></div>
                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${isOverdue ? 'bg-gradient-to-br from-red-500 to-red-400' : 'bg-gradient-to-br from-amber-500 to-yellow-400'}`}>
                          <HealthIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800">{record.name}</p>
                          <Badge variant={isOverdue ? "destructive" : "outline"} className={isOverdue ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
                            {isOverdue ? "Overdue" : "Due Soon"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mt-1 mb-3">
                          <PawPrint className={`w-3.5 h-3.5 mr-1.5 ${isOverdue ? 'text-red-400' : 'text-amber-400'}`} />
                          <span className="text-sm text-gray-600">{petName}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
                            <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                              {record.nextDueDate ? new Date(record.nextDueDate).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                          
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push('/dashboard/health')}
                              className={isOverdue ? 
                                "border-red-200 text-red-600 hover:bg-red-50" : 
                                "border-amber-200 text-amber-600 hover:bg-amber-50"}
                            >
                              Update
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
