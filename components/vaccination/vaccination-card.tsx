"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, AlertTriangle, CheckCircle } from "lucide-react"
import type { VaccinationRecord, Pet } from "@/lib/types"

interface VaccinationCardProps {
  vaccination: VaccinationRecord
  pet: Pet
  onEdit: () => void
  onDelete: () => void
}

const TYPE_ICONS = {
  vaccine: "💉",
  "flea-tick": "🐛",
  deworming: "🪱",
}

const TYPE_COLORS = {
  vaccine: "bg-blue-100 text-blue-800",
  "flea-tick": "bg-green-100 text-green-800",
  deworming: "bg-purple-100 text-purple-800",
}

export function VaccinationCard({ vaccination, pet, onEdit, onDelete }: VaccinationCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this health record?`)) {
      onDelete()
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const getDueStatus = () => {
    if (!vaccination.nextDue) return null

    const now = new Date()
    const dueDate = new Date(vaccination.nextDue)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { status: "overdue", days: Math.abs(diffDays), color: "text-red-600" }
    } else if (diffDays <= 30) {
      return { status: "due-soon", days: diffDays, color: "text-orange-600" }
    } else {
      return { status: "current", days: diffDays, color: "text-green-600" }
    }
  }

  const dueStatus = getDueStatus()

  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-shadow ${
        dueStatus?.status === "overdue"
          ? "ring-2 ring-red-200"
          : dueStatus?.status === "due-soon"
            ? "ring-2 ring-orange-200"
            : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{TYPE_ICONS[vaccination.type]}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{vaccination.name}</h3>
              <p className="text-sm text-gray-600">{pet.name}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit} className="text-gray-600 hover:text-blue-600">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-gray-600 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={TYPE_COLORS[vaccination.type]}>
              {vaccination.type === "flea-tick" ? "Flea & Tick" : vaccination.type}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Date Given:</span>
            <span className="font-medium text-gray-900">{formatDate(vaccination.dateGiven)}</span>
          </div>

          {vaccination.nextDue && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Next Due:</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${dueStatus?.color}`}>{formatDate(vaccination.nextDue)}</span>
                {dueStatus?.status === "overdue" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {dueStatus?.status === "due-soon" && <Calendar className="w-4 h-4 text-orange-500" />}
                {dueStatus?.status === "current" && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Veterinarian:</span>
            <span className="font-medium text-gray-900 text-right">{vaccination.veterinarian}</span>
          </div>

          {vaccination.notes && (
            <div className="space-y-1">
              <span className="text-sm text-gray-600">Notes:</span>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{vaccination.notes}</p>
            </div>
          )}

          {dueStatus && (
            <div className="pt-2 border-t border-gray-100">
              {dueStatus.status === "overdue" && (
                <p className="text-xs text-red-600 font-medium">
                  Overdue by {dueStatus.days} day{dueStatus.days !== 1 ? "s" : ""}
                </p>
              )}
              {dueStatus.status === "due-soon" && (
                <p className="text-xs text-orange-600 font-medium">
                  Due in {dueStatus.days} day{dueStatus.days !== 1 ? "s" : ""}
                </p>
              )}
              {dueStatus.status === "current" && (
                <p className="text-xs text-green-600 font-medium">Current (due in {dueStatus.days} days)</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
