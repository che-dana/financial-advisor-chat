import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, userProfile, knowledgeBase, finalPrompt } = await request.json();

    // In a real implementation, this would call an AI service like OpenAI
    // For now, we'll simulate a response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a simple response based on the user profile and message
    let response = '';
    
    if (message.toLowerCase().includes('investment')) {
      if (userProfile.riskTolerance === 'Low') {
        response = `Based on your conservative risk profile, I'd recommend considering DANA+ as a starting point. It offers a stable return with minimal risk. Would you like to know more about its features?`;
      } else if (userProfile.incomeLevel === 'High') {
        response = `With your income level, you might be interested in our Reksa Dana products which can offer higher returns. Have you considered diversifying your investment portfolio?`;
      } else {
        response = `eMAS could be a good option for you. It's a digital gold investment that provides protection against inflation. Would you like to learn more about how it works?`;
      }
    } else if (message.toLowerCase().includes('saving')) {
      response = `Saving is a great habit! DANA+ offers competitive interest rates compared to traditional savings accounts. You can start with as little as Rp 10,000.`;
    } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      response = `Hello! I'm your Dana financial advisor. I can help you find the right investment products based on your needs and profile. What would you like to know about today?`;
    } else {
      response = `Thank you for your message. Based on your profile, I see you might be interested in ${userProfile.behavioralTrait === 'Investor' ? 'our Reksa Dana products' : 'our DANA+ savings product'}. Would you like to know more about these options?`;
    }
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 