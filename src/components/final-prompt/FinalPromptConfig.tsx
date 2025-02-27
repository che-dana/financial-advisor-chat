"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFinalPrompt } from '@/contexts/FinalPromptContext';
import { useToast } from '@/components/ui/use-toast';

export function FinalPromptConfig() {
  const { finalPrompt, setFinalPrompt, savePromptVersion } = useFinalPrompt();
  const { toast } = useToast();

  const handleSavePrompt = () => {
    savePromptVersion();
    toast({
      title: "Prompt Saved",
      description: "Your prompt has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Prompt Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={finalPrompt}
          onChange={(e) => setFinalPrompt(e.target.value)}
          placeholder="Configure your final prompt..."
          className="min-h-[200px]"
        />
        
        <Button onClick={handleSavePrompt}>
          Save Prompt Version
        </Button>
      </CardContent>
    </Card>
  );
} 