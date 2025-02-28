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
    const finalPrompts = await prisma.finalPrompt.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    return NextResponse.json({ prompts: finalPrompts });
  } catch (error) {
    console.error('Error fetching final prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch final prompts' }, { status: 500 });
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
    // Find active prompt to deactivate it if this one should be active
    if (data.isActive) {
      await prisma.finalPrompt.updateMany({
        where: { 
          userId,
          isActive: true 
        },
        data: { isActive: false }
      });
    }
    
    const finalPrompt = await prisma.finalPrompt.create({
      data: {
        ...data,
        userId
      }
    });
    
    return NextResponse.json({ prompt: finalPrompt });
  } catch (error) {
    console.error('Error saving final prompt:', error);
    return NextResponse.json({ error: 'Failed to save final prompt' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = (session.user as SessionUser).id;
  const { id } = await req.json();
  
  try {
    await prisma.finalPrompt.delete({
      where: { 
        id,
        userId // Ensure the prompt belongs to the user
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting final prompt:', error);
    return NextResponse.json({ error: 'Failed to delete final prompt' }, { status: 500 });
  }
} 