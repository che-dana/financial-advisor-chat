"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMarketingPlan } from '@/contexts/MarketingPlanContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { Textarea } from '@/components/ui/textarea';

export function MarketingPlanGenerator() {
  const { marketingPlans, currentPrompt, setCurrentPrompt, addMarketingPlan } = useMarketingPlan();
  const { userProfile } = useUserProfile();
  const { knowledgeBase } = useKnowledgeBase();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    try {
      // Call the marketing plan API
      const response = await fetch('/api/marketing-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          userProfile,
          knowledgeBase
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate marketing plan');
      }

      const data = await response.json();
      
      // Add the generated plan
      addMarketingPlan(data.plan);
    } catch (error) {
      console.error('Error generating marketing plan:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions for the UI display
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Plan Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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