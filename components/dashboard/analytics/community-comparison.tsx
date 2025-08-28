"use client";

import { useState, useEffect } from 'react';
import { usePetStore } from '@/lib/stores/pets';
import { useCommunityStore } from '@/lib/stores/community';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';
import { BarChart3, PawPrint } from 'lucide-react';

export function CommunityComparison() {
  const { pets, fetchPets } = usePetStore();
  const { comparisonData, isLoading, error, fetchComparison } = useCommunityStore();
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<string>('weight');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    if (selectedPet) {
      fetchComparison(selectedPet, selectedMetric, selectedSize, selectedColor);
    }
  }, [selectedPet, selectedMetric, selectedSize, selectedColor, fetchComparison]);

  const chartData = comparisonData ? [
    { 
      id: comparisonData.yourPet.name,
      label: comparisonData.yourPet.name,
      value: comparisonData.yourPet.value
    },
    {
      id: 'Community Average',
      label: 'Community Average',
      value: comparisonData.community.averageValue
    }
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card className="border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">Community {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Comparison</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
        <div className="mb-4 flex flex-wrap gap-4">
          <Select onValueChange={setSelectedPet} value={selectedPet}>
            <SelectTrigger className="w-[280px] border-amber-200 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-amber-500" />
                <SelectValue placeholder="Select a pet to compare" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-amber-200">
              {pets.map((pet) => (
                <SelectItem key={pet._id} value={pet._id} className="hover:bg-amber-50 focus:bg-amber-100">
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedMetric} value={selectedMetric}>
            <SelectTrigger className="w-[180px] border-amber-200 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors">
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent className="border-amber-200">
              <SelectItem value="weight" className="hover:bg-amber-50 focus:bg-amber-100">Weight</SelectItem>
              <SelectItem value="age" className="hover:bg-amber-50 focus:bg-amber-100">Age</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedSize} value={selectedSize}>
            <SelectTrigger className="w-[180px] border-amber-200 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent className="border-amber-200">
              <SelectItem value="all" className="hover:bg-amber-50 focus:bg-amber-100">All Sizes</SelectItem>
              <SelectItem value="Small" className="hover:bg-amber-50 focus:bg-amber-100">Small</SelectItem>
              <SelectItem value="Medium" className="hover:bg-amber-50 focus:bg-amber-100">Medium</SelectItem>
              <SelectItem value="Large" className="hover:bg-amber-50 focus:bg-amber-100">Large</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedColor} value={selectedColor}>
            <SelectTrigger className="w-[180px] border-amber-200 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent className="border-amber-200">
              <SelectItem value="all" className="hover:bg-amber-50 focus:bg-amber-100">All Colors</SelectItem>
              <SelectItem value="Black" className="hover:bg-amber-50 focus:bg-amber-100">Black</SelectItem>
              <SelectItem value="White" className="hover:bg-amber-50 focus:bg-amber-100">White</SelectItem>
              <SelectItem value="Brown" className="hover:bg-amber-50 focus:bg-amber-100">Brown</SelectItem>
              <SelectItem value="Golden" className="hover:bg-amber-50 focus:bg-amber-100">Golden</SelectItem>
              <SelectItem value="Gray" className="hover:bg-amber-50 focus:bg-amber-100">Gray</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[400px]">
          {isLoading && <p className="text-amber-700 flex items-center justify-center h-full">Loading comparison...</p>}
          {error && <p className="text-red-500 flex items-center justify-center h-full">{error}</p>}
          {comparisonData && (
            <ResponsiveBar
              data={chartData}
              keys={['value']}
              indexBy="label"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.4}
              valueScale={{ type: 'linear' }}
              colors={['#f59e0b', '#fb923c']}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Comparison',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: comparisonData.metric === 'weight' ? 'Weight (kg)' : 'Age (years)',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#92400e',
                        itemBackground: 'rgba(255, 237, 213, 0.5)'
                      }
                    }
                  ]
                }
              ]}
              animate={true}
              theme={{
                tooltip: {
                  container: {
                    background: '#fff',
                    color: '#92400e',
                    fontSize: 12,
                    borderRadius: 4,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                    padding: '5px 9px',
                    border: '1px solid #fbbf24'
                  }
                },
                axis: {
                  ticks: {
                    line: {
                      stroke: '#d97706'
                    },
                    text: {
                      fill: '#d97706'
                    }
                  },
                  legend: {
                    text: {
                      fill: '#d97706'
                    }
                  }
                }
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
