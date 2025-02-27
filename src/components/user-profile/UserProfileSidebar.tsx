"use client"

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function UserProfileSidebar() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const [expandedSections, setExpandedSections] = useState({
    personalityTraits: true,
    demographics: true,
    investmentStatus: true
  });

  const toggleSection = (section: 'personalityTraits' | 'demographics' | 'investmentStatus') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4 p-4">
      {/* Personality Traits */}
      <Card>
        <CardHeader 
          className="py-3 cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('personalityTraits')}
        >
          <CardTitle className="text-sm">Personality Traits</CardTitle>
          {expandedSections.personalityTraits ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CardHeader>
        {expandedSections.personalityTraits && (
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="openness">Openness</Label>
              <Select 
                value={userProfile.openness} 
                onValueChange={(value) => updateUserProfile({ openness: value as 'High' | 'Low' })}
              >
                <SelectTrigger id="openness">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conscientiousness">Conscientiousness</Label>
              <Select 
                value={userProfile.conscientiousness} 
                onValueChange={(value) => updateUserProfile({ conscientiousness: value as 'High' | 'Low' })}
              >
                <SelectTrigger id="conscientiousness">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extraversion">Extraversion</Label>
              <Select 
                value={userProfile.extraversion} 
                onValueChange={(value) => updateUserProfile({ extraversion: value as 'High' | 'Low' })}
              >
                <SelectTrigger id="extraversion">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agreeableness">Agreeableness</Label>
              <Select 
                value={userProfile.agreeableness} 
                onValueChange={(value) => updateUserProfile({ agreeableness: value as 'High' | 'Low' })}
              >
                <SelectTrigger id="agreeableness">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="neuroticism">Neuroticism</Label>
              <Select 
                value={userProfile.neuroticism} 
                onValueChange={(value) => updateUserProfile({ neuroticism: value as 'High' | 'Low' })}
              >
                <SelectTrigger id="neuroticism">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Demographics & Financial Status */}
      <Card>
        <CardHeader 
          className="py-3 cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('demographics')}
        >
          <CardTitle className="text-sm">Demographics & Financial Status</CardTitle>
          {expandedSections.demographics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CardHeader>
        {expandedSections.demographics && (
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select 
                value={userProfile.educationLevel} 
                onValueChange={(value) => updateUserProfile({ educationLevel: value as any })}
              >
                <SelectTrigger id="educationLevel">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                  <SelectItem value="Master's">Master's</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incomeLevel">Income Level</Label>
              <Select 
                value={userProfile.incomeLevel} 
                onValueChange={(value) => updateUserProfile({ incomeLevel: value as any })}
              >
                <SelectTrigger id="incomeLevel">
                  <SelectValue placeholder="Select level" />
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
              <Select 
                value={userProfile.housingStatus} 
                onValueChange={(value) => updateUserProfile({ housingStatus: value as any })}
              >
                <SelectTrigger id="housingStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Renting">Renting</SelectItem>
                  <SelectItem value="Own House">Own House</SelectItem>
                  <SelectItem value="Living with Family">Living with Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleOwnership">Vehicle Ownership</Label>
              <Select 
                value={userProfile.vehicleOwnership} 
                onValueChange={(value) => updateUserProfile({ vehicleOwnership: value as any })}
              >
                <SelectTrigger id="vehicleOwnership">
                  <SelectValue placeholder="Select ownership" />
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
              <Select 
                value={userProfile.workNature} 
                onValueChange={(value) => updateUserProfile({ workNature: value as any })}
              >
                <SelectTrigger id="workNature">
                  <SelectValue placeholder="Select work nature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salaried">Salaried</SelectItem>
                  <SelectItem value="Self-employed">Self-employed</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="familyDependants">Family Dependants</Label>
              <Slider
                id="familyDependants"
                min={0}
                max={10}
                step={1}
                value={[userProfile.familyDependants]}
                onValueChange={(value) => updateUserProfile({ familyDependants: value[0] })}
              />
              <div className="text-center mt-1">{userProfile.familyDependants}</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Slider
                id="age"
                min={18}
                max={100}
                step={1}
                value={[userProfile.age]}
                onValueChange={(value) => updateUserProfile({ age: value[0] })}
              />
              <div className="text-center mt-1">{userProfile.age}</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="behavioralTrait">Behavioral Trait</Label>
              <Select 
                value={userProfile.behavioralTrait} 
                onValueChange={(value) => updateUserProfile({ behavioralTrait: value as any })}
              >
                <SelectTrigger id="behavioralTrait">
                  <SelectValue placeholder="Select trait" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saver">Saver</SelectItem>
                  <SelectItem value="Spender">Spender</SelectItem>
                  <SelectItem value="Investor">Investor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Investment Product Status */}
      <Card>
        <CardHeader 
          className="py-3 cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('investmentStatus')}
        >
          <CardTitle className="text-sm">Investment Product Status</CardTitle>
          {expandedSections.investmentStatus ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CardHeader>
        {expandedSections.investmentStatus && (
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="danaPlus">DANA+</Label>
              <Select 
                value={userProfile.danaPlus} 
                onValueChange={(value) => updateUserProfile({ danaPlus: value as any })}
              >
                <SelectTrigger id="danaPlus">
                  <SelectValue placeholder="Existing User?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reksadana">Reksadana</Label>
              <Select 
                value={userProfile.reksadana} 
                onValueChange={(value) => updateUserProfile({ reksadana: value as any })}
              >
                <SelectTrigger id="reksadana">
                  <SelectValue placeholder="Existing User?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eMAS">eMAS</Label>
              <Select 
                value={userProfile.eMAS} 
                onValueChange={(value) => updateUserProfile({ eMAS: value as any })}
              >
                <SelectTrigger id="eMAS">
                  <SelectValue placeholder="Existing User?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 