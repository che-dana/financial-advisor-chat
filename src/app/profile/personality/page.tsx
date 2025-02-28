"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function PersonalityTraitsPage() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const router = useRouter();
  const { toast } = useToast();
  
  const [openness, setOpenness] = useState(userProfile.openness || 'Medium');
  const [conscientiousness, setConscientiousness] = useState(userProfile.conscientiousness || 'Medium');
  const [extraversion, setExtraversion] = useState(userProfile.extraversion || 'Medium');
  const [agreeableness, setAgreeableness] = useState(userProfile.agreeableness || 'Medium');
  const [neuroticism, setNeuroticism] = useState(userProfile.neuroticism || 'Medium');
  
  useEffect(() => {
    setOpenness(userProfile.openness || 'Medium');
    setConscientiousness(userProfile.conscientiousness || 'Medium');
    setExtraversion(userProfile.extraversion || 'Medium');
    setAgreeableness(userProfile.agreeableness || 'Medium');
    setNeuroticism(userProfile.neuroticism || 'Medium');
  }, [userProfile]);
  
  const handleSave = async () => {
    try {
      await updateUserProfile({
        openness,
        conscientiousness,
        extraversion,
        agreeableness,
        neuroticism
      });
      
      toast({
        title: "Profile Updated",
        description: "Your personality traits have been updated successfully.",
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Personality Traits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openness">Openness</Label>
            <Select value={openness} onValueChange={setOpenness}>
              <SelectTrigger id="openness">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conscientiousness">Conscientiousness</Label>
            <Select value={conscientiousness} onValueChange={setConscientiousness}>
              <SelectTrigger id="conscientiousness">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="extraversion">Extraversion</Label>
            <Select value={extraversion} onValueChange={setExtraversion}>
              <SelectTrigger id="extraversion">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agreeableness">Agreeableness</Label>
            <Select value={agreeableness} onValueChange={setAgreeableness}>
              <SelectTrigger id="agreeableness">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neuroticism">Neuroticism</Label>
            <Select value={neuroticism} onValueChange={setNeuroticism}>
              <SelectTrigger id="neuroticism">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 