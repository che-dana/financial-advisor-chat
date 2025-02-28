"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

type SelectedComponents = {
  bestProducts: boolean;
  marketingTechnique: boolean;
  conversationStarter: boolean;
  conversationSequence: boolean;
};

// Create context
interface MarketingPlanContextType {
  marketingPlans: MarketingPlan[];
  currentPrompt: string;
  selectedComponents: SelectedComponents;
  setCurrentPrompt: (prompt: string) => void;
  addMarketingPlan: (plan: MarketingPlan) => void;
  toggleComponentSelection: (component: keyof SelectedComponents) => void;
  getSelectedComponentsText: () => string;
  clearMarketingPlans: () => void;
  isLoading: boolean;
  setAllComponentsSelection: (selected: boolean) => void;
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

const defaultContext: MarketingPlanContextType = {
  marketingPlans: [],
  currentPrompt: defaultPrompt,
  selectedComponents: {
    bestProducts: false,
    marketingTechnique: false,
    conversationStarter: false,
    conversationSequence: false
  },
  setCurrentPrompt: () => {},
  addMarketingPlan: () => {},
  toggleComponentSelection: () => {},
  getSelectedComponentsText: () => '',
  clearMarketingPlans: () => {},
  isLoading: true,
  setAllComponentsSelection: () => {}
};

const MarketingPlanContext = createContext<MarketingPlanContextType>(defaultContext);

// Provider component
export function MarketingPlanProvider({ children }: { children: ReactNode }) {
  const [marketingPlans, setMarketingPlans] = useState<MarketingPlan[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>(defaultPrompt);
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    bestProducts: false,
    marketingTechnique: false,
    conversationStarter: false,
    conversationSequence: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved marketing plans and prompt on initial mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load marketing prompts
        const response = await fetch('/api/marketing-prompts');
        if (response.ok) {
          const data = await response.json();
          if (data.prompts && data.prompts.length > 0) {
            // Find the active prompt or use the most recent one
            const activePrompt = data.prompts.find((p: any) => p.isActive) || data.prompts[0];
            setMarketingPlans([activePrompt]);
            
            // Set the prompt text
            if (activePrompt.prompt) {
              setCurrentPrompt(activePrompt.prompt);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load saved marketing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Save the current prompt whenever it changes
  useEffect(() => {
    const savePrompt = async () => {
      if (isLoading) return; // Don't save during initial load
      
      try {
        console.log('Saving marketing prompt to database...');
        
        // Get the latest marketing plan if available
        const latestPlan = marketingPlans.length > 0 ? marketingPlans[0] : null;
        
        const response = await fetch('/api/marketing-prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt: currentPrompt,
            bestProducts: latestPlan?.bestProducts ? JSON.stringify(latestPlan.bestProducts) : null,
            marketingTechnique: latestPlan?.marketingTechnique || null,
            conversationStarter: latestPlan?.conversationStarter || null,
            conversationSequence: latestPlan?.conversationSequence ? JSON.stringify(latestPlan.conversationSequence) : null,
            isActive: true 
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save marketing prompt:', errorData);
        } else {
          console.log('Marketing prompt saved successfully');
        }
      } catch (error) {
        console.error('Error saving marketing prompt:', error);
      }
    };

    savePrompt();
  }, [currentPrompt, isLoading, marketingPlans]);

  const addMarketingPlan = (plan: MarketingPlan) => {
    setMarketingPlans([plan, ...marketingPlans]);
  };

  const toggleComponentSelection = (component: keyof SelectedComponents) => {
    setSelectedComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  // Function to get text of selected components for the final prompt
  const getSelectedComponentsText = () => {
    if (marketingPlans.length === 0) return '';
    
    const plan = marketingPlans[0];
    let selectedText = '';
    
    if (selectedComponents.bestProducts && plan.bestProducts) {
      selectedText += `Best Products:\n- ${plan.bestProducts.join('\n- ')}\n\n`;
    }
    
    if (selectedComponents.marketingTechnique && plan.marketingTechnique) {
      selectedText += `Marketing Technique:\n${plan.marketingTechnique}\n\n`;
    }
    
    if (selectedComponents.conversationStarter && plan.conversationStarter) {
      selectedText += `Conversation Starter:\n"${plan.conversationStarter}"\n\n`;
    }
    
    if (selectedComponents.conversationSequence && plan.conversationSequence) {
      selectedText += `Conversation Sequence:\n${plan.conversationSequence.map((step, i) => `${i+1}. ${step}`).join('\n')}\n`;
    }
    
    return selectedText;
  };

  const clearMarketingPlans = async () => {
    try {
      // Clear on server
      const response = await fetch('/api/marketing-plans', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Update local state
        setMarketingPlans([]);
      } else {
        console.error('Failed to clear marketing plans');
      }
    } catch (error) {
      console.error('Error clearing marketing plans:', error);
    }
  };

  const setAllComponentsSelection = (selected: boolean) => {
    setSelectedComponents({
      bestProducts: selected,
      marketingTechnique: selected,
      conversationStarter: selected,
      conversationSequence: selected
    });
  };

  return (
    <MarketingPlanContext.Provider 
      value={{ 
        marketingPlans, 
        currentPrompt, 
        selectedComponents,
        setCurrentPrompt, 
        addMarketingPlan,
        toggleComponentSelection,
        getSelectedComponentsText,
        clearMarketingPlans,
        isLoading,
        setAllComponentsSelection
      }}
    >
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