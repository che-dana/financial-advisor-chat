"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function DemographicsPage() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const router = useRouter();
  const { toast } = useToast();
  
  const [age, setAge] = useState(userProfile.age || 30);
  const [educationLevel, setEducationLevel] = useState(userProfile.educationLevel || 'Undergraduate');
  const [incomeLevel, setIncomeLevel] = useState(userProfile.incomeLevel || 'Medium');
  const [housingStatus, setHousingStatus] = useState(userProfile.housingStatus || 'Renting');
  const [vehicleOwnership, setVehicleOwnership] = useState(userProfile.vehicleOwnership || 'None');
  const [workNature, setWorkNature] = useState(userProfile.workNature || 'Salaried');
  const [familyDependants, setFamilyDependants] = useState(userProfile.familyDependants || 0);
  const [behavioralTrait, setBehavioralTrait] = useState(userProfile.behavioralTrait || 'Balanced');
  
  useEffect(() => {
    setAge(userProfile.age || 30);
    setEducationLevel(userProfile.educationLevel || 'Undergraduate');
    setIncomeLevel(userProfile.incomeLevel || 'Medium');
    setHousingStatus(userProfile.housingStatus || 'Renting');
    setVehicleOwnership(userProfile.vehicleOwnership || 'None');
    setWorkNature(userProfile.workNature || 'Salaried');
    setFamilyDependants(userProfile.familyDependants || 0);
    setBehavioralTrait(userProfile.behavioralTrait || 'Balanced');
  }, [userProfile]);
  
  const handleSave = async () => {
    try {
      await updateUserProfile({
        age,
        educationLevel,
        incomeLevel,
        housingStatus,
        vehicleOwnership,
        workNature,
        familyDependants,
        behavioralTrait
      });
      
      toast({
        title: "Profile Updated",
        description: "Your demographics and financial status have been updated successfully.",
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Demographics & Financial Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              type="number" 
              value={age} 
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              min={18}
              max={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="educationLevel">Education Level</Label>
            <Select value={educationLevel} onValueChange={setEducationLevel}>
              <SelectTrigger id="educationLevel">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="incomeLevel">Income Level</Label>
            <Select value={incomeLevel} onValueChange={setIncomeLevel}>
              <SelectTrigger id="incomeLevel">
                <SelectValue placeholder="Select income level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="housingStatus">Housing Status</Label>
            <Select value={housingStatus} onValueChange={setHousingStatus}>
              <SelectTrigger id="housingStatus">
                <SelectValue placeholder="Select housing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Renting">Renting</SelectItem>
                <SelectItem value="Own House">Homeowner</SelectItem>
                <SelectItem value="Living with Family">Living with Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vehicleOwnership">Vehicle Ownership</Label>
            <Select value={vehicleOwnership} onValueChange={setVehicleOwnership}>
              <SelectTrigger id="vehicleOwnership">
                <SelectValue placeholder="Select vehicle ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workNature">Nature of Work</Label>
            <Select value={workNature} onValueChange={setWorkNature}>
              <SelectTrigger id="workNature">
                <SelectValue placeholder="Select work nature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Salaried">Salaried</SelectItem>
                <SelectItem value="Self-employed">Self-employed</SelectItem>
                <SelectItem value="Freelancer">Freelancer</SelectItem>
                <SelectItem value="Gig Worker">Gig Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="familyDependants">Number of Dependents</Label>
            <Input 
              id="familyDependants" 
              type="number" 
              value={familyDependants} 
              onChange={(e) => setFamilyDependants(parseInt(e.target.value) || 0)}
              min={0}
              max={10}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Behavioral Trait</Label>
            <RadioGroup value={behavioralTrait} onValueChange={setBehavioralTrait}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Spender" id="spender" />
                <Label htmlFor="spender">Spender</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Saver" id="saver" />
                <Label htmlFor="saver">Saver</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Risk-taker" id="risk-taker" />
                <Label htmlFor="risk-taker">Risk-taker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Risk-averse" id="risk-averse" />
                <Label htmlFor="risk-averse">Risk-averse</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Balanced" id="balanced" />
                <Label htmlFor="balanced">Balanced</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 