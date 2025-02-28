import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'connected', 
      userCount,
      message: 'Database connection successful' 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to database',
      error: (error as Error).message
    }, { status: 500 });
  }
} 