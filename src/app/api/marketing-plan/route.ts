import { NextResponse } from 'next/server';
import { UserProfile } from '@/contexts/UserProfileContext';
import { KnowledgeBase } from '@/contexts/KnowledgeBaseContext';

// Azure OpenAI configuration
const azureConfig = {
  apiBase: "https://dana-automation-copilot-ncus.openai.azure.com/",
  deploymentName: "gpt-4o",
  apiKey: "d636779ca07d47a0a9460d14972766a7",
  apiVersion: "2023-05-15",
  apiType: "azure"
};

export async function POST(request: Request) {
  try {
    const { prompt, userProfile, knowledgeBase } = await request.json();

    // Format the user profile for the prompt
    const userProfileFormatted = `
User Profile:
- Big 5 Personality: Openness (${userProfile.personalityTraits.openness}), 
  Conscientiousness (${userProfile.personalityTraits.conscientiousness}), 
  Extraversion (${userProfile.personalityTraits.extraversion}), 
  Agreeableness (${userProfile.personalityTraits.agreeableness}), 
  Neuroticism (${userProfile.personalityTraits.neuroticism})
- Education Level: ${userProfile.demographics.educationLevel}
- Income Level: ${userProfile.demographics.incomeLevel}
- Housing Status: ${userProfile.demographics.housingStatus}
- Vehicle Ownership: ${userProfile.demographics.vehicleOwnership}
- Nature of Work: ${userProfile.demographics.workNature}
- Family Dependents: ${userProfile.demographics.familyDependants}
- Age: ${userProfile.demographics.age}
- Behavioral Trait: ${userProfile.demographics.behavioralTrait}
- Investment Purchase Status: 
  Dana+: ${userProfile.investmentStatus.danaPlus === 'Yes' ? 'Purchased' : 'Not Purchased'}
  Emas: ${userProfile.investmentStatus.eMAS === 'Yes' ? 'Purchased' : 'Not Purchased'}
  Reksa Dana: ${userProfile.investmentStatus.reksadana === 'Yes' ? 'Purchased' : 'Not Purchased'}
`;

    // Format knowledge base for the prompt
    const knowledgeBaseFormatted = `
## Available Investment Products:

1. DANA+ (High-interest savings):
   - Description: ${knowledgeBase.danaPlus.description}
   - Features: ${knowledgeBase.danaPlus.features}
   - Benefits: ${knowledgeBase.danaPlus.benefits}
   - Target Audience: ${knowledgeBase.danaPlus.targetAudience}
   - Risk Level: ${knowledgeBase.danaPlus.riskLevel}
   - Minimum Investment: ${knowledgeBase.danaPlus.minimumInvestment}
   - Return Rate: ${knowledgeBase.danaPlus.returnRate}
   - Additional Info: ${knowledgeBase.danaPlus.additionalInfo}

2. Reksa Dana (Mutual funds):
   - Description: ${knowledgeBase.reksadana.description}
   - Features: ${knowledgeBase.reksadana.features}
   - Benefits: ${knowledgeBase.reksadana.benefits}
   - Target Audience: ${knowledgeBase.reksadana.targetAudience}
   - Risk Level: ${knowledgeBase.reksadana.riskLevel}
   - Minimum Investment: ${knowledgeBase.reksadana.minimumInvestment}
   - Return Rate: ${knowledgeBase.reksadana.returnRate}
   - Additional Info: ${knowledgeBase.reksadana.additionalInfo}

3. eMAS (Gold investment):
   - Description: ${knowledgeBase.eMAS.description}
   - Features: ${knowledgeBase.eMAS.features}
   - Benefits: ${knowledgeBase.eMAS.benefits}
   - Target Audience: ${knowledgeBase.eMAS.targetAudience}
   - Risk Level: ${knowledgeBase.eMAS.riskLevel}
   - Minimum Investment: ${knowledgeBase.eMAS.minimumInvestment}
   - Return Rate: ${knowledgeBase.eMAS.returnRate}
   - Additional Info: ${knowledgeBase.eMAS.additionalInfo}
`;

    // Combine the base prompt with user profile and knowledge base
    const completePrompt = `${prompt}\n\n${userProfileFormatted}\n\n${knowledgeBaseFormatted}`;

    // Call Azure OpenAI API
    const response = await fetch(`${azureConfig.apiBase}/openai/deployments/${azureConfig.deploymentName}/chat/completions?api-version=${azureConfig.apiVersion}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureConfig.apiKey
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: completePrompt },
          { role: "user", content: "Generate a marketing plan for this user." }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Azure OpenAI API error:', errorData);
      return NextResponse.json({ error: 'Failed to generate marketing plan' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI Response:", aiResponse);
    
    // Parse the response to extract the marketing plan components
    let bestProducts: string[] = [];
    let marketingTechnique = '';
    let conversationStarter = '';
    let conversationSequence: string[] = [];
    
    try {
      // Try to parse as JSON first
      const jsonResponse = JSON.parse(aiResponse);
      
      // Extract best products
      if (jsonResponse.bestProducts) {
        if (Array.isArray(jsonResponse.bestProducts)) {
          bestProducts = jsonResponse.bestProducts;
        } else if (typeof jsonResponse.bestProducts === 'string') {
          // Split by bullet points or commas if present
          if (jsonResponse.bestProducts.includes('-') || jsonResponse.bestProducts.includes('•')) {
            bestProducts = jsonResponse.bestProducts.split(/[-•]/).map((p: string) => p.trim()).filter((p: string) => p);
          } else if (jsonResponse.bestProducts.includes(',')) {
            bestProducts = jsonResponse.bestProducts.split(',').map((p: string) => p.trim()).filter((p: string) => p);
          } else {
            bestProducts = [jsonResponse.bestProducts];
          }
        }
      }
      
      // Extract marketing technique
      if (jsonResponse.marketingTechnique) {
        marketingTechnique = jsonResponse.marketingTechnique;
      }
      
      // Extract conversation starter
      if (jsonResponse.conversationStarter) {
        conversationStarter = jsonResponse.conversationStarter;
      }
      
      // Extract conversation sequence
      if (jsonResponse.conversationSequence) {
        if (Array.isArray(jsonResponse.conversationSequence)) {
          conversationSequence = jsonResponse.conversationSequence;
        } else if (typeof jsonResponse.conversationSequence === 'string') {
          const conversationSequenceText = jsonResponse.conversationSequence;
          
          // Try to parse as a numbered list first
          const numberedSteps = conversationSequenceText.match(/\d+\.\s*(.*?)(?=\n\d+\.|\n*$)/gs);
          if (numberedSteps) {
            conversationSequence = numberedSteps.map((step: string) => {
              return step.replace(/^\d+\.\s*/, '').trim();
            });
          } 
          // Otherwise, try to split by lines that might be steps
          else {
            const lines = conversationSequenceText.split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line && !line.match(/^Conversation Sequence:?$/i));
            
            // Look for lines that might be steps
            for (const line of lines) {
              if (line.match(/^[a-z0-9]\)/) || line.match(/^step \d+/i) || line.match(/^[•\-]/) || line.match(/^\d+\./)) {
                conversationSequence.push(line.replace(/^[a-z0-9]\)|\s*[•\-]\s*|^step \d+:\s*|^\d+\.\s*/i, '').trim());
              } else {
                // If it doesn't look like a step, just add it
                conversationSequence.push(line);
              }
            }
          }
        } else if (typeof jsonResponse.conversationSequence === 'object') {
          // Handle case where sequence is an object with step keys
          const steps = Object.values(jsonResponse.conversationSequence);
          conversationSequence = steps.map((step: any) => step.toString());
        }
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      
      // Fallback to regex parsing if JSON parsing fails
      // Extract best products
      const productMatch = aiResponse.match(/Best Products:?\s*([\s\S]*?)(?=Marketing Technique:|$)/i);
      if (productMatch && productMatch[1]) {
        const productText = productMatch[1].trim();
        // Split by bullet points or commas if present
        if (productText.includes('-') || productText.includes('•')) {
          bestProducts = productText.split(/[-•]/).map((p: string) => p.trim()).filter((p: string) => p);
        } else if (productText.includes(',')) {
          bestProducts = productText.split(',').map((p: string) => p.trim()).filter((p: string) => p);
        } else {
          bestProducts = [productText];
        }
      }
      
      // Extract marketing technique
      const techniqueMatch = aiResponse.match(/Marketing Technique:?\s*([\s\S]*?)(?=Conversation Starter:|$)/i);
      if (techniqueMatch && techniqueMatch[1]) {
        marketingTechnique = techniqueMatch[1].trim();
      }
      
      // Extract conversation starter
      const starterMatch = aiResponse.match(/Conversation Starter:?\s*([\s\S]*?)(?=Conversation Sequence:|$)/i);
      if (starterMatch && starterMatch[1]) {
        conversationStarter = starterMatch[1].trim();
      }
      
      // Extract conversation sequence
      const sequenceMatch = aiResponse.match(/Conversation Sequence:?\s*([\s\S]*?)(?=$)/i);
      if (sequenceMatch && sequenceMatch[1]) {
        const conversationSequenceText = sequenceMatch[1].trim();
        
        // Try to parse as a numbered list
        const numberedSteps = conversationSequenceText.match(/\d+\.\s*(.*?)(?=\n\d+\.|\n*$)/gs);
        if (numberedSteps) {
          conversationSequence = numberedSteps.map(step => {
            return step.replace(/^\d+\.\s*/, '').trim();
          });
        } else {
          // Split by lines and filter out empty lines
          conversationSequence = conversationSequenceText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        }
      }
      
      // If we still don't have a conversation sequence, try to find a numbered list anywhere in the response
      if (conversationSequence.length === 0) {
        const numberedListMatch = aiResponse.match(/(?:\n\s*\d+\.\s*[^\n]+)+/g);
        if (numberedListMatch) {
          const steps = numberedListMatch[0].split(/\n\s*\d+\.\s*/).filter((s: string) => s.trim());
          conversationSequence = steps;
        }
      }
    }
    
    // Create the marketing plan object
    const marketingPlan = {
      bestProducts,
      marketingTechnique,
      conversationStarter,
      conversationSequence
    };
    
    console.log("Parsed Marketing Plan:", marketingPlan);
    
    return NextResponse.json({ plan: marketingPlan });
  } catch (error) {
    console.error('Error in marketing plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMarketingPlan(userProfile: UserProfile) {
  // Determine best products based on user profile
  const bestProducts = [];
  
  if (userProfile.incomeLevel === 'Low' || userProfile.behavioralTrait === 'Saver') {
    bestProducts.push('DANA+');
  }
  
  if (userProfile.incomeLevel === 'High' || userProfile.behavioralTrait === 'Investor') {
    bestProducts.push('Reksa Dana');
  }
  
  if (userProfile.age < 40 || userProfile.behavioralTrait === 'Investor') {
    bestProducts.push('eMAS');
  }
  
  // If no products were selected, default to DANA+
  if (bestProducts.length === 0) {
    bestProducts.push('DANA+');
  }
  
  // Determine marketing technique based on personality
  let marketingTechnique = '';
  if (userProfile.openness === 'High') {
    marketingTechnique = 'Emphasize innovation and new possibilities';
  } else if (userProfile.conscientiousness === 'High') {
    marketingTechnique = 'Focus on reliability and long-term benefits';
  } else if (userProfile.extraversion === 'High') {
    marketingTechnique = 'Highlight social proof and community aspects';
  } else if (userProfile.agreeableness === 'High') {
    marketingTechnique = 'Stress how the product helps others and society';
  } else {
    marketingTechnique = 'Present clear data and security features';
  }
  
  // Generate conversation starter
  let conversationStarter = '';
  if (userProfile.behavioralTrait === 'Saver') {
    conversationStarter = `I noticed you're careful with your money. Have you considered how DANA+ could help you grow your savings more effectively?`;
  } else if (userProfile.behavioralTrait === 'Spender') {
    conversationStarter = `Wouldn't it be great if some of your spending could actually work for you? Let me show you how our products can help.`;
  } else {
    conversationStarter = `As someone interested in investments, I think you'll appreciate the returns our ${bestProducts[0]} product can offer.`;
  }
  
  // Generate conversation sequence
  const conversationSequence = [
    'Introduce the product and its main benefit',
    'Explain how it specifically addresses their needs based on their profile',
    'Present a success story or testimonial that resonates with their personality type',
    'Address potential objections based on their risk tolerance',
    'Offer a small, easy first step to get started'
  ];
  
  return {
    bestProducts,
    marketingTechnique,
    conversationStarter,
    conversationSequence,
    userProfileSnapshot: userProfile
  };
} 