"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { useToast } from '@/components/ui/use-toast';
import { ProductEditor } from '@/components/knowledge-base/ProductEditor';

export function KnowledgeBaseEditor() {
  const { knowledgeBase, updateProductInfo, resetKnowledgeBase } = useKnowledgeBase();
  const { toast } = useToast();

  const handleSave = (product: 'danaPlus' | 'reksadana' | 'eMAS') => {
    toast({
      title: "Knowledge Base Updated",
      description: `${knowledgeBase[product].name} information has been updated.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="danaPlus">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="danaPlus">DANA+</TabsTrigger>
            <TabsTrigger value="reksadana">Reksa Dana</TabsTrigger>
            <TabsTrigger value="eMAS">eMAS</TabsTrigger>
          </TabsList>
          
          {/* DANA+ Tab */}
          <TabsContent value="danaPlus">
            <ProductEditor 
              product="danaPlus" 
              productInfo={knowledgeBase.danaPlus}
              updateProductInfo={updateProductInfo}
              onSave={() => handleSave('danaPlus')}
            />
          </TabsContent>
          
          {/* Reksa Dana Tab */}
          <TabsContent value="reksadana">
            <ProductEditor 
              product="reksadana" 
              productInfo={knowledgeBase.reksadana}
              updateProductInfo={updateProductInfo}
              onSave={() => handleSave('reksadana')}
            />
          </TabsContent>
          
          {/* eMAS Tab */}
          <TabsContent value="eMAS">
            <ProductEditor 
              product="eMAS" 
              productInfo={knowledgeBase.eMAS}
              updateProductInfo={updateProductInfo}
              onSave={() => handleSave('eMAS')}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <div className="mt-6">
        <Button variant="outline" onClick={resetKnowledgeBase}>
          Reset All Knowledge Base
        </Button>
      </div>
    </Card>
  );
} 