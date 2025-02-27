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
   - Historical Performance: ${knowledgeBase.danaPlus.historicalPerformance}

2. Reksa Dana (Mutual Funds):
   - Description: ${knowledgeBase.reksadana.description}
   - Features: ${knowledgeBase.reksadana.features}
   - Benefits: ${knowledgeBase.reksadana.benefits}
   - Target Audience: ${knowledgeBase.reksadana.targetAudience}
   - Risk Level: ${knowledgeBase.reksadana.riskLevel}
   - Minimum Investment: ${knowledgeBase.reksadana.minimumInvestment}
   - Return Rate: ${knowledgeBase.reksadana.returnRate}
   - Additional Info: ${knowledgeBase.reksadana.additionalInfo}
   - Historical Performance: ${knowledgeBase.reksadana.historicalPerformance}

3. eMAS (Gold Investment):
   - Description: ${knowledgeBase.eMAS.description}
   - Features: ${knowledgeBase.eMAS.features}
   - Benefits: ${knowledgeBase.eMAS.benefits}
   - Target Audience: ${knowledgeBase.eMAS.targetAudience}
   - Risk Level: ${knowledgeBase.eMAS.riskLevel}
   - Minimum Investment: ${knowledgeBase.eMAS.minimumInvestment}
   - Return Rate: ${knowledgeBase.eMAS.returnRate}
   - Additional Info: ${knowledgeBase.eMAS.additionalInfo}
   - Historical Performance: ${knowledgeBase.eMAS.historicalPerformance}
`;

    // Construct the full prompt with context
    const fullPrompt = `
${prompt}

${userProfileFormatted}

${knowledgeBaseFormatted}
`;

    // Call Azure OpenAI API
    const response = await fetch(`${azureConfig.apiBase}/openai/deployments/${azureConfig.deploymentName}/chat/completions?api-version=${azureConfig.apiVersion}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureConfig.apiKey
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a financial marketing expert. Generate marketing plans based on user profiles and product information." },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Azure OpenAI API error:', errorData);
      return NextResponse.json({ error: 'Failed to get marketing plan' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const plan = JSON.parse(aiResponse);
      return NextResponse.json({ plan });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return NextResponse.json({ error: 'Failed to parse marketing plan' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating marketing plan:', error);
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