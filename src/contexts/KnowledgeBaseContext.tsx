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
  faqs: string;
  historicalPerformance: string;
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
    additionalInfo: 'DANA+ is protected by LPS (Indonesia Deposit Insurance Corporation) up to Rp 2 billion.',
    faqs: 'Q: How do I start using DANA+?\nA: Simply open your DANA app, go to the DANA+ section, and follow the instructions to transfer funds.\n\nQ: Is there a lock-in period?\nA: No, you can withdraw your funds anytime without penalty.',
    historicalPerformance: '2022: 3.5%\n2021: 3.2%\n2020: 4.0%'
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
    additionalInfo: 'Reksa Dana is regulated by OJK (Financial Services Authority of Indonesia).',
    faqs: 'Q: What types of Reksa Dana are available?\nA: We offer Money Market, Fixed Income, Equity, and Mixed funds to suit different risk profiles.\n\nQ: How long should I invest in Reksa Dana?\nA: It depends on the fund type, but generally 1-5+ years for optimal results.',
    historicalPerformance: 'Money Market Fund:\n2022: 4.8%\n2021: 4.5%\n2020: 5.2%\n\nEquity Fund:\n2022: 8.7%\n2021: 12.3%\n2020: -2.5% (COVID impact)'
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
    additionalInfo: 'Gold is stored in secure vaults and is 99.99% pure gold certified by ANTAM.',
    faqs: 'Q: Can I convert my digital gold to physical gold?\nA: Yes, you can request physical delivery for a minimum of 1 gram.\n\nQ: How is the gold price determined?\nA: The price follows international gold prices with a small spread for buying and selling.',
    historicalPerformance: '2022: 7.2%\n2021: -3.5%\n2020: 24.6%\n2019: 18.3%\n\nNote: Gold can be volatile but has historically been a good store of value over long periods.'
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