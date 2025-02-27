"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMarketingPlan } from '@/contexts/MarketingPlanContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function MarketingPlanGenerator() {
  const { 
    marketingPlans, 
    currentPrompt, 
    selectedComponents,
    setCurrentPrompt, 
    addMarketingPlan,
    toggleComponentSelection,
    setAllComponentsSelection
  } = useMarketingPlan();
  const { userProfile } = useUserProfile();
  const { knowledgeBase } = useKnowledgeBase();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { toast } = useToast();

  // Check if all components are selected
  const areAllComponentsSelected = () => {
    return (
      selectedComponents.bestProducts &&
      selectedComponents.marketingTechnique &&
      selectedComponents.conversationStarter &&
      selectedComponents.conversationSequence
    );
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    setAllComponentsSelection(checked);
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

  const formatPersonalityTraits = () => {
    const traits = [
      { name: 'Openness', value: userProfile.openness },
      { name: 'Conscientiousness', value: userProfile.conscientiousness },
      { name: 'Extraversion', value: userProfile.extraversion },
      { name: 'Agreeableness', value: userProfile.agreeableness },
      { name: 'Neuroticism', value: userProfile.neuroticism }
    ];
    
    return traits.map(trait => `${trait.name} (${trait.value})`).join(', ');
  };

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
        throw new Error('Failed to generate marketing plan');
      }

      const data = await response.json();
      
      // Add the marketing plan to the context
      addMarketingPlan(data.plan);
      
      toast({
        title: "Marketing Plan Generated",
        description: "Your marketing plan has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating marketing plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate marketing plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const displayBestProducts = () => {
    if (marketingPlans.length === 0 || !marketingPlans[0].bestProducts) {
      return <li>No products selected</li>;
    }
    
    return marketingPlans[0].bestProducts.map((product, index) => (
      <li key={index}>{product}</li>
    ));
  };

  const displayMarketingTechnique = () => {
    if (marketingPlans.length === 0) {
      return "No marketing technique generated";
    }
    
    return marketingPlans[0].marketingTechnique || "No marketing technique generated";
  };

  const displayConversationStarter = () => {
    if (marketingPlans.length === 0) {
      return "No conversation starter generated";
    }
    
    return marketingPlans[0].conversationStarter || "No conversation starter generated";
  };

  const displayConversationSequence = () => {
    if (marketingPlans.length === 0 || !marketingPlans[0].conversationSequence) {
      return <li>No conversation sequence generated</li>;
    }
    
    return marketingPlans[0].conversationSequence.map((step, index) => (
      <li key={index}>{step}</li>
    ));
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
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/20 rounded-md p-3 flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Current User Profile</h4>
              <div className="text-xs text-gray-800 dark:text-gray-200 mt-1 space-y-1">
                <p><strong>Personality:</strong> {formatPersonalityTraits()}</p>
                <p><strong>Demographics:</strong> {userProfile.age} years old, {userProfile.educationLevel} education, {userProfile.incomeLevel} income</p>
                <p><strong>Living Situation:</strong> {formatHousingStatus()}, {formatVehicleOwnership()}</p>
                <p><strong>Work & Family:</strong> {userProfile.workNature} employee, {formatFamilyDependents()}</p>
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
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Latest Marketing Plan</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all-components" 
                    checked={areAllComponentsSelected()}
                    onCheckedChange={handleSelectAllChange}
                  />
                  <Label htmlFor="select-all-components" className="text-sm">
                    Select All
                  </Label>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="best-products" 
                    checked={selectedComponents.bestProducts}
                    onCheckedChange={() => toggleComponentSelection('bestProducts')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="best-products" className="text-sm font-medium">Best Products</Label>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {displayBestProducts()}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="marketing-technique" 
                    checked={selectedComponents.marketingTechnique}
                    onCheckedChange={() => toggleComponentSelection('marketingTechnique')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="marketing-technique" className="text-sm font-medium">Marketing Technique</Label>
                    <p className="text-sm mt-1">{displayMarketingTechnique()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="conversation-starter" 
                    checked={selectedComponents.conversationStarter}
                    onCheckedChange={() => toggleComponentSelection('conversationStarter')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="conversation-starter" className="text-sm font-medium">Conversation Starter</Label>
                    <p className="text-sm mt-1">&quot;{displayConversationStarter()}&quot;</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="conversation-sequence" 
                    checked={selectedComponents.conversationSequence}
                    onCheckedChange={() => toggleComponentSelection('conversationSequence')}
                  />
                  <div className="flex-1">
                    <Label htmlFor="conversation-sequence" className="text-sm font-medium">Conversation Sequence</Label>
                    <ol className="list-decimal list-inside space-y-2 text-sm mt-1">
                      {displayConversationSequence()}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
} 