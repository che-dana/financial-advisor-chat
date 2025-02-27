"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useKnowledgeBase } from './KnowledgeBaseContext';

// Define the prompt version type
export interface PromptVersion {
  id: string;
  prompt: string;
  timestamp: Date;
}

// Default prompt template - without placeholders
const defaultPrompt = `You are Dana's AI Financial Advisor, designed to help users make informed investment decisions. Your goal is to provide personalized advice based on the user's profile and needs.

## Guidelines:
1. Be conversational and friendly, but professional.
2. Tailor your recommendations based on the user's profile (personality, financial situation, risk tolerance).
3. Provide accurate information about Dana's investment products.
4. Don't overwhelm the user with too much information at once.
5. If asked about something outside your knowledge base, politely redirect to Dana's investment products.
6. Avoid making specific promises about returns, but you can mention historical performance.
7. Encourage users to start small if they seem hesitant.
8. Respect the user's decisions and preferences.

Remember, your goal is to educate and guide, not to push products aggressively.`;

// Create context
interface FinalPromptContextType {
  finalPrompt: string;
  setFinalPrompt: (prompt: string) => void;
  savePromptVersion: () => void;
  loadPromptVersion: (id: string) => void;
  promptVersions: PromptVersion[];
  activePromptId: string | null;
  fullPromptWithContext: string;
}

const FinalPromptContext = createContext<FinalPromptContextType | undefined>(undefined);

// Provider component
export function FinalPromptProvider({ children }: { children: ReactNode }) {
  const [finalPrompt, setFinalPrompt] = useState<string>(defaultPrompt);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const { knowledgeBase } = useKnowledgeBase();
  const [fullPromptWithContext, setFullPromptWithContext] = useState<string>(defaultPrompt);

  // Update the full prompt with context whenever the base prompt or knowledge base changes
  useEffect(() => {
    // Format knowledge base for the prompt
    const knowledgeBaseFormatted = `
## Available Investment Products:

1. DANA+ (High-interest savings):
   - Description: ${knowledgeBase.danaPlus.description}
   - Features: ${knowledgeBase.danaPlus.features}
   - Benefits: ${knowledgeBase.danaPlus.benefits}
   - Target Audience: ${knowledgeBase.danaPlus.targetAudience}
   - Risk Level: ${knowledgeBase.danaPlus.riskLevel}
   - Minimum Investment: ${knowledgeBase.danaPlus.minimumInvestment}
   - Return Rate: ${knowledgeBase.danaPlus.returnRate}
   - Additional Info: ${knowledgeBase.danaPlus.additionalInfo}
   - Historical Performance: ${knowledgeBase.danaPlus.historicalPerformance}

2. Reksa Dana (Mutual Funds):
   - Features: ${knowledgeBase.reksadana.features}
   - Benefits: ${knowledgeBase.reksadana.benefits}
   - Target Audience: ${knowledgeBase.reksadana.targetAudience}
   - Risk Level: ${knowledgeBase.reksadana.riskLevel}
   - Minimum Investment: ${knowledgeBase.reksadana.minimumInvestment}
   - Return Rate: ${knowledgeBase.reksadana.returnRate}
   - Additional Info: ${knowledgeBase.reksadana.additionalInfo}
   - Historical Performance: ${knowledgeBase.reksadana.historicalPerformance}

3. eMAS (Gold Investment):
   - Description: ${knowledgeBase.eMAS.description}
   - Features: ${knowledgeBase.eMAS.features}
   - Benefits: ${knowledgeBase.eMAS.benefits}
   - Target Audience: ${knowledgeBase.eMAS.targetAudience}
   - Risk Level: ${knowledgeBase.eMAS.riskLevel}
   - Minimum Investment: ${knowledgeBase.eMAS.minimumInvestment}
   - Return Rate: ${knowledgeBase.eMAS.returnRate}
   - Additional Info: ${knowledgeBase.eMAS.additionalInfo}
   - Historical Performance: ${knowledgeBase.eMAS.historicalPerformance}

## Frequently Asked Questions:
- DANA+: ${knowledgeBase.danaPlus.faqs}
- Reksa Dana: ${knowledgeBase.reksadana.faqs}
- eMAS: ${knowledgeBase.eMAS.faqs}
`;

    // Create the full prompt with context
    const userProfilePlaceholder = "## User Profile Information:\n[User profile will be automatically inserted here]";
    
    // Combine the base prompt with the knowledge base
    const updatedPrompt = `${finalPrompt}\n\n${userProfilePlaceholder}\n\n${knowledgeBaseFormatted}`;
    setFullPromptWithContext(updatedPrompt);
  }, [finalPrompt, knowledgeBase]);

  const savePromptVersion = () => {
    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      prompt: finalPrompt,
      timestamp: new Date()
    };
    setPromptVersions(prev => [newVersion, ...prev]);
    setActivePromptId(newVersion.id);
  };

  const loadPromptVersion = (id: string) => {
    const version = promptVersions.find(v => v.id === id);
    if (version) {
      setFinalPrompt(version.prompt);
      setActivePromptId(id);
    }
  };

  return (
    <FinalPromptContext.Provider value={{ 
      finalPrompt, 
      setFinalPrompt, 
      savePromptVersion, 
      loadPromptVersion, 
      promptVersions, 
      activePromptId,
      fullPromptWithContext
    }}>
      {children}
    </FinalPromptContext.Provider>
  );
}

// Hook for using the context
export function useFinalPrompt() {
  const context = useContext(FinalPromptContext);
  if (context === undefined) {
    throw new Error('useFinalPrompt must be used within a FinalPromptProvider');
  }
  return context;
} 