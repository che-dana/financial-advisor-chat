"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { MarketingPlanGenerator } from '@/components/marketing-plan/MarketingPlanGenerator';
import { FinalPromptConfig } from '@/components/final-prompt/FinalPromptConfig';
import { FinancialAdvisorChat } from '@/components/financial-advisor/FinancialAdvisorChat';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // If user is not authenticated, redirect to sign in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // While checking authentication status, show loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If authenticated, show the dashboard content
  if (status === 'authenticated') {
    return (
      <div className="flex h-screen">
        {/* Left sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <FinancialAdvisorChat />
            
            {/* Test Data Button - Fixed position */}
            <div className="fixed bottom-4 right-4 z-50">
              <Button 
                onClick={async () => {
                  try {
                    // Save a test marketing prompt
                    const marketingResponse = await fetch('/api/marketing-prompts', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 
                        prompt: "Test marketing prompt",
                        isActive: true 
                      }),
                    });
                    
                    // Save a test final prompt
                    const finalResponse = await fetch('/api/final-prompts', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 
                        prompt: "Test final prompt",
                        name: "Test Version",
                        isActive: true 
                      }),
                    });
                    
                    if (marketingResponse.ok && finalResponse.ok) {
                      alert("Test data saved successfully!");
                    } else {
                      alert("Error saving test data");
                    }
                  } catch (error) {
                    console.error('Error saving test data:', error);
                    alert("Error saving test data: " + error);
                  }
                }}
                variant="outline"
              >
                Save Test Data
              </Button>
            </div>
          </div>
          
          {/* Bottom panels */}
          <div className="border-t">
            <div className="grid grid-cols-2 gap-4 p-4">
              <MarketingPlanGenerator />
              <FinalPromptConfig />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // This will briefly show before redirect happens for unauthenticated users
  return null;
} 