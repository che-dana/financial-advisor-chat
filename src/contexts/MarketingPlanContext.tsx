"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the marketing plan type
export interface MarketingPlan {
  id: string;
  timestamp: Date;
  bestProducts: string[];
  marketingTechnique: string;
  conversationStarter: string;
  conversationSequence: string[];
  userProfile: any; // This would store the user profile at the time of generation
}

// Create context
interface MarketingPlanContextType {
  marketingPlans: MarketingPlan[];
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  addMarketingPlan: (plan: Omit<MarketingPlan, 'id' | 'timestamp' | 'userProfile'>) => void;
  clearMarketingPlans: () => void;
}

const defaultPrompt = "Generate a marketing plan for a financial product that would appeal to the user based on their profile. Include the best products to recommend, marketing technique to use, a conversation starter, and a sequence of talking points.";

const MarketingPlanContext = createContext<MarketingPlanContextType | undefined>(undefined);

// Provider component
export function MarketingPlanProvider({ children }: { children: ReactNode }) {
  const [marketingPlans, setMarketingPlans] = useState<MarketingPlan[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>(defaultPrompt);

  const addMarketingPlan = (plan: Omit<MarketingPlan, 'id' | 'timestamp' | 'userProfile'>) => {
    const newPlan: MarketingPlan = {
      ...plan,
      id: Date.now().toString(),
      timestamp: new Date(),
      userProfile: {} // In a real app, you'd capture the current user profile
    };
    setMarketingPlans(prev => [newPlan, ...prev]);
  };

  const clearMarketingPlans = () => {
    setMarketingPlans([]);
  };

  return (
    <MarketingPlanContext.Provider value={{ 
      marketingPlans, 
      currentPrompt, 
      setCurrentPrompt, 
      addMarketingPlan, 
      clearMarketingPlans 
    }}>
      {children}
    </MarketingPlanContext.Provider>
  );
}

// Hook for using the context
export function useMarketingPlan() {
  const context = useContext(MarketingPlanContext);
  if (context === undefined) {
    throw new Error('useMarketingPlan must be used within a MarketingPlanProvider');
  }
  return context;
} 