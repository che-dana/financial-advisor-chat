"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFinalPrompt } from '@/contexts/FinalPromptContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Info, CheckCircle2, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketingPlan } from '@/contexts/MarketingPlanContext';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { Separator } from '@/components/ui/separator';

export function FinalPromptConfig() {
  const { finalPrompt, setFinalPrompt, savePromptVersion, promptVersions, loadPromptVersion, activePromptId, fullPromptWithContext } = useFinalPrompt();
  const { userProfile } = useUserProfile();
  const { clearMessages } = useChat();
  const { toast } = useToast();
  const { getSelectedComponentsText, selectedComponents, marketingPlans } = useMarketingPlan();
  const { knowledgeBase } = useKnowledgeBase();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [includeKnowledgeBase, setIncludeKnowledgeBase] = useState(false);

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
      case 'Salaried': return 'Salaried employee';
      case 'Self-employed': return 'Self-employed';
      case 'Freelancer': return 'Freelancer';
      case 'Retired': return 'Retired';
      default: return userProfile.workNature;
    }
  };

  // Format personality traits for display
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

  // Get knowledge base text for the prompt
  const getKnowledgeBaseText = () => {
    if (!includeKnowledgeBase || !knowledgeBase) return '';
    
    let text = 'Product Information:\n\n';
    
    // Add DANA+ information
    if (knowledgeBase.danaPlus) {
      text += 'DANA+:\n';
      text += `- Description: ${knowledgeBase.danaPlus.description || ''}\n`;
      text += `- Features: ${knowledgeBase.danaPlus.features || ''}\n`;
      text += `- Benefits: ${knowledgeBase.danaPlus.benefits || ''}\n`;
      text += `- Target Audience: ${knowledgeBase.danaPlus.targetAudience || ''}\n`;
      text += `- Risk Level: ${knowledgeBase.danaPlus.riskLevel || ''}\n`;
      text += `- Minimum Investment: ${knowledgeBase.danaPlus.minimumInvestment || ''}\n`;
      text += `- Return Rate: ${knowledgeBase.danaPlus.returnRate || ''}\n`;
      
      if (knowledgeBase.danaPlus.historicalPerformance) {
        text += `- Historical Performance: ${knowledgeBase.danaPlus.historicalPerformance || ''}\n`;
      }
      
      if (knowledgeBase.danaPlus.faqs) {
        text += `- FAQs: ${knowledgeBase.danaPlus.faqs || ''}\n`;
      }
      
      if (knowledgeBase.danaPlus.additionalInfo) {
        text += `- Additional Information: ${knowledgeBase.danaPlus.additionalInfo || ''}\n`;
      }
      
      text += '\n';
    }
    
    // Add eMAS information (similar structure)
    if (knowledgeBase.eMAS) {
      text += 'eMAS:\n';
      text += `- Description: ${knowledgeBase.eMAS.description || ''}\n`;
      text += `- Features: ${knowledgeBase.eMAS.features || ''}\n`;
      text += `- Benefits: ${knowledgeBase.eMAS.benefits || ''}\n`;
      text += `- Target Audience: ${knowledgeBase.eMAS.targetAudience || ''}\n`;
      text += `- Risk Level: ${knowledgeBase.eMAS.riskLevel || ''}\n`;
      text += `- Minimum Investment: ${knowledgeBase.eMAS.minimumInvestment || ''}\n`;
      text += `- Return Rate: ${knowledgeBase.eMAS.returnRate || ''}\n`;
      
      if (knowledgeBase.eMAS.historicalPerformance) {
        text += `- Historical Performance: ${knowledgeBase.eMAS.historicalPerformance || ''}\n`;
      }
      
      if (knowledgeBase.eMAS.faqs) {
        text += `- FAQs: ${knowledgeBase.eMAS.faqs || ''}\n`;
      }
      
      if (knowledgeBase.eMAS.additionalInfo) {
        text += `- Additional Information: ${knowledgeBase.eMAS.additionalInfo || ''}\n`;
      }
      
      text += '\n';
    }
    
    // Add Reksadana information (similar structure)
    if (knowledgeBase.reksadana) {
      text += 'Reksadana:\n';
      text += `- Description: ${knowledgeBase.reksadana.description || ''}\n`;
      text += `- Features: ${knowledgeBase.reksadana.features || ''}\n`;
      text += `- Benefits: ${knowledgeBase.reksadana.benefits || ''}\n`;
      text += `- Target Audience: ${knowledgeBase.reksadana.targetAudience || ''}\n`;
      text += `- Risk Level: ${knowledgeBase.reksadana.riskLevel || ''}\n`;
      text += `- Minimum Investment: ${knowledgeBase.reksadana.minimumInvestment || ''}\n`;
      text += `- Return Rate: ${knowledgeBase.reksadana.returnRate || ''}\n`;
      
      if (knowledgeBase.reksadana.historicalPerformance) {
        text += `- Historical Performance: ${knowledgeBase.reksadana.historicalPerformance || ''}\n`;
      }
      
      if (knowledgeBase.reksadana.faqs) {
        text += `- FAQs: ${knowledgeBase.reksadana.faqs || ''}\n`;
      }
      
      if (knowledgeBase.reksadana.additionalInfo) {
        text += `- Additional Information: ${knowledgeBase.reksadana.additionalInfo || ''}\n`;
      }
      
      text += '\n';
    }
    
    return text;
  };

  // Update the final prompt when user profile, selected components, or knowledge base inclusion changes
  useEffect(() => {
    const selectedComponentsText = getSelectedComponentsText();
    const knowledgeBaseText = getKnowledgeBaseText();
    
    const prompt = `
You are Dana, a financial advisor for DANA, an Indonesian fintech company. 
You are speaking with a user with the following profile:

Personality: ${formatPersonalityTraits()}
Demographics: ${userProfile.age} years old, ${userProfile.educationLevel} education, ${userProfile.incomeLevel} income
Living Situation: ${formatHousingStatus()}, ${formatVehicleOwnership()}
Work & Family: ${formatWorkNature()}, ${formatFamilyDependents()}
Financial Behavior: ${userProfile.behavioralTrait}
Current Products: ${userProfile.danaPlus === 'Yes' ? 'DANA+ ' : ''}${userProfile.reksadana === 'Yes' ? 'Reksadana ' : ''}${userProfile.eMAS === 'Yes' ? 'eMAS' : ''}${userProfile.danaPlus === 'No' && userProfile.reksadana === 'No' && userProfile.eMAS === 'No' ? 'None' : ''}

${selectedComponentsText ? `Marketing Plan Information:\n${selectedComponentsText}\n` : ''}
${knowledgeBaseText}
Provide financial advice tailored to this user's profile and needs. Be conversational and empathetic.
`.trim();

    setFinalPrompt(prompt);
  }, [userProfile, getSelectedComponentsText, includeKnowledgeBase, knowledgeBase]);

  // Add this effect to notify users when knowledge base changes
  useEffect(() => {
    if (includeKnowledgeBase && knowledgeBase) {
      toast({
        title: "Knowledge Base Updated",
        description: "Product information has been updated in your prompt.",
        variant: "default",
        duration: 3000,
      });
    }
  }, [knowledgeBase]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPrompt);
    toast({
      title: "Copied to Clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  // Helper function to display selected marketing plan components
  const renderSelectedMarketingComponents = () => {
    if (marketingPlans.length === 0) {
      return (
        <p className="text-sm text-gray-500 italic">No marketing plan generated yet.</p>
      );
    }

    const plan = marketingPlans[0];
    
    return (
      <div className="space-y-2 text-xs">
        {selectedComponents.bestProducts && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Best Products</p>
              <ul className="list-disc list-inside pl-1 mt-0.5">
                {plan.bestProducts.map((product, index) => (
                  <li key={index}>{product}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {selectedComponents.marketingTechnique && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Marketing Technique</p>
              <p className="mt-0.5">{plan.marketingTechnique}</p>
            </div>
          </div>
        )}
        
        {selectedComponents.conversationStarter && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Conversation Starter</p>
              <p className="mt-0.5">"{plan.conversationStarter}"</p>
            </div>
          </div>
        )}
        
        {selectedComponents.conversationSequence && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Conversation Sequence</p>
              <ol className="list-decimal list-inside pl-1 mt-0.5">
                {plan.conversationSequence.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
        
        {!selectedComponents.bestProducts && 
         !selectedComponents.marketingTechnique && 
         !selectedComponents.conversationStarter && 
         !selectedComponents.conversationSequence && (
          <p className="text-sm text-gray-500 italic">No marketing plan components selected.</p>
        )}
      </div>
    );
  };

  // Helper function to display knowledge base information
  const renderKnowledgeBaseInfo = () => {
    if (!knowledgeBase) {
      return (
        <p className="text-sm text-gray-500 italic">Knowledge base not available.</p>
      );
    }
    
    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <p className="font-medium">Include Product Information</p>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-knowledge-base"
              checked={includeKnowledgeBase}
              onChange={() => setIncludeKnowledgeBase(!includeKnowledgeBase)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="include-knowledge-base" className="text-xs">
              {includeKnowledgeBase ? 'Included' : 'Not included'}
            </label>
          </div>
        </div>
        
        {includeKnowledgeBase && (
          <>
            {/* DANA+ */}
            {knowledgeBase.danaPlus && (
              <div className="border-l-2 border-purple-400 pl-2">
                <p className="font-medium">DANA+</p>
                <div className="mt-1 space-y-1">
                  <p><strong>Description:</strong> {knowledgeBase.danaPlus.description || ''}</p>
                  <p><strong>Features:</strong> {knowledgeBase.danaPlus.features || ''}</p>
                  <p><strong>Benefits:</strong> {knowledgeBase.danaPlus.benefits || ''}</p>
                  <p><strong>Target Audience:</strong> {knowledgeBase.danaPlus.targetAudience || ''}</p>
                  <p><strong>Risk Level:</strong> {knowledgeBase.danaPlus.riskLevel || ''}</p>
                  <p><strong>Minimum Investment:</strong> {knowledgeBase.danaPlus.minimumInvestment || ''}</p>
                  <p><strong>Return Rate:</strong> {knowledgeBase.danaPlus.returnRate || ''}</p>
                  
                  {knowledgeBase.danaPlus.historicalPerformance && (
                    <p><strong>Historical Performance:</strong> {knowledgeBase.danaPlus.historicalPerformance}</p>
                  )}
                  
                  {knowledgeBase.danaPlus.faqs && (
                    <p><strong>FAQs:</strong> {knowledgeBase.danaPlus.faqs}</p>
                  )}
                  
                  {knowledgeBase.danaPlus.additionalInfo && (
                    <p><strong>Additional Information:</strong> {knowledgeBase.danaPlus.additionalInfo}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* eMAS */}
            {knowledgeBase.eMAS && (
              <div className="border-l-2 border-yellow-400 pl-2">
                <p className="font-medium">eMAS</p>
                <div className="mt-1 space-y-1">
                  <p><strong>Description:</strong> {knowledgeBase.eMAS.description || ''}</p>
                  <p><strong>Features:</strong> {knowledgeBase.eMAS.features || ''}</p>
                  <p><strong>Benefits:</strong> {knowledgeBase.eMAS.benefits || ''}</p>
                  <p><strong>Target Audience:</strong> {knowledgeBase.eMAS.targetAudience || ''}</p>
                  <p><strong>Risk Level:</strong> {knowledgeBase.eMAS.riskLevel || ''}</p>
                  <p><strong>Minimum Investment:</strong> {knowledgeBase.eMAS.minimumInvestment || ''}</p>
                  <p><strong>Return Rate:</strong> {knowledgeBase.eMAS.returnRate || ''}</p>
                  
                  {knowledgeBase.eMAS.historicalPerformance && (
                    <p><strong>Historical Performance:</strong> {knowledgeBase.eMAS.historicalPerformance}</p>
                  )}
                  
                  {knowledgeBase.eMAS.faqs && (
                    <p><strong>FAQs:</strong> {knowledgeBase.eMAS.faqs}</p>
                  )}
                  
                  {knowledgeBase.eMAS.additionalInfo && (
                    <p><strong>Additional Information:</strong> {knowledgeBase.eMAS.additionalInfo}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Reksadana */}
            {knowledgeBase.reksadana && (
              <div className="border-l-2 border-blue-400 pl-2">
                <p className="font-medium">Reksadana</p>
                <div className="mt-1 space-y-1">
                  <p><strong>Description:</strong> {knowledgeBase.reksadana.description || ''}</p>
                  <p><strong>Features:</strong> {knowledgeBase.reksadana.features || ''}</p>
                  <p><strong>Benefits:</strong> {knowledgeBase.reksadana.benefits || ''}</p>
                  <p><strong>Target Audience:</strong> {knowledgeBase.reksadana.targetAudience || ''}</p>
                  <p><strong>Risk Level:</strong> {knowledgeBase.reksadana.riskLevel || ''}</p>
                  <p><strong>Minimum Investment:</strong> {knowledgeBase.reksadana.minimumInvestment || ''}</p>
                  <p><strong>Return Rate:</strong> {knowledgeBase.reksadana.returnRate || ''}</p>
                  
                  {knowledgeBase.reksadana.historicalPerformance && (
                    <p><strong>Historical Performance:</strong> {knowledgeBase.reksadana.historicalPerformance}</p>
                  )}
                  
                  {knowledgeBase.reksadana.faqs && (
                    <p><strong>FAQs:</strong> {knowledgeBase.reksadana.faqs}</p>
                  )}
                  
                  {knowledgeBase.reksadana.additionalInfo && (
                    <p><strong>Additional Information:</strong> {knowledgeBase.reksadana.additionalInfo}</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <Card className={`flex flex-col ${isCollapsed ? 'h-[80px]' : 'h-full'}`}>
      <CardHeader 
        className="py-3 cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-sm">Final Prompt Configuration</CardTitle>
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-gray-50 dark:bg-gray-800/20 p-3 rounded-md text-xs">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1 text-gray-900 dark:text-gray-100">Current User Profile</p>
                <p className="text-gray-800 dark:text-gray-200"><strong>Personality:</strong> {formatPersonalityTraits()}</p>
                <p className="text-gray-800 dark:text-gray-200"><strong>Demographics:</strong> {userProfile.age} years old, {userProfile.educationLevel} education, {userProfile.incomeLevel} income</p>
                <p className="text-gray-800 dark:text-gray-200"><strong>Living Situation:</strong> {formatHousingStatus()}, {formatVehicleOwnership()}</p>
                <p className="text-gray-800 dark:text-gray-200"><strong>Work & Family:</strong> {formatWorkNature()}, {formatFamilyDependents()}</p>
                <p className="text-gray-800 dark:text-gray-200"><strong>Financial Behavior:</strong> {userProfile.behavioralTrait}</p>
                <p className="text-gray-800 dark:text-gray-200"><strong>Current Products:</strong> 
                  {userProfile.danaPlus === 'Yes' ? ' DANA+' : ''} 
                  {userProfile.reksadana === 'Yes' ? ' Reksadana' : ''} 
                  {userProfile.eMAS === 'Yes' ? ' eMAS' : ''}
                  {userProfile.danaPlus === 'No' && userProfile.reksadana === 'No' && userProfile.eMAS === 'No' ? ' None' : ''}
                </p>
              </div>
            </div>
          </div>
          
          {/* Marketing Plan Components Section */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1 text-xs">Marketing Plan Components</p>
                {renderSelectedMarketingComponents()}
              </div>
            </div>
          </div>
          
          {/* Knowledge Base Section */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1 text-xs">Knowledge Base</p>
                {renderKnowledgeBaseInfo()}
              </div>
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
                className="min-h-[350px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 h-[350px] overflow-auto custom-scrollbar">
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
          
          <Button onClick={copyToClipboard} className="w-full">
            Copy to Clipboard
          </Button>
        </CardContent>
      )}
    </Card>
  );
} 