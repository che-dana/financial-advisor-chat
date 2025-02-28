import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = (session.user as SessionUser).id;
  
  try {
    const marketingPrompts = await prisma.marketingPrompt.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    // Transform JSON string fields back to objects
    const transformedPrompts = marketingPrompts.map(prompt => ({
      ...prompt,
      bestProducts: prompt.bestProducts ? JSON.parse(prompt.bestProducts) : [],
      conversationSequence: prompt.conversationSequence ? JSON.parse(prompt.conversationSequence) : []
    }));
    
    return NextResponse.json({ prompts: transformedPrompts });
  } catch (error) {
    console.error('Error fetching marketing prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch marketing prompts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = (session.user as SessionUser).id;
  const data = await req.json();
  
  try {
    console.log('Creating marketing prompt for user:', userId);
    
    // Find if there's an active prompt to deactivate
    const activePrompt = await prisma.marketingPrompt.findFirst({
      where: { 
        userId,
        isActive: true
      }
    });
    
    // If there's an active prompt, deactivate it
    if (activePrompt) {
      await prisma.marketingPrompt.update({
        where: { id: activePrompt.id },
        data: { isActive: false }
      });
    }
    
    // Create the new prompt
    const prompt = await prisma.marketingPrompt.create({
      data: {
        userId,
        prompt: data.prompt,
        bestProducts: data.bestProducts,
        marketingTechnique: data.marketingTechnique,
        conversationStarter: data.conversationStarter,
        conversationSequence: data.conversationSequence,
        isActive: data.isActive || false
      }
    });
    
    console.log('Marketing prompt created:', prompt.id);
    
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error creating marketing prompt:', error);
    return NextResponse.json({ error: 'Failed to create marketing prompt' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = (session.user as SessionUser).id;
  
  try {
    await prisma.marketingPrompt.deleteMany({
      where: { userId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting marketing prompts:', error);
    return NextResponse.json({ error: 'Failed to delete marketing prompts' }, { status: 500 });
  }
} 