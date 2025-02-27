"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductInfo } from '@/contexts/KnowledgeBaseContext';

interface ProductEditorProps {
  product: 'danaPlus' | 'reksadana' | 'eMAS';
  productInfo: ProductInfo;
  updateProductInfo: (product: 'danaPlus' | 'reksadana' | 'eMAS', info: Partial<ProductInfo>) => void;
  onSave: () => void;
}

export function ProductEditor({ product, productInfo, updateProductInfo, onSave }: ProductEditorProps) {
  const handleChange = (field: keyof ProductInfo, value: string) => {
    updateProductInfo(product, {
      ...productInfo,
      [field]: value
    });
  };

  const handleArrayChange = (field: keyof ProductInfo, value: string) => {
    // Split by new lines and filter empty strings
    const arrayValue = value.split('\n').filter(item => item.trim() !== '');
    updateProductInfo(product, { [field]: arrayValue } as any);
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor={`${product}-name`}>Product Name</Label>
          <Input
            id={`${product}-name`}
            value={productInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-description`}>Description</Label>
          <Textarea
            id={`${product}-description`}
            value={productInfo.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter product description..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-features`}>Features</Label>
          <Textarea
            id={`${product}-features`}
            value={productInfo.features}
            onChange={(e) => handleChange('features', e.target.value)}
            placeholder="Enter product features..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-benefits`}>Benefits</Label>
          <Textarea
            id={`${product}-benefits`}
            value={productInfo.benefits}
            onChange={(e) => handleChange('benefits', e.target.value)}
            placeholder="Enter product benefits..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-targetAudience`}>Target Audience</Label>
          <Textarea
            id={`${product}-targetAudience`}
            value={productInfo.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
            placeholder="Enter target audience..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-riskLevel`}>Risk Level</Label>
          <Input
            id={`${product}-riskLevel`}
            value={productInfo.riskLevel}
            onChange={(e) => handleChange('riskLevel', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-minimumInvestment`}>Minimum Investment</Label>
          <Input
            id={`${product}-minimumInvestment`}
            value={productInfo.minimumInvestment}
            onChange={(e) => handleChange('minimumInvestment', e.target.value)}
            placeholder="Enter minimum investment..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-returnRate`}>Return Rate</Label>
          <Input
            id={`${product}-returnRate`}
            value={productInfo.returnRate}
            onChange={(e) => handleChange('returnRate', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-historicalPerformance`}>Historical Performance</Label>
          <Textarea
            id={`${product}-historicalPerformance`}
            value={productInfo.historicalPerformance}
            onChange={(e) => handleChange('historicalPerformance', e.target.value)}
            placeholder="Enter historical performance data (e.g., 2022: 3.5%, 2021: 3.2%)..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-faqs`}>FAQs</Label>
          <Textarea
            id={`${product}-faqs`}
            value={productInfo.faqs}
            onChange={(e) => handleChange('faqs', e.target.value)}
            placeholder="Enter FAQs in Q&A format (e.g., Q: How do I start? A: Simply open the app...)..."
            className="min-h-[150px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${product}-additionalInfo`}>Additional Information</Label>
          <Textarea
            id={`${product}-additionalInfo`}
            value={productInfo.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
          />
        </div>
        
        <Button onClick={onSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
} 