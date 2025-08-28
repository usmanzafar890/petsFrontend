export interface AnalyticsData {
  totalPets: number;
  totalAppointments: number;
  totalHealthRecords: number;
  petsBySpecies: { _id: string; count: number }[];
  petsByGender: { _id: string; count: number }[];
  appointmentsByStatus: { _id: string; count: number }[];
  healthRecordsByType: { _id: string; count: number }[];
  recentActivities: { _id: string; title: string; completedAt: string; petId: { name: string } }[];
  appointmentsByPet: { name: string; count: number }[];
  moodDistribution: { mood: string; count: number }[];
}
