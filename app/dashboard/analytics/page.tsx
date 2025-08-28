"use client"

import { useEffect } from 'react';
import { useAnalyticsStore } from '@/lib/stores/analytics';
import { StatCard } from '@/components/shared/stat-card';
import { PawPrint, Calendar, HeartPulse, Activity, ChartBar } from 'lucide-react';
import { CommunityComparison } from '@/components/dashboard/analytics/community-comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { analytics, isLoading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return <div className="p-4 md:p-6 pt-16 md:pt-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-6 pt-16 md:pt-6">Error: {error}</div>;
  }

  if (!analytics) {
    return null;
  }

  const { 
    totalPets, 
    totalAppointments, 
    totalHealthRecords, 
    petsBySpecies, 
    petsByGender, 
    appointmentsByStatus, 
    healthRecordsByType, 
    recentActivities,
    appointmentsByPet,
    moodDistribution
  } = analytics;

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 bg-gradient-to-br from-amber-50/50 to-orange-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-xl">
            <ChartBar className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">Analytics Dashboard</h1>
        </motion.div>
        
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <StatCard 
            title="Total Pets" 
            value={totalPets} 
            icon={PawPrint} 
            className="border-amber-200 shadow-md bg-gradient-to-br from-white to-amber-50 hover:shadow-lg transition-all duration-300"
            iconClassName="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
          />
          <StatCard 
            title="Total Appointments" 
            value={totalAppointments} 
            icon={Calendar} 
            className="border-amber-200 shadow-md bg-gradient-to-br from-white to-amber-50 hover:shadow-lg transition-all duration-300"
            iconClassName="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
          />
          <StatCard 
            title="Total Health Records" 
            value={totalHealthRecords} 
            icon={HeartPulse} 
            className="border-amber-200 shadow-md bg-gradient-to-br from-white to-amber-50 hover:shadow-lg transition-all duration-300"
            iconClassName="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
          />
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Pets by Species</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] bg-white">
              <ResponsivePie
                data={petsBySpecies.map(d => ({ id: d._id, label: d._id, value: d.count }))}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#f59e0b', '#fbbf24', '#f97316', '#fdba74', '#ffedd5']}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              />
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Pets by Gender</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] bg-white">
              <ResponsivePie
                data={petsByGender.map(d => ({ id: d._id, label: d._id, value: d.count }))}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#f59e0b', '#fb923c', '#fdba74']}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Appointments by Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] bg-white">
              <ResponsiveBar
                data={appointmentsByStatus.map(d => ({ status: d._id, count: d.count }))}
                keys={['count']}
                indexBy="status"
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                padding={0.3}
                colors={['#f59e0b', '#fb923c', '#fdba74']}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              />
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Health Records by Type</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] bg-white">
              <ResponsiveBar
                data={healthRecordsByType.map(d => ({ type: d._id, count: d.count }))}
                keys={['count']}
                indexBy="type"
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                padding={0.3}
                colors={['#f59e0b', '#fb923c', '#fdba74', '#fcd34d', '#fbbf24']}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              />
            </CardContent>
          </Card>
        </motion.div>



        <motion.div 
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Appointments per Pet</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] bg-white">
              <ResponsiveBar
                data={appointmentsByPet}
                keys={['count']}
                indexBy="name"
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                padding={0.3}
                colors={['#f59e0b', '#fb923c', '#fdba74', '#fcd34d', '#fbbf24']}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              />
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Mood Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] bg-white">
              <ResponsivePie
                data={moodDistribution.map(d => ({ id: d.mood, label: d.mood, value: d.count }))}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#f59e0b', '#fb923c', '#fdba74', '#fcd34d', '#fbbf24']}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              />
            </CardContent>
          </Card>
        </motion.div>

        <CommunityComparison />

      </div>
    </div>
  );
}
