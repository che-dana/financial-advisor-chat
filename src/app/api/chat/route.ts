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
    const { message, userProfile, knowledgeBase, finalPrompt } = await request.json();

    // Format the user profile for the prompt
    const userProfileFormatted = `
## User Profile:
- Big 5 Personality: Openness (${userProfile.openness}), 
  Conscientiousness (${userProfile.conscientiousness}), 
  Extraversion (${userProfile.extraversion}), 
  Agreeableness (${userProfile.agreeableness}), 
  Neuroticism (${userProfile.neuroticism})
- Education Level: ${userProfile.educationLevel}
- Income Level: ${userProfile.incomeLevel}
- Housing Status: ${userProfile.housingStatus}
- Vehicle Ownership: ${userProfile.vehicleOwnership}
- Nature of Work: ${userProfile.workNature}
- Family Dependents: ${userProfile.familyDependants}
- Age: ${userProfile.age}
- Behavioral Trait: ${userProfile.behavioralTrait}
- Investment Purchase Status: 
  Dana+: ${userProfile.danaPlus === 'Yes' ? 'Purchased' : 'Not Purchased'}
  Emas: ${userProfile.eMAS === 'Yes' ? 'Purchased' : 'Not Purchased'}
  Reksa Dana: ${userProfile.reksadana === 'Yes' ? 'Purchased' : 'Not Purchased'}
`;

    // Use the finalPrompt directly, replacing the user profile placeholder if it exists
    let completePrompt = finalPrompt;
    if (completePrompt.includes('[User profile will be inserted here]')) {
      completePrompt = completePrompt.replace('[User profile will be inserted here]', userProfileFormatted);
    } else {
      // If no placeholder, append the user profile
      completePrompt = completePrompt + "\n\n" + userProfileFormatted;
    }

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
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Azure OpenAI API error:', errorData);
      return NextResponse.json({ error: 'Failed to get chat response' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 