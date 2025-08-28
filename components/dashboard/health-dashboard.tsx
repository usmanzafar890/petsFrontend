"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Syringe,
  AlertTriangle,
  Calendar,
  CheckCircle,
  HeartPulse,
  Notebook,
  ArrowLeft,
  PawPrint,
  Activity,
  Stethoscope,
} from "lucide-react";
import type {
  HealthRecord,
  Pet,
  HealthRecordData,
  DailyLog,
  DailyLogData,
} from "@/lib/types";
import { useHealthRecordStore } from "@/lib/stores/health";
import { useDailyLogStore } from "@/lib/stores/daily-logs";
import { usePetStore } from "@/lib/stores/pets";
import { HealthRecordForm } from "../health/health-record-form";
import { DailyLogForm } from "../health/daily-log-form";
import { HealthRecordCard } from "../health/health-record-card";
import { DailyLogCard } from "../health/daily-log-card";
import { StatCard } from "../shared/stat-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";

export function HealthDashboard({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<"records" | "logs">("records");
  const {
    healthRecords,
    fetchHealthRecords,
    addHealthRecord,
    editHealthRecord,
    removeHealthRecord,
  } = useHealthRecordStore();
  const { dailyLogs, fetchDailyLogs, addDailyLog } = useDailyLogStore();
  const { pets, fetchPets } = usePetStore();
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(
    null
  );
  const [selectedPet, setSelectedPet] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchHealthRecords();
    fetchPets();
  }, [fetchHealthRecords, fetchPets]);

  useEffect(() => {
    if (view === "logs" && selectedPet !== "all") {
      fetchDailyLogs(selectedPet);
    }
  }, [view, selectedPet, fetchDailyLogs]);

  const handleSaveRecord = async (data: HealthRecordData) => {
    if (selectedRecord) {
      await editHealthRecord(selectedRecord._id, data);
    } else {
      await addHealthRecord(data);
    }
    setShowRecordForm(false);
    setSelectedRecord(null);
  };

  const handleSaveLog = async (data: DailyLogData) => {
    await addDailyLog(data.petId, data);
    setShowLogForm(false);
  };

  const handleDeleteRecord = async (id: string) => {
    await removeHealthRecord(id);
  };

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const getRecordsByStatus = (records: HealthRecord[]) => {
    const overdue = records.filter(
      (r) => r.nextDueDate && new Date(r.nextDueDate) < now
    );
    const dueSoon = records.filter((r) => {
      if (!r.nextDueDate) return false;
      const dueDate = new Date(r.nextDueDate);
      return dueDate >= now && dueDate <= thirtyDaysFromNow;
    });
    return { overdue, dueSoon };
  };

  const filteredRecords = healthRecords?.filter((record) => {
    const petMatch = selectedPet === "all" || record.petId === selectedPet;
    const typeMatch = typeFilter === "all" || record.type === typeFilter;
    return petMatch && typeMatch;
  });

  const { overdue, dueSoon } = getRecordsByStatus(filteredRecords);

  const currentPet = pets?.find((p) => p._id === selectedPet);

  if (showRecordForm) {
    return (
      <HealthRecordForm
        pets={pets}
        record={selectedRecord || undefined}
        onSave={handleSaveRecord}
        onCancel={() => {
          setShowRecordForm(false);
          setSelectedRecord(null);
        }}
      />
    );
  }

  if (showLogForm && currentPet) {
    return (
      <DailyLogForm
        pet={currentPet}
        onSave={handleSaveLog}
        onCancel={() => setShowLogForm(false)}
      />
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex flex-col space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-xl">
              <Stethoscope className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                Pet Health Tracking
              </h1>
              <p className="text-muted-foreground">
                {view === "records"
                  ? "Track vaccinations, medications, and more."
                  : "Keep a daily log of your pet's well-being."}
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => {
                if (view === "records") {
                  setSelectedRecord(null);
                  setShowRecordForm(true);
                } else {
                  if (selectedPet === "all" && pets.length > 0) {
                    alert("Please select a specific pet to add a daily log.");
                    return;
                  }
                  setShowLogForm(true);
                }
              }}
              disabled={
                view === "logs" && selectedPet === "all" && pets.length > 0
              }
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              {view === "records" ? "Add Record" : "Add Log"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <div className="px-4 md:px-6 space-y-6">
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ToggleGroup
            type="single"
            defaultValue="records"
            value={view}
            onValueChange={(value: "records" | "logs") =>
              value && setView(value)
            }
            className="justify-start bg-white p-1 rounded-lg border border-amber-200 shadow-sm"
          >
            <ToggleGroupItem
              value="records"
              className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-amber-500 data-[state=on]:to-orange-500 data-[state=on]:text-white rounded-md"
            >
              <HeartPulse className="h-4 w-4 mr-2" />
              Health Records
            </ToggleGroupItem>
            <ToggleGroupItem
              value="logs"
              className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-amber-500 data-[state=on]:to-orange-500 data-[state=on]:text-white rounded-md"
            >
              <Notebook className="h-4 w-4 mr-2" />
              Daily Logs
            </ToggleGroupItem>
          </ToggleGroup>
          {pets?.length > 0 && (
            <ToggleGroup
              type="single"
              defaultValue="all"
              value={selectedPet}
              onValueChange={(value) => value && setSelectedPet(value)}
              className="justify-start bg-white p-1 rounded-lg border border-amber-200 shadow-sm overflow-x-auto flex-nowrap"
            >
              <ToggleGroupItem
                value="all"
                className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-amber-500 data-[state=on]:to-orange-500 data-[state=on]:text-white rounded-md whitespace-nowrap"
              >
                <PawPrint className="h-4 w-4 mr-2" />
                All Pets
              </ToggleGroupItem>
              {pets?.map((pet) => (
                <ToggleGroupItem
                  key={pet._id}
                  value={pet._id}
                  className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-amber-500 data-[state=on]:to-orange-500 data-[state=on]:text-white rounded-md whitespace-nowrap"
                >
                  <PawPrint className="h-4 w-4 mr-2" />
                  {pet.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {view === "records" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <StatCard
                    title="Total Records"
                    value={filteredRecords?.length || 0}
                    icon={HeartPulse}
                    className="border-amber-200 shadow-md bg-gradient-to-br from-white to-amber-50 hover:shadow-lg transition-all duration-300"
                    iconClassName="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <StatCard
                    title="Overdue"
                    value={overdue?.length || 0}
                    icon={AlertTriangle}
                    variant="destructive"
                    className="border-red-200 shadow-md bg-gradient-to-br from-white to-red-50 hover:shadow-lg transition-all duration-300"
                    iconClassName="bg-gradient-to-br from-red-100 to-red-200 text-red-600"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <StatCard
                    title="Due Soon"
                    value={dueSoon?.length || 0}
                    icon={Calendar}
                    className="border-amber-200 shadow-md bg-gradient-to-br from-white to-amber-50 hover:shadow-lg transition-all duration-300"
                    iconClassName="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <StatCard
                    title="Current"
                    value={
                      (filteredRecords?.length || 0) -
                      (overdue?.length || 0) -
                      (dueSoon?.length || 0)
                    }
                    icon={CheckCircle}
                    className="border-green-200 shadow-md bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all duration-300"
                    iconClassName="bg-gradient-to-br from-green-100 to-green-200 text-green-600"
                  />
                </motion.div>
              </div>

              {filteredRecords?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Card className="border-amber-200 shadow-md overflow-hidden">
                    <CardContent className="py-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-amber-50">
                      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mb-4 shadow-inner">
                        <Syringe className="h-8 w-8 text-amber-600" />
                      </div>
                      <p className="text-amber-700 font-medium text-lg">
                        No health records found.
                      </p>
                      <p className="text-amber-600/80 mb-6">
                        Add a record to get started.
                      </p>
                      <Button
                        onClick={() => setShowRecordForm(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRecords
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((record, index) => {
                      const pet = pets?.find((p) => p._id === record.petId);
                      if (!pet) return null;
                      return (
                        <motion.div
                          key={record._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1 * (index % 6),
                          }}
                          className="h-full"
                        >
                          <HealthRecordCard
                            record={record}
                            pet={pet}
                            onEdit={() => {
                              setSelectedRecord(record);
                              setShowRecordForm(true);
                            }}
                            onDelete={() => handleDeleteRecord(record._id)}
                            className="border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br from-white to-amber-50"
                          />
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </>
          ) : (
            <>
              {selectedPet === "all" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Card className="border-orange-200 shadow-md overflow-hidden">
                    <CardContent className="py-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-orange-50">
                      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-4 shadow-inner">
                        <PawPrint className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-orange-700 font-medium text-lg">
                        Please select a pet to view daily logs.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : dailyLogs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Card className="border-orange-200 shadow-md overflow-hidden">
                    <CardContent className="py-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-orange-50">
                      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-4 shadow-inner">
                        <Notebook className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-orange-700 font-medium text-lg">
                        No daily logs found for {currentPet?.name}.
                      </p>
                      <p className="text-orange-600/80 mb-6">
                        Add a log to get started.
                      </p>
                      <Button
                        onClick={() => setShowLogForm(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Log
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dailyLogs.map((log, index) => (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * (index % 6) }}
                      className="h-full"
                    >
                      <DailyLogCard
                        log={log}
                        pet={currentPet!}
                        className="border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br from-white to-orange-50"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
