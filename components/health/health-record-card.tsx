"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Syringe, Pill, Stethoscope, ShieldCheck, Calendar, AlertTriangle, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import type { HealthRecord, Pet } from "@/lib/types"

interface HealthRecordCardProps {
  record: HealthRecord
  pet: Pet
  onEdit: () => void
  onDelete: () => void
  className?: string
}

const TYPE_DETAILS: { [key: string]: { icon: React.ElementType, color: string, gradient: string, border: string } } = {
  vaccine: { 
    icon: Syringe, 
    color: "bg-amber-100 text-amber-800", 
    gradient: "from-amber-100 to-amber-50",
    border: "border-amber-200"
  },
  medication: { 
    icon: Pill, 
    color: "bg-orange-100 text-orange-800", 
    gradient: "from-orange-100 to-orange-50",
    border: "border-orange-200"
  },
  checkup: { 
    icon: Stethoscope, 
    color: "bg-amber-100 text-amber-800", 
    gradient: "from-amber-200 to-amber-50",
    border: "border-amber-300"
  },
  preventive: { 
    icon: ShieldCheck, 
    color: "bg-orange-100 text-orange-800", 
    gradient: "from-orange-200 to-orange-50",
    border: "border-orange-300"
  },
};

export function HealthRecordCard({ record, pet, onEdit, onDelete, className }: HealthRecordCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this record?`)) {
      onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOverdue = record.nextDueDate && new Date(record.nextDueDate) < new Date();
  const Icon = TYPE_DETAILS[record.type]?.icon || Syringe;
  const color = TYPE_DETAILS[record.type]?.color || "bg-gray-100 text-gray-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
    <Card className={`${className || 'border-amber-200 shadow-md hover:shadow-lg transition-all'} ${isOverdue ? "border-destructive/50" : ""}`}>
      <div className={`h-1 w-full bg-gradient-to-r from-amber-300 to-orange-300`}></div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">{record.name}</h3>
              <div className="flex items-center gap-1 text-sm text-amber-600">
                <PawPrint className="w-3 h-3" />
                <span>{pet.name}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive hover:text-destructive/90">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 text-sm mt-2">
          <div className="flex justify-between items-center">
            <span className="text-amber-700">Date Given:</span>
            <span className="font-medium">{formatDate(record.date)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-700">Next Due:</span>
            {isOverdue ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {formatDate(record.nextDueDate!)}
              </Badge>
            ) : (
              <span className="font-medium text-amber-800">{formatDate(record.nextDueDate!)}</span>
            )}
          </div>
          <Badge variant="outline" className="capitalize py-1 px-2 text-xs border-dashed border-amber-300 text-amber-700">
            {record.type}
          </Badge>
          {record.notes && (
            <p className="text-sm text-amber-700 bg-amber-50/30 p-3 rounded-md border border-amber-200/50">
              {record.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
