"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMarketingPlan } from '@/contexts/MarketingPlanContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export function MarketingPlanGenerator() {
  const { marketingPlans, currentPrompt, setCurrentPrompt, addMarketingPlan } = useMarketingPlan();
  const { userProfile } = useUserProfile();
  const { knowledgeBase } = useKnowledgeBase();
  const [isGenerating, setIsGenerating] = useState(false);
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate marketing plan');
      }

      const data = await response.json();
      
      // Add the generated plan
      addMarketingPlan(data.plan);
      
      toast({
        title: "Marketing Plan Generated",
        description: "Your marketing plan has been successfully created.",
      });
    } catch (error) {
      console.error('Error generating marketing plan:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const determineProducts = () => {
    return marketingPlans[0]?.bestProducts || [];
  };

  const determineTechnique = () => {
    return marketingPlans[0]?.marketingTechnique || '';
  };

  const generateConversationStarter = () => {
    return marketingPlans[0]?.conversationStarter || '';
  };

  const generateSequence = () => {
    return marketingPlans[0]?.conversationSequence || [];
  };

  // Format the family dependents display
  const formatFamilyDependents = () => {
    if (userProfile.familyDependants === 0) {
      return 'No dependents';
    } else if (userProfile.familyDependants === 1) {
      return '1 dependent';
    } else {
      return `${userProfile.familyDependants} dependents`;
    }
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
        <CardTitle>Marketing Plan Generator</CardTitle>
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
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder="Enter your marketing prompt..."
          className="min-h-[100px]"
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
    </Card>
  );
} 