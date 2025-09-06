export type View = "dashboard" | "add-pet" | "edit-pet" | "schedules" | "appointments" | "health" | "emergency";

export interface PetFamily {
  _id: string;
  name: string;
  user: string;
  description?: string;
  familyPhoto?: string;
  pets: Pet[] | string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PetFamilyData = Omit<PetFamily, '_id' | 'user' | 'createdAt' | 'updatedAt'>;

export type PetRole = 'parent' | 'child' | 'sibling' | 'other';

export interface Pet {
  _id: string;
  user: string;
  name: string;
  species: string;
  breed: string;
  age: string | number; // Updated to support both string and number formats
  gender: string;
  weight: number;
  microchipId?: string;
  dateOfBirth: string;
  allergies: string[];
  medicalHistory: string[];
  family?: string;
  role?: PetRole;
  relationshipNotes?: string;
  countryOfOrigin?: string;
  passport?: string;
  placeOfBirth?: string;
  identificationMark?: string;
  nickname?: string;
  custodyFrom?: 'Shelter' | 'By birth' | 'Bought new';
  registrationNumber?: string;
  aboutPet?: string;
  colorOfPet?: string;
  sizeOfPet?: string;
  createdAt: string;
  updatedAt: string;
}

export type PetData = Omit<Pet, '_id' | 'user' | 'createdAt' | 'updatedAt'>;

export interface Schedule {
  _id: string;
  user: string;
  petId: string;
  type: 'meal' | 'medicine' | 'walk' | 'exercise' | 'Medicine appointment' | 'Pet Care' | 'Pet day care';
  title: string;
  description?: string;
  dateTime: string;
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  days?: number[];
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleData = Omit<Schedule, '_id' | 'user' | 'createdAt' | 'updatedAt'>;

export interface VetAppointment {
  _id: string;
  user: string;
  petId: string;
  title: string;
  vetName: string;
  location: string;
  address: string;
  phone?: string;
  date: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  reminder?: boolean;
  reminderDetails?: {
    value: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  createdAt: string;
}

export type AppointmentData = Omit<VetAppointment, '_id' | 'user' | 'createdAt'>;

export interface VaccinationRecord {
  _id: string;
  user: string;
  petId: string
  type: "vaccine" | "flea-tick" | "deworming"
  name: string
  dateGiven: Date
  nextDue?: Date
  veterinarian: string
  notes?: string
  createdAt: Date
}

export type VaccinationData = Omit<VaccinationRecord, '_id' | 'user' | 'createdAt'>;

export interface ActivityLog {
  id: string
  petId: string
  type: "walk" | "exercise" | "meal" | "medicine"
  duration?: number // in minutes
  notes?: string
  completedAt: Date
}

export interface EmergencyVet {
  id: string
  name: string
  address: string
  phone: string
  latitude: number
  longitude: number
  isOpen24Hours: boolean
  currentlyOpen: boolean
  opensAt?: string
  closesAt?: string
  distance?: number // in miles, calculated based on user location
  rating: number
  services: string[]
}

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface FamilyMember {
  _id: string;
  user?: string;
  name: string;
  email: string;
  status: 'pending' | 'active';
  invitedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: 'admin' | 'member';
  familyAdmin?: string;
  familyMembers?: FamilyMember[];
  membershipPlan?: 'basic' | 'premium' | 'professional';
  maxFamilyMembers?: number;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface HealthRecord {
  _id: string;
  petId: string;
  type: "vaccine" | "medication" | "checkup" | "preventive";
  name: string;
  date: string;
  nextDueDate?: string;
  notes?: string;
  administeredBy?: string;
  location?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  sideEffects?: string;
  effectiveness?: "excellent" | "good" | "moderate" | "poor" | "unknown";
}

export type HealthRecordData = Omit<HealthRecord, '_id'>;

export interface DailyLog {
  _id: string;
  petId: string;
  date: string;
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  appetite?: 'normal' | 'increased' | 'decreased' | 'none';
  energyLevel?: 'high' | 'normal' | 'low';
  mood?: 'happy' | 'calm' | 'anxious' | 'lethargic' | 'aggressive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DailyLogData = Omit<DailyLog, '_id' | 'createdAt' | 'updatedAt'>;
