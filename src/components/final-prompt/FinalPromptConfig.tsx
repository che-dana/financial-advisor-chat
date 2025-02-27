"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFinalPrompt } from '@/contexts/FinalPromptContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FinalPromptConfig() {
  const { finalPrompt, setFinalPrompt, savePromptVersion, promptVersions, loadPromptVersion, activePromptId } = useFinalPrompt();
  const { userProfile } = useUserProfile();
  const { clearMessages } = useChat();
  const { toast } = useToast();

  const handleSavePrompt = () => {
    savePromptVersion();
    toast({
      title: "Prompt Saved",
      description: "Your prompt has been saved successfully.",
    });
  };

  const handleReloadChat = () => {
    clearMessages();
    toast({
      title: "Chat Reloaded",
      description: "The chat has been cleared and will use the current prompt.",
    });
  };

  // Format the housing status for display
  const formatHousingStatus = () => {
    switch (userProfile.housingStatus) {
      case 'Renting': return 'Renter';
      case 'Own House': return 'Homeowner';
      case 'Living with Family': return 'Living with family';
      default: return userProfile.housingStatus;
    }
  };

  // Format the family dependents for display
  const formatFamilyDependents = () => {
    if (userProfile.familyDependants === 0) {
      return 'No dependents';
    } else if (userProfile.familyDependants === 1) {
      return '1 dependent';
    } else {
      return `${userProfile.familyDependants} dependents`;
    }
  };

  // Format the vehicle ownership for display
  const formatVehicleOwnership = () => {
    switch (userProfile.vehicleOwnership) {
      case 'None': return 'No vehicle';
      case 'Car': return 'Car owner';
      case 'Motorcycle': return 'Motorcycle owner';
      default: return userProfile.vehicleOwnership;
    }
  };

  // Format the work nature for display
  const formatWorkNature = () => {
    switch (userProfile.workNature) {
      case 'Salaried': return 'Employee';
      case 'Self-employed': return 'Self-employed';
      case 'Freelancer': return 'Freelancer';
      case 'Retired': return 'Retired';
      default: return userProfile.workNature;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Prompt Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4 p-3 bg-muted rounded-md">
          <h3 className="text-sm font-medium mb-2">Current User Profile:</h3>
          <div className="text-xs space-y-1">
            <p><strong>Personality:</strong> 
              Openness: {userProfile.openness}, 
              Conscientiousness: {userProfile.conscientiousness}, 
              Extraversion: {userProfile.extraversion}, 
              Agreeableness: {userProfile.agreeableness}, 
              Neuroticism: {userProfile.neuroticism}
            </p>
            <p><strong>Demographics:</strong> {userProfile.age} years old, {userProfile.educationLevel} education, {userProfile.incomeLevel} income</p>
            <p><strong>Living Situation:</strong> {formatHousingStatus()}, {formatVehicleOwnership()}</p>
            <p><strong>Work & Family:</strong> {formatWorkNature()}, {formatFamilyDependents()}</p>
            <p><strong>Financial Behavior:</strong> {userProfile.behavioralTrait}</p>
            <p><strong>Current Products:</strong> 
              {userProfile.danaPlus === 'Yes' ? ' DANA+' : ''} 
              {userProfile.reksadana === 'Yes' ? ' Reksadana' : ''} 
              {userProfile.eMAS === 'Yes' ? ' eMAS' : ''}
              {userProfile.danaPlus === 'No' && userProfile.reksadana === 'No' && userProfile.eMAS === 'No' ? ' None' : ''}
            </p>
          </div>
        </div>
        
        <Textarea
          value={finalPrompt}
          onChange={(e) => setFinalPrompt(e.target.value)}
          placeholder="Configure your final prompt..."
          className="min-h-[200px]"
        />
        
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button onClick={handleSavePrompt}>
              Save Prompt Version
            </Button>
            
            <Button 
              onClick={handleReloadChat} 
              variant="outline"
            >
              Reload Chat
            </Button>
          </div>
          
          {promptVersions.length > 0 && (
            <Select 
              value={activePromptId || ''} 
              onValueChange={(value) => loadPromptVersion(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Load saved prompt" />
              </SelectTrigger>
              <SelectContent>
                {promptVersions.map(version => (
                  <SelectItem key={version.id} value={version.id}>
                    {new Date(version.timestamp).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 