"use client"

import { useState } from 'react';
import type { DailyLogData, Pet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface DailyLogFormProps {
    pet: Pet;
    onSave: (logData: DailyLogData) => void;
    onCancel: () => void;
}

export function DailyLogForm({ pet, onSave, onCancel }: DailyLogFormProps) {
    const [formData, setFormData] = useState<Omit<DailyLogData, 'petId'>>({
        date: new Date().toISOString().slice(0, 10),
        weight: { value: pet.weight || 0, unit: 'kg' },
        appetite: 'normal',
        energyLevel: 'normal',
        mood: 'happy',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            weight: { ...prev.weight!, [name]: name === 'value' ? parseFloat(value) : value },
        }));
    };

    const handleWeightUnitChange = (unit: 'kg' | 'lbs') => {
        setFormData((prev) => ({
            ...prev,
            weight: { ...prev.weight!, unit },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, petId: pet._id });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="border-amber-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                    <CardTitle className="text-lg font-bold text-amber-800">Add Daily Log for {pet.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 bg-amber-50/30 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="weightValue">Weight</Label>
                                <Input id="weightValue" name="value" type="number" value={formData.weight?.value || ''} onChange={handleWeightChange} />
                            </div>
                            <div>
                                <Label htmlFor="weightUnit">Unit</Label>
                                <Select name="unit" value={formData.weight?.unit} onValueChange={(value: 'kg' | 'lbs') => handleWeightUnitChange(value)}>
                                    <SelectTrigger id="weightUnit" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">kg</SelectItem>
                                        <SelectItem value="lbs">lbs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="appetite">Appetite</Label>
                            <Select name="appetite" value={formData.appetite} onValueChange={(value) => handleSelectChange('appetite', value)}>
                                <SelectTrigger id="appetite" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="increased">Increased</SelectItem>
                                    <SelectItem value="decreased">Decreased</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="energyLevel">Energy Level</Label>
                            <Select name="energyLevel" value={formData.energyLevel} onValueChange={(value) => handleSelectChange('energyLevel', value)}>
                                <SelectTrigger id="energyLevel" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="mood">Mood</Label>
                            <Select name="mood" value={formData.mood} onValueChange={(value) => handleSelectChange('mood', value)}>
                                <SelectTrigger id="mood" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="happy">Happy</SelectItem>
                                    <SelectItem value="calm">Calm</SelectItem>
                                    <SelectItem value="anxious">Anxious</SelectItem>
                                    <SelectItem value="lethargic">Lethargic</SelectItem>
                                    <SelectItem value="aggressive">Aggressive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-amber-50/30 border-t border-amber-100">
                    <Button type="button" variant="outline" onClick={onCancel} className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800">Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">Save Log</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
