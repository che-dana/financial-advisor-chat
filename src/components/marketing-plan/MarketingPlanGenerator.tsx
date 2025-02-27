"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMarketingPlan } from '@/contexts/MarketingPlanContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function MarketingPlanGenerator() {
  const { marketingPlans, currentPrompt, setCurrentPrompt, addMarketingPlan } = useMarketingPlan();
  const { userProfile } = useUserProfile();
  const { knowledgeBase } = useKnowledgeBase();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    try {
      // Format user profile for the prompt
      const formattedUserProfile = {
        personalityTraits: {
          openness: userProfile.openness,
          conscientiousness: userProfile.conscientiousness,
          extraversion: userProfile.extraversion,
          agreeableness: userProfile.agreeableness,
          neuroticism: userProfile.neuroticism
        },
        demographics: {
          educationLevel: userProfile.educationLevel,
          incomeLevel: userProfile.incomeLevel,
          housingStatus: userProfile.housingStatus,
          vehicleOwnership: userProfile.vehicleOwnership,
          workNature: userProfile.workNature,
          familyDependants: userProfile.familyDependants,
          age: userProfile.age,
          behavioralTrait: userProfile.behavioralTrait
        },
        investmentStatus: {
          danaPlus: userProfile.danaPlus,
          reksadana: userProfile.reksadana,
          eMAS: userProfile.eMAS
        }
      };

      // Call the marketing plan API
      const response = await fetch('/api/marketing-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          userProfile: formattedUserProfile,
          knowledgeBase
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add the marketing plan
      if (data.plan) {
        addMarketingPlan({
          bestProducts: data.plan.bestProducts,
          marketingTechnique: data.plan.marketingTechnique,
          conversationStarter: data.plan.conversationStarter,
          conversationSequence: data.plan.conversationSequence
        });
        
        toast({
          title: "Marketing Plan Generated",
          description: "Your marketing plan has been created successfully.",
        });
      }
    } catch (error) {
      console.error('Error generating marketing plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate marketing plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions to format user profile data for display
  const formatHousingStatus = () => {
    switch (userProfile.housingStatus) {
      case 'Renting': return 'Renter';
      case 'Own House': return 'Homeowner';
      case 'Living with Family': return 'Living with family';
      default: return userProfile.housingStatus;
    }
  };

  const formatFamilyDependents = () => {
    if (userProfile.familyDependants === 0) {
      return 'No dependents';
    } else if (userProfile.familyDependants === 1) {
      return '1 dependent';
    } else {
      return `${userProfile.familyDependants} dependents`;
    }
  };

  const formatVehicleOwnership = () => {
    switch (userProfile.vehicleOwnership) {
      case 'None': return 'No vehicle';
      case 'Car': return 'Car owner';
      case 'Motorcycle': return 'Motorcycle owner';
      default: return userProfile.vehicleOwnership;
    }
  };

  const formatWorkNature = () => {
    switch (userProfile.workNature) {
      case 'Salaried': return 'Salaried employee';
      case 'Self-employed': return 'Self-employed';
      case 'Freelancer': return 'Freelancer';
      case 'Retired': return 'Retired';
      default: return userProfile.workNature;
    }
  };

  // Helper functions to extract data from the latest marketing plan
  const determineProducts = () => {
    return marketingPlans.length > 0 ? marketingPlans[0].bestProducts : [];
  };

  const determineTechnique = () => {
    return marketingPlans.length > 0 ? marketingPlans[0].marketingTechnique : '';
  };

  const generateConversationStarter = () => {
    return marketingPlans.length > 0 ? marketingPlans[0].conversationStarter : '';
  };

  const generateSequence = () => {
    return marketingPlans.length > 0 ? marketingPlans[0].conversationSequence : [];
  };

  return (
    <Card className={`flex flex-col ${isCollapsed ? 'h-[80px]' : 'h-full'}`}>
      <CardHeader 
        className="py-3 cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-sm">Marketing Plan Generator</CardTitle>
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-xs">
            <div className="flex items-start gap-2">
              <div>
                <p className="font-medium mb-1">Current User Profile</p>
                <p><strong>Personality:</strong> Openness ({userProfile.openness}), Conscientiousness ({userProfile.conscientiousness}), Extraversion ({userProfile.extraversion}), Agreeableness ({userProfile.agreeableness}), Neuroticism ({userProfile.neuroticism})</p>
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
          </div>
          
          <Textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Enter your marketing prompt..."
            className="min-h-[350px] font-mono text-sm"
          />
          
          <Button 
            onClick={handleGeneratePlan} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Marketing Plan'}
          </Button>
          
          {marketingPlans.length > 0 && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Latest Marketing Plan</h3>
              <div className="border rounded-md p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium">Best Products</h4>
                  <p>{determineProducts().join(', ')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Marketing Technique</h4>
                  <p>{determineTechnique()}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Conversation Starter</h4>
                  <p>&quot;{generateConversationStarter()}&quot;</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Conversation Sequence</h4>
                  <ol className="list-decimal list-inside">
                    {generateSequence().map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
} 