"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  PawPrint,
  Bell,
  ArrowLeft,
  CalendarClock,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
} from "lucide-react";
import type { Schedule, Pet, ScheduleData } from "@/lib/types";
import { useScheduleStore } from "@/lib/stores/schedules";
import { usePetStore } from "@/lib/stores/pets";
import { ScheduleForm } from "../schedule/schedule-form";
import { ScheduleCard } from "../schedule/schedule-card";

import { StatCard } from "../shared/stat-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";

export function ScheduleDashboard({ onBack }: { onBack: () => void }) {
  const {
    schedules,
    fetchSchedules,
    addSchedule,
    editSchedule,
    removeSchedule,
    completeSchedule,
  } = useScheduleStore();
  const { pets, fetchPets } = usePetStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [selectedPet, setSelectedPet] = useState<string>("all");

  useEffect(() => {
    fetchSchedules();
    fetchPets();
  }, [fetchSchedules, fetchPets]);

  const handleSaveSchedule = async (data: ScheduleData) => {
    if (selectedSchedule) {
      await editSchedule(selectedSchedule._id, data);
    } else {
      await addSchedule(data);
    }
    setShowForm(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = async (id: string) => {
    await removeSchedule(id);
  };

  const handleCompleteActivity = async (schedule: Schedule) => {
    await completeSchedule(schedule._id);
  };

  const filteredSchedules =
    selectedPet === "all"
      ? schedules
      : schedules?.filter((s) => s.petId === selectedPet);
  const activeSchedules = filteredSchedules?.filter((s) => s.isActive);
  const inactiveSchedules = filteredSchedules?.filter((s) => !s.isActive);

  const todaySchedules = activeSchedules?.filter((s) => {
    if (s.frequency === "daily") return true;
    if (s.frequency === "weekly") {
      const today = new Date().getDay();
      return s.days?.includes(today) || false;
    }
    return false;
  });

  if (showForm) {
    return (
      <ScheduleForm
        pets={pets}
        schedule={selectedSchedule || undefined}
        onSave={handleSaveSchedule}
        onCancel={() => {
          setShowForm(false);
          setSelectedSchedule(null);
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 -ml-3"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-xl">
              <CalendarClock className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">Schedules & Reminders</h1>
              <p className="text-muted-foreground">Manage feeding, medicine, and exercise schedules for your pets.</p>
            </div>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard title="Total Schedules" value={schedules?.length || 0} icon={Calendar} />
        <StatCard title="Today's Tasks" value={todaySchedules?.length || 0} icon={Clock} />
        <StatCard title="Active" value={activeSchedules?.length || 0} icon={CheckCircle} />
        <StatCard title="Inactive" value={inactiveSchedules?.length || 0} icon={CheckCircle} />
      </div>

      {pets.length > 1 && (
        <motion.div
          className="pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <PawPrint className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-medium text-amber-800">Filter by Pet</h3>
          </div>
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            <ToggleGroup
              type="single"
              defaultValue="all"
              value={selectedPet}
              onValueChange={(value) => value && setSelectedPet(value)}
              className="justify-start flex-wrap gap-2"
            >
              <ToggleGroupItem
                value="all"
                className="data-[state=on]:bg-amber-500 data-[state=on]:text-white hover:bg-amber-100 hover:text-amber-800 px-3 py-1"
              >
                <PawPrint className="w-3 h-3 mr-1.5" />
                All Pets
              </ToggleGroupItem>
              {pets.map((pet) => {
                const PetIcon =
                  pet.species === "dog"
                    ? Dog
                    : pet.species === "cat"
                    ? Cat
                    : pet.species === "bird"
                    ? Bird
                    : pet.species === "rabbit"
                    ? Rabbit
                    : pet.species === "fish"
                    ? Fish
                    : PawPrint;

                return (
                  <ToggleGroupItem
                    key={pet._id}
                    value={pet._id}
                    className="data-[state=on]:bg-amber-500 data-[state=on]:text-white hover:bg-amber-100 hover:text-amber-800 px-3 py-1"
                  >
                    <PetIcon className="w-3 h-3 mr-1.5" />
                    {pet.name}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        </motion.div>
      )}

      <div className="space-y-8">
        {todaySchedules?.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-1.5 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-amber-800">Today's Schedule</h2>
            </div>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {todaySchedules
                ?.sort((a, b) => a.dateTime.localeCompare(b.dateTime))
                ?.map((schedule) => {
                  const pet = pets.find((p) => p._id === schedule.petId);
                  if (!pet) return null;
                  return (
                    <ScheduleCard
                      key={schedule._id}
                      schedule={schedule}
                      pet={pet}
                      onEdit={() => {
                        setSelectedSchedule(schedule);
                        setShowForm(true);
                      }}
                      onDelete={() => handleDeleteSchedule(schedule._id)}
                      onComplete={() => handleCompleteActivity(schedule)}
                    />
                  );
                })}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-1.5 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-amber-800">All Schedules</h2>
          </div>
          {filteredSchedules?.length === 0 ? (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-white">
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mb-4"
                >
                  <Calendar className="h-8 w-8 text-amber-500" />
                </motion.div>
                <p className="text-amber-800 font-medium">No schedules found.</p>
                <p className="text-sm text-amber-600/70 mb-6">Create a schedule to get started.</p>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Schedule
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchedules
                ?.sort((a, b) => a.dateTime.localeCompare(b.dateTime))
                ?.map((schedule) => {
                  const pet = pets.find((p) => p._id === schedule.petId);
                  if (!pet) return null;
                  return (
                    <ScheduleCard
                      key={schedule._id}
                      schedule={schedule}
                      pet={pet}
                      onEdit={() => {
                        setSelectedSchedule(schedule);
                        setShowForm(true);
                      }}
                      onDelete={() => handleDeleteSchedule(schedule._id)}
                      onComplete={() => handleCompleteActivity(schedule)}
                    />
                  );
                })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
