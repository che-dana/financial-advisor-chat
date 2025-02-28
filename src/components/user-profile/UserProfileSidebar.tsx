"use client"

import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export function UserProfileSidebar() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { toast } = useToast();
  
  // Personality traits section
  const [personalityOpen, setPersonalityOpen] = useState(false);
  const [openness, setOpenness] = useState(userProfile?.openness || 'Medium');
  const [conscientiousness, setConscientiousness] = useState(userProfile?.conscientiousness || 'Medium');
  const [extraversion, setExtraversion] = useState(userProfile?.extraversion || 'Medium');
  const [agreeableness, setAgreeableness] = useState(userProfile?.agreeableness || 'Medium');
  const [neuroticism, setNeuroticism] = useState(userProfile?.neuroticism || 'Medium');
  
  // Demographics section
  const [demographicsOpen, setDemographicsOpen] = useState(false);
  const [age, setAge] = useState(userProfile?.age || 30);
  const [educationLevel, setEducationLevel] = useState(userProfile?.educationLevel || 'Undergraduate');
  const [incomeLevel, setIncomeLevel] = useState(userProfile?.incomeLevel || 'Medium');
  const [housingStatus, setHousingStatus] = useState(userProfile?.housingStatus || 'Renting');
  const [vehicleOwnership, setVehicleOwnership] = useState(userProfile?.vehicleOwnership || 'None');
  const [workNature, setWorkNature] = useState(userProfile?.workNature || 'Salaried');
  const [familyDependants, setFamilyDependants] = useState(userProfile?.familyDependants || 0);
  const [behavioralTrait, setBehavioralTrait] = useState(userProfile?.behavioralTrait || 'Balanced');
  
  // Investments section
  const [investmentsOpen, setInvestmentsOpen] = useState(false);
  const [danaPlus, setDanaPlus] = useState(userProfile?.danaPlus === 'Yes');
  const [reksadana, setReksadana] = useState(userProfile?.reksadana === 'Yes');
  const [eMAS, setEMAS] = useState(userProfile?.eMAS === 'Yes');
  
  // Update state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setOpenness(userProfile.openness || 'Medium');
      setConscientiousness(userProfile.conscientiousness || 'Medium');
      setExtraversion(userProfile.extraversion || 'Medium');
      setAgreeableness(userProfile.agreeableness || 'Medium');
      setNeuroticism(userProfile.neuroticism || 'Medium');
      
      setAge(userProfile.age || 30);
      setEducationLevel(userProfile.educationLevel || 'Undergraduate');
      setIncomeLevel(userProfile.incomeLevel || 'Medium');
      setHousingStatus(userProfile.housingStatus || 'Renting');
      setVehicleOwnership(userProfile.vehicleOwnership || 'None');
      setWorkNature(userProfile.workNature || 'Salaried');
      setFamilyDependants(userProfile.familyDependants || 0);
      setBehavioralTrait(userProfile.behavioralTrait || 'Balanced');
      
      setDanaPlus(userProfile.danaPlus === 'Yes');
      setReksadana(userProfile.reksadana === 'Yes');
      setEMAS(userProfile.eMAS === 'Yes');
    }
  }, [userProfile]);
  
  // Save personality traits
  const savePersonality = async () => {
    try {
      await updateUserProfile({
        openness,
        conscientiousness,
        extraversion,
        agreeableness,
        neuroticism
      });
      
      toast({
        title: "Personality Saved",
        description: "Your personality traits have been updated.",
      });
    } catch (error) {
      console.error('Error saving personality:', error);
      toast({
        title: "Error",
        description: "Failed to save personality traits.",
        variant: "destructive",
      });
    }
  };
  
  // Save demographics
  const saveDemographics = async () => {
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
        title: "Demographics Saved",
        description: "Your demographic information has been updated.",
      });
    } catch (error) {
      console.error('Error saving demographics:', error);
      toast({
        title: "Error",
        description: "Failed to save demographic information.",
        variant: "destructive",
      });
    }
  };
  
  // Save investments
  const saveInvestments = async () => {
    try {
      await updateUserProfile({
        danaPlus: danaPlus ? 'Yes' : 'No',
        reksadana: reksadana ? 'Yes' : 'No',
        eMAS: eMAS ? 'Yes' : 'No'
      });
      
      toast({
        title: "Investments Saved",
        description: "Your investment products have been updated.",
      });
    } catch (error) {
      console.error('Error saving investments:', error);
      toast({
        title: "Error",
        description: "Failed to save investment products.",
        variant: "destructive",
      });
    }
  };
  
  if (!userProfile) {
    return <div className="p-4 text-sm text-gray-500">Loading user profile...</div>;
  }
  
  return (
    <div className="p-3 space-y-3">
      {/* Personality Traits Section */}
      <Collapsible 
        open={personalityOpen} 
        onOpenChange={setPersonalityOpen}
        className="border rounded-md overflow-hidden"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="font-medium">Personality Traits</span>
          {personalityOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="openness">Openness</Label>
            <Select value={openness} onValueChange={setOpenness}>
              <SelectTrigger id="openness">
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
            <Label htmlFor="conscientiousness">Conscientiousness</Label>
            <Select value={conscientiousness} onValueChange={setConscientiousness}>
              <SelectTrigger id="conscientiousness">
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
            <Label htmlFor="extraversion">Extraversion</Label>
            <Select value={extraversion} onValueChange={setExtraversion}>
              <SelectTrigger id="extraversion">
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
            <Label htmlFor="agreeableness">Agreeableness</Label>
            <Select value={agreeableness} onValueChange={setAgreeableness}>
              <SelectTrigger id="agreeableness">
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
            <Label htmlFor="neuroticism">Neuroticism</Label>
            <Select value={neuroticism} onValueChange={setNeuroticism}>
              <SelectTrigger id="neuroticism">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button onClick={savePersonality} size="sm">Save</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Demographics Section */}
      <Collapsible 
        open={demographicsOpen} 
        onOpenChange={setDemographicsOpen}
        className="border rounded-md overflow-hidden"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="font-medium">Demographics</span>
          {demographicsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 space-y-3">
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
                <SelectValue placeholder="Select level" />
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
            <Select value={housingStatus} onValueChange={setHousingStatus}>
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
            <Select value={vehicleOwnership} onValueChange={setVehicleOwnership}>
              <SelectTrigger id="vehicleOwnership">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">No Car</SelectItem>
                <SelectItem value="Car">Owns a Car</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workNature">Nature of Work</Label>
            <Select value={workNature} onValueChange={setWorkNature}>
              <SelectTrigger id="workNature">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Salaried">Salaried Employee</SelectItem>
                <SelectItem value="Freelancer">Freelancer</SelectItem>
                <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                <SelectItem value="Gig Worker">Gig Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="familyDependants">Family Dependants</Label>
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
            <RadioGroup value={behavioralTrait} onValueChange={setBehavioralTrait} className="space-y-1">
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
          
          <div className="flex justify-end pt-2">
            <Button onClick={saveDemographics} size="sm">Save</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Investments Section */}
      <Collapsible 
        open={investmentsOpen} 
        onOpenChange={setInvestmentsOpen}
        className="border rounded-md overflow-hidden"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="font-medium">Investment Products</span>
          {investmentsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="danaPlus" className="text-base">DANA+</Label>
              <p className="text-sm text-muted-foreground">High-interest savings</p>
            </div>
            <Switch 
              id="danaPlus" 
              checked={danaPlus} 
              onCheckedChange={setDanaPlus} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reksadana" className="text-base">Reksa Dana</Label>
              <p className="text-sm text-muted-foreground">Mutual funds</p>
            </div>
            <Switch 
              id="reksadana" 
              checked={reksadana} 
              onCheckedChange={setReksadana} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emas" className="text-base">eMAS</Label>
              <p className="text-sm text-muted-foreground">Gold investment product</p>
            </div>
            <Switch 
              id="emas" 
              checked={eMAS} 
              onCheckedChange={setEMAS} 
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button onClick={saveInvestments} size="sm">Save</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
} 