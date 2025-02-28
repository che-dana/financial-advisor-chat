"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

export function PromptStorageDebug() {
  const { data: session } = useSession();
  const [marketingPrompts, setMarketingPrompts] = useState([]);
  const [finalPrompts, setFinalPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        // Fetch marketing prompts
        const marketingRes = await fetch('/api/marketing-prompts');
        if (marketingRes.ok) {
          const data = await marketingRes.json();
          setMarketingPrompts(data.prompts || []);
        }
        
        // Fetch final prompts
        const finalRes = await fetch('/api/final-prompts');
        if (finalRes.ok) {
          const data = await finalRes.json();
          setFinalPrompts(data.prompts || []);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPrompts();
    }
  }, [session]);

  const handleManualSave = async () => {
    setLoading(true);
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
        toast({
          title: "Test Data Saved",
          description: "Test prompts have been saved to the database.",
        });
        
        // Refresh the data
        fetchPrompts();
      }
    } catch (error) {
      console.error('Error saving test data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Prompt Storage Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Prompt Storage Verification</h2>
          <div className="space-x-2">
            <Button onClick={fetchPrompts} disabled={loading}>
              Refresh
            </Button>
            <Button onClick={handleManualSave} disabled={loading} variant="secondary">
              Save Test Data
            </Button>
          </div>
        </div>
        {loading ? (
          <p>Loading prompt data...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Current User</h3>
              <p>ID: {(session?.user as any)?.id}</p>
              <p>Email: {session?.user?.email}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Marketing Prompts</h3>
              {marketingPrompts.length === 0 ? (
                <p>No marketing prompts saved for this user.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {marketingPrompts.map((prompt: any) => (
                    <li key={prompt.id}>
                      ID: {prompt.id} | Created: {new Date(prompt.createdAt).toLocaleString()} | Active: {prompt.isActive ? 'Yes' : 'No'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Final Prompts</h3>
              {finalPrompts.length === 0 ? (
                <p>No final prompts saved for this user.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {finalPrompts.map((prompt: any) => (
                    <li key={prompt.id}>
                      ID: {prompt.id} | Name: {prompt.name} | Created: {new Date(prompt.createdAt).toLocaleString()} | Active: {prompt.isActive ? 'Yes' : 'No'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 