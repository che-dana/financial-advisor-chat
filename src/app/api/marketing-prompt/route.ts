import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the data file
const dataFilePath = path.join(process.cwd(), 'data', 'marketing-prompt.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read prompt from file
const readPrompt = (): { prompt: string } => {
  ensureDataDir();
  
  if (!fs.existsSync(dataFilePath)) {
    return { prompt: '' };
  }
  
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading marketing prompt file:', error);
    return { prompt: '' };
  }
};

// Write prompt to file
const writePrompt = (data: { prompt: string }) => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing marketing prompt file:', error);
    return false;
  }
};

// GET handler - retrieve the marketing prompt
export async function GET() {
  const data = readPrompt();
  return NextResponse.json(data);
}

// POST handler - save the marketing prompt
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid prompt data' }, { status: 400 });
    }
    
    // Write updated data
    if (writePrompt({ prompt })) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/marketing-prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 