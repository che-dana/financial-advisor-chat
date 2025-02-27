"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from './UserProfileContext';

// Define the marketing plan type
export interface MarketingPlan {
  id: string;
  timestamp: Date;
  bestProducts: string[];
  marketingTechnique: string;
  conversationStarter: string;
  conversationSequence: string[];
  userProfile: Partial<UserProfile>; // Store the user profile at the time of generation
}

// Create context
interface MarketingPlanContextType {
  marketingPlans: MarketingPlan[];
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  addMarketingPlan: (plan: Omit<MarketingPlan, 'id' | 'timestamp' | 'userProfile'>) => void;
  clearMarketingPlans: () => void;
}

const defaultPrompt = `You are a marketing strategist designing a personalized investment marketing plan for Dana's investment products: **Dana+ (High-interest savings), Emas (Gold investment), and Reksa Dana (Mutual funds).**  

## **Objective:**  
Generate a **marketing plan** for a given user segment that includes:  
1. **Best Products** – The most suitable Dana investment product(s) based on user attributes.  
2. **Marketing Technique** – The most effective persuasion strategy for this user.  
3. **Conversation Starter** – The best way to initiate engagement.  
4. **Conversation Sequence** – A step-by-step follow-up sequence that guides the user toward investment.  

## **User Attributes:**  
You will be given the following user attributes:  
- **Big 5 Personality Trait** (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)  
- **Education Level** (High School, Undergraduate, Postgraduate)  
- **Income Level** (Low, Medium, High)  
- **Housing Status** (Renter, Homeowner)  
- **Vehicle Ownership** (Owns a car, No car)  
- **Nature of Work** (Employee, Freelancer, Entrepreneur, Gig Worker)  
- **Family Dependents** (Single, Married, Has Children)  
- **Age** (18-24, 25-40, 40+)  
- **Behavioral Traits** (Spender, Saver, Risk-taker, Risk-averse)  
- **Investment Purchase Status** (Never Invested, Purchased Dana+, Purchased Emas, Purchased Reksa Dana, Purchased all three)  

## **Marketing Strategy Mapping:**  
Use psychological and data-driven marketing strategies to match the user's profile. The response should be structured as follows:

### **1. Best Products**  
(Which investment product(s) best suit this user profile and why?)  

### **2. Marketing Technique**  
(What marketing strategies should be applied based on personality traits, spending behavior, and past investments?)  
Examples:  
- Curiosity Gap  
- Social Proof  
- Authority & Expertise  
- Loss Aversion  
- Emotional Appeal  
- Scarcity & Urgency  
- Gamification  
- FOMO (Fear of Missing Out)  

### **3. Conversation Starter**  
(What's the first message to engage this user in a conversation about investing? Should be engaging, personalized, and psychologically appealing.)  

### **4. Conversation Sequence**  
(A structured sequence that guides the user toward making an investment decision. Should be persuasive but not pushy.)  

The conversation sequence should follow this flow:  
- **Step 1: Awareness** – Highlight benefits & relevance of the investment.  
- **Step 2: Consideration** – Provide a compelling reason or comparison.  
- **Step 3: Engagement** – Encourage action (investment calculator, quiz, testimonial).  
- **Step 4: Call-to-Action (CTA)** – Clear, persuasive, and personalized next step.  

Please provide your response in JSON format with the following structure:
{
  "bestProducts": ["product1", "product2"],
  "marketingTechnique": "description of technique",
  "conversationStarter": "opening line",
  "conversationSequence": ["step 1", "step 2", "step 3", "step 4"]
}`;

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