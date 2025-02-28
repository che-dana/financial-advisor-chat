"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function InvestmentsPage() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const router = useRouter();
  const { toast } = useToast();
  
  const [danaPlus, setDanaPlus] = useState(userProfile.danaPlus === 'Yes');
  const [reksadana, setReksadana] = useState(userProfile.reksadana === 'Yes');
  const [eMAS, setEMAS] = useState(userProfile.eMAS === 'Yes');
  
  useEffect(() => {
    setDanaPlus(userProfile.danaPlus === 'Yes');
    setReksadana(userProfile.reksadana === 'Yes');
    setEMAS(userProfile.eMAS === 'Yes');
  }, [userProfile]);
  
  const handleSave = async () => {
    try {
      await updateUserProfile({
        danaPlus: danaPlus ? 'Yes' : 'No',
        reksadana: reksadana ? 'Yes' : 'No',
        eMAS: eMAS ? 'Yes' : 'No'
      });
      
      toast({
        title: "Profile Updated",
        description: "Your investment product status has been updated successfully.",
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
          <CardTitle>Investment Product Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dana-plus" className="text-base">DANA+</Label>
              <p className="text-sm text-muted-foreground">High-interest savings product</p>
            </div>
            <Switch 
              id="dana-plus" 
              checked={danaPlus} 
              onCheckedChange={setDanaPlus} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reksadana" className="text-base">Reksa Dana</Label>
              <p className="text-sm text-muted-foreground">Mutual funds investment product</p>
            </div>
            <Switch 
              id="reksadana" 
              checked={reksadana} 
              onCheckedChange={setReksadana} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emas" className="text-base">eMAS</Label>
              <p className="text-sm text-muted-foreground">Gold investment product</p>
            </div>
            <Switch 
              id="emas" 
              checked={eMAS} 
              onCheckedChange={setEMAS} 
            />
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