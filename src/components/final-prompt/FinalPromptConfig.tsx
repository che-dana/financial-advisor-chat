"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFinalPrompt } from '@/contexts/FinalPromptContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function FinalPromptConfig() {
  const { finalPrompt, setFinalPrompt, savePromptVersion, promptVersions, loadPromptVersion, activePromptId, fullPromptWithContext } = useFinalPrompt();
  const { userProfile } = useUserProfile();
  const { clearMessages } = useChat();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("edit");

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
    return userProfile.workNature;
  };

  return (
    <Card className="shadow-md border-gray-200 dark:border-gray-700">
      <CardHeader 
        className="py-3 cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-sm">Final Prompt Configuration</CardTitle>
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Knowledge Base Integration</p>
              <p>The knowledge base is automatically integrated into your prompt. Use the placeholder <code className="bg-blue-100 px-1 py-0.5 rounded">[Knowledge base Product information will be inserted here]</code> to control where product details appear.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="edit">Edit Prompt</TabsTrigger>
              <TabsTrigger value="preview">Preview Full Prompt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-0">
              <Textarea
                value={finalPrompt}
                onChange={(e) => setFinalPrompt(e.target.value)}
                placeholder="Configure your final prompt..."
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 h-[200px] overflow-auto custom-scrollbar">
                <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
                  {fullPromptWithContext}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button onClick={handleSavePrompt} className="bg-blue-600 hover:bg-blue-700">
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
      )}
    </Card>
  );
} 