import { NextResponse } from 'next/server';
import { UserProfile } from '@/contexts/UserProfileContext';

export async function POST(request: Request) {
  try {
    const { prompt, userProfile, knowledgeBase } = await request.json();

    // In a real implementation, this would call an AI service
    // For now, we'll simulate a response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a marketing plan based on the user profile
    const plan = generateMarketingPlan(userProfile);
    
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error in marketing plan API:', error);
    return NextResponse.json(
      { error: 'Failed to generate marketing plan' },
      { status: 500 }
    );
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