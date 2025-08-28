"use client"

import type { DailyLog, Pet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PawPrint, Calendar, Activity, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyLogCardProps {
  log: DailyLog;
  pet: Pet;
  className?: string;
}

export function DailyLogCard({ log, pet, className }: DailyLogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
    <Card className={`${className || ''} border-amber-200 shadow-md hover:shadow-lg transition-all`}>
      <div className={`h-1 w-full bg-gradient-to-r from-amber-300 to-orange-300`}></div>
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-amber-200 to-orange-200 p-2 rounded-xl shadow-sm">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <CardTitle className="text-amber-800">{format(new Date(log.date), 'PPP')}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1 text-amber-600">
          <PawPrint className="w-3 h-3" />
          <span>Daily log for {pet?.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-gradient-to-br from-amber-50/30 to-orange-50/20 p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {log.weight?.value && (
            <div>
              <p className="font-semibold text-amber-800 flex items-center gap-1">
                <Activity className="w-4 h-4 text-amber-600" />
                Weight
              </p>
              <p className="text-amber-700">{log.weight.value} {log.weight.unit}</p>
            </div>
          )}
          {log.appetite && (
            <div>
              <p className="font-semibold text-amber-800 flex items-center gap-1">
                <Activity className="w-4 h-4 text-amber-600" />
                Appetite
              </p>
              <Badge variant="outline" className="border-amber-300 text-amber-700">{log.appetite}</Badge>
            </div>
          )}
          {log.energyLevel && (
            <div>
              <p className="font-semibold text-amber-800 flex items-center gap-1">
                <Activity className="w-4 h-4 text-amber-600" />
                Energy Level
              </p>
              <Badge variant="outline" className="border-amber-300 text-amber-700">{log.energyLevel}</Badge>
            </div>
          )}
          {log.mood && (
            <div>
              <p className="font-semibold text-amber-800 flex items-center gap-1">
                <Smile className="w-4 h-4 text-amber-600" />
                Mood
              </p>
              <Badge variant="outline" className="border-amber-300 text-amber-700">{log.mood}</Badge>
            </div>
          )}
        </div>
        {log.notes && (
          <div>
            <p className="font-semibold text-amber-800 flex items-center gap-1">
              <PawPrint className="w-4 h-4 text-amber-600" />
              Notes
            </p>
            <p className="text-sm text-amber-700 bg-amber-50/30 p-3 rounded-md border border-amber-200/50">{log.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
