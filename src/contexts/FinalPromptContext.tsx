"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the prompt version type
interface PromptVersion {
  id: string;
  prompt: string;
  timestamp: Date;
}

// Create context
interface FinalPromptContextType {
  finalPrompt: string;
  setFinalPrompt: (prompt: string) => void;
  promptVersions: PromptVersion[];
  savePromptVersion: () => void;
}

const defaultPrompt = `You are Dana's AI Financial Advisor. Your goal is to help users make informed investment decisions based on their profile and needs. 

When recommending products, consider:
1. The user's risk tolerance and financial goals
2. Their income level and financial stability
3. Their investment experience and knowledge
4. Their age and life stage

Be conversational, empathetic, and educational. Explain concepts clearly without jargon. Always prioritize the user's best interests.`;

const FinalPromptContext = createContext<FinalPromptContextType | undefined>(undefined);

// Provider component
export function FinalPromptProvider({ children }: { children: ReactNode }) {
  const [finalPrompt, setFinalPrompt] = useState<string>(defaultPrompt);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);

  const savePromptVersion = () => {
    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      prompt: finalPrompt,
      timestamp: new Date()
    };
    setPromptVersions(prev => [newVersion, ...prev]);
  };

  return (
    <FinalPromptContext.Provider value={{ 
      finalPrompt, 
      setFinalPrompt, 
      promptVersions, 
      savePromptVersion 
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