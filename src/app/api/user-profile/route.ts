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
    const userProfile = await prisma.userProfile.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    return NextResponse.json({ profile: userProfile || null });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = (session.user as SessionUser).id;
  const { profile } = await req.json();
  
  try {
    // Find existing profile or create new one
    const existingProfile = await prisma.userProfile.findFirst({
      where: { userId }
    });
    
    let userProfile;
    
    if (existingProfile) {
      userProfile = await prisma.userProfile.update({
        where: { id: existingProfile.id },
        data: {
          ...profile,
          updatedAt: new Date()
        }
      });
    } else {
      userProfile = await prisma.userProfile.create({
        data: {
          ...profile,
          userId
        }
      });
    }
    
    return NextResponse.json({ profile: userProfile });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Failed to save user profile' }, { status: 500 });
  }
} 