import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MarketingPlan } from '@/contexts/MarketingPlanContext';

// Define the path to the data file
const dataFilePath = path.join(process.cwd(), 'data', 'marketing-plans.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read plans from file
const readPlans = (): { plans: MarketingPlan[] } => {
  ensureDataDir();
  
  if (!fs.existsSync(dataFilePath)) {
    return { plans: [] };
  }
  
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading marketing plans file:', error);
    return { plans: [] };
  }
};

// Write plans to file
const writePlans = (data: { plans: MarketingPlan[] }) => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing marketing plans file:', error);
    return false;
  }
};

// GET handler - retrieve all marketing plans
export async function GET() {
  const data = readPlans();
  return NextResponse.json(data);
}

// POST handler - save a new marketing plan
export async function POST(request: Request) {
  try {
    const { plan } = await request.json();
    
    if (!plan || !plan.id) {
      return NextResponse.json({ error: 'Invalid plan data' }, { status: 400 });
    }
    
    // Read existing data
    const data = readPlans();
    
    // Add new plan at the beginning (most recent first)
    data.plans = [plan, ...data.plans];
    
    // Write updated data
    if (writePlans(data)) {
      return NextResponse.json({ success: true, plan });
    } else {
      return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/marketing-plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE handler - clear all marketing plans
export async function DELETE() {
  try {
    // Write empty plans array
    if (writePlans({ plans: [] })) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to clear plans' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in DELETE /api/marketing-plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 