"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the product info type
export interface ProductInfo {
  name: string;
  description: string;
  features: string;
  benefits: string;
  targetAudience: string;
  riskLevel: string;
  minimumInvestment: string;
  returnRate: string;
  additionalInfo: string;
}

// Define the knowledge base type
export interface KnowledgeBase {
  danaPlus: ProductInfo;
  reksadana: ProductInfo;
  eMAS: ProductInfo;
}

// Default knowledge base
const defaultKnowledgeBase: KnowledgeBase = {
  danaPlus: {
    name: 'DANA+',
    description: 'DANA+ is a digital savings product that offers higher returns than traditional savings accounts with the flexibility to withdraw anytime.',
    features: 'No minimum balance, Daily interest calculation, Withdraw anytime, No admin fees',
    benefits: 'Higher returns than traditional savings, Flexibility to access funds, Easy to manage through the DANA app',
    targetAudience: 'Young professionals, Digital natives, First-time savers',
    riskLevel: 'Low',
    minimumInvestment: 'Rp 10,000',
    returnRate: '3-4% p.a.',
    additionalInfo: 'DANA+ is protected by LPS (Indonesia Deposit Insurance Corporation) up to Rp 2 billion.'
  },
  reksadana: {
    name: 'Reksa Dana',
    description: 'Reksa Dana (Mutual Funds) is an investment vehicle that pools money from multiple investors to invest in a diversified portfolio managed by professional fund managers.',
    features: 'Professional management, Diversification, Various fund types (Money Market, Fixed Income, Equity, Mixed)',
    benefits: 'Potential for higher returns than savings, Professional portfolio management, Diversification to reduce risk',
    targetAudience: 'Medium to long-term investors, Those seeking higher returns than deposits, Investors with moderate risk tolerance',
    riskLevel: 'Low to High (depending on fund type)',
    minimumInvestment: 'Rp 100,000',
    returnRate: '5-15% p.a. (varies by fund type)',
    additionalInfo: 'Reksa Dana is regulated by OJK (Financial Services Authority of Indonesia).'
  },
  eMAS: {
    name: 'eMAS',
    description: 'eMAS is a digital gold investment product that allows users to buy, sell, and store gold digitally through the DANA app.',
    features: 'Buy gold starting from 0.0001 grams, Real-time gold price updates, Secure digital storage, Physical gold delivery option',
    benefits: 'Hedge against inflation, Portfolio diversification, No need for physical storage, Buy/sell anytime',
    targetAudience: 'Long-term investors, Those seeking inflation protection, Gold enthusiasts',
    riskLevel: 'Medium',
    minimumInvestment: 'As low as Rp 5,000',
    returnRate: 'Based on gold price appreciation',
    additionalInfo: 'Gold is stored in secure vaults and is 99.99% pure gold certified by ANTAM.'
  }
};

// Create context
interface KnowledgeBaseContextType {
  knowledgeBase: KnowledgeBase;
  updateProductInfo: (product: keyof KnowledgeBase, info: Partial<ProductInfo>) => void;
  resetKnowledgeBase: () => void;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

// Provider component
export function KnowledgeBaseProvider({ children }: { children: ReactNode }) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>(defaultKnowledgeBase);

  const updateProductInfo = (product: keyof KnowledgeBase, info: Partial<ProductInfo>) => {
    setKnowledgeBase(prev => ({
      ...prev,
      [product]: {
        ...prev[product],
        ...info
      }
    }));
  };

  const resetKnowledgeBase = () => {
    setKnowledgeBase(defaultKnowledgeBase);
  };

  return (
    <KnowledgeBaseContext.Provider value={{ knowledgeBase, updateProductInfo, resetKnowledgeBase }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}

// Hook for using the context
export function useKnowledgeBase() {
  const context = useContext(KnowledgeBaseContext);
  if (context === undefined) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
} 