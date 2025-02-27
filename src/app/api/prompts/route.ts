import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PromptVersion } from '@/contexts/FinalPromptContext';

// Define the path to the data file
const dataFilePath = path.join(process.cwd(), 'data', 'prompts.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read prompts from file
const readPrompts = (): { versions: PromptVersion[] } => {
  ensureDataDir();
  
  if (!fs.existsSync(dataFilePath)) {
    return { versions: [] };
  }
  
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading prompts file:', error);
    return { versions: [] };
  }
};

// Write prompts to file
const writePrompts = (data: { versions: PromptVersion[] }) => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing prompts file:', error);
    return false;
  }
};

// GET handler - retrieve all prompt versions
export async function GET() {
  const data = readPrompts();
  return NextResponse.json(data);
}

// POST handler - save a new prompt version
export async function POST(request: Request) {
  try {
    const { version } = await request.json();
    
    if (!version || !version.id || !version.prompt) {
      return NextResponse.json({ error: 'Invalid prompt data' }, { status: 400 });
    }
    
    // Read existing data
    const data = readPrompts();
    
    // Add new version at the beginning (most recent first)
    data.versions = [version, ...data.versions];
    
    // Write updated data
    if (writePrompts(data)) {
      return NextResponse.json({ success: true, version });
    } else {
      return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/prompts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 