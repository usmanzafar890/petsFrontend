import type { Pet, Schedule, VetAppointment, VaccinationRecord } from "./types"

const STORAGE_KEYS = {
  PETS: "pet-care-pets",
  SCHEDULES: "pet-care-schedules",
  APPOINTMENTS: "pet-care-appointments",
  VACCINATIONS: "pet-care-vaccinations",
  ACTIVITIES: "pet-care-activities",
} as const

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error)
    return []
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error)
  }
}

// Pet storage functions
export const petStorage = {
  getAll: (): Pet[] => getFromStorage<Pet>(STORAGE_KEYS.PETS),

  save: (pet: Pet): void => {
    const pets = getFromStorage<Pet>(STORAGE_KEYS.PETS)
    const existingIndex = pets.findIndex((p) => p.id === pet.id)

    if (existingIndex >= 0) {
      pets[existingIndex] = { ...pet, updatedAt: new Date() }
    } else {
      pets.push(pet)
    }

    saveToStorage(STORAGE_KEYS.PETS, pets)
  },

  delete: (id: string): void => {
    const pets = getFromStorage<Pet>(STORAGE_KEYS.PETS)
    const filtered = pets.filter((p) => p.id !== id)
    saveToStorage(STORAGE_KEYS.PETS, filtered)
  },

  getById: (id: string): Pet | undefined => {
    const pets = getFromStorage<Pet>(STORAGE_KEYS.PETS)
    return pets.find((p) => p.id === id)
  },
}

// Schedule storage functions
export const scheduleStorage = {
  getAll: (): Schedule[] => getFromStorage<Schedule>(STORAGE_KEYS.SCHEDULES),

  getByPetId: (petId: string): Schedule[] => {
    const schedules = getFromStorage<Schedule>(STORAGE_KEYS.SCHEDULES)
    return schedules.filter((s) => s.petId === petId)
  },

  save: (schedule: Schedule): void => {
    const schedules = getFromStorage<Schedule>(STORAGE_KEYS.SCHEDULES)
    const existingIndex = schedules.findIndex((s) => s.id === schedule.id)

    if (existingIndex >= 0) {
      schedules[existingIndex] = schedule
    } else {
      schedules.push(schedule)
    }

    saveToStorage(STORAGE_KEYS.SCHEDULES, schedules)
  },

  delete: (id: string): void => {
    const schedules = getFromStorage<Schedule>(STORAGE_KEYS.SCHEDULES)
    const filtered = schedules.filter((s) => s.id !== id)
    saveToStorage(STORAGE_KEYS.SCHEDULES, filtered)
  },
}

// Vet appointment storage functions
export const appointmentStorage = {
  getAll: (): VetAppointment[] => getFromStorage<VetAppointment>(STORAGE_KEYS.APPOINTMENTS),

  getByPetId: (petId: string): VetAppointment[] => {
    const appointments = getFromStorage<VetAppointment>(STORAGE_KEYS.APPOINTMENTS)
    return appointments.filter((a) => a.petId === petId)
  },

  save: (appointment: VetAppointment): void => {
    const appointments = getFromStorage<VetAppointment>(STORAGE_KEYS.APPOINTMENTS)
    const existingIndex = appointments.findIndex((a) => a.id === appointment.id)

    if (existingIndex >= 0) {
      appointments[existingIndex] = appointment
    } else {
      appointments.push(appointment)
    }

    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments)
  },

  delete: (id: string): void => {
    const appointments = getFromStorage<VetAppointment>(STORAGE_KEYS.APPOINTMENTS)
    const filtered = appointments.filter((a) => a.id !== id)
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, filtered)
  },

  getUpcoming: (): VetAppointment[] => {
    const appointments = getFromStorage<VetAppointment>(STORAGE_KEYS.APPOINTMENTS)
    const now = new Date()
    return appointments
      .filter((a) => new Date(a.date) >= now && a.status === "scheduled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },
}

// Vaccination storage functions
export const vaccinationStorage = {
  getAll: (): VaccinationRecord[] => getFromStorage<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS),

  getByPetId: (petId: string): VaccinationRecord[] => {
    const vaccinations = getFromStorage<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS)
    return vaccinations.filter((v) => v.petId === petId)
  },

  save: (vaccination: VaccinationRecord): void => {
    const vaccinations = getFromStorage<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS)
    const existingIndex = vaccinations.findIndex((v) => v.id === vaccination.id)

    if (existingIndex >= 0) {
      vaccinations[existingIndex] = vaccination
    } else {
      vaccinations.push(vaccination)
    }

    saveToStorage(STORAGE_KEYS.VACCINATIONS, vaccinations)
  },

  delete: (id: string): void => {
    const vaccinations = getFromStorage<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS)
    const filtered = vaccinations.filter((v) => v.id !== id)
    saveToStorage(STORAGE_KEYS.VACCINATIONS, filtered)
  },

  getDueReminders: (): VaccinationRecord[] => {
    const vaccinations = getFromStorage<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    return vaccinations.filter((v) => {
      if (!v.nextDue) return false
      const dueDate = new Date(v.nextDue)
      return dueDate <= thirtyDaysFromNow && dueDate >= now
    })
  },

  getOverdue: (): VaccinationRecord[] => {
    const vaccinations = getFromStorage<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS)
    const now = new Date()

    return vaccinations.filter((v) => {
      if (!v.nextDue) return false
      return new Date(v.nextDue) < now
    })
  },
}

// Generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
