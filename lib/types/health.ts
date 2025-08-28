export interface HealthRecord {
  _id: string;
  type: 'vaccine' | 'medication' | 'checkup' | 'preventive';
  name: string;
  date: string;
  nextDueDate?: string;
  lotNumber?: string;
  notes?: string;
}

export interface PetHealthData {
  allergies: string[];
  medicalHistory: string[];
  healthRecords: HealthRecord[];
}
