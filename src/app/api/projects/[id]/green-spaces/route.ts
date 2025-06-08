import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define the GreenSpace interface
interface GreenSpace {
  id: string;
  location: string;
  area: number;
  type: string;
  description: string;
  timestamp: string;
}

// Mock database for green spaces with some sample data
const greenSpacesByProject: Record<string, GreenSpace[]> = {
  // Add some sample data for demonstration purposes
  'sample-project-id': [
    {
      id: '1',
      location: 'Central Park Area',
      area: 5.5,
      type: 'park',
      description: 'Large central park with walking paths',
      timestamp: new Date('2023-05-15').toISOString(),
    },
    {
      id: '2',
      location: 'Riverside Garden',
      area: 1.2,
      type: 'garden',
      description: 'Community garden along the river',
      timestamp: new Date('2023-06-20').toISOString(),
    },
    {
      id: '3',
      location: 'Northern Forest Preserve',
      area: 12.8,
      type: 'forest',
      description: 'Protected forest area with native species',
      timestamp: new Date('2023-04-10').toISOString(),
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the project exists - in a real app, this would query a database
    const projectId = params.id;
    
    // Return the green spaces for this project (or an empty array if none)
    return NextResponse.json(greenSpacesByProject[projectId] || []);
  } catch (error) {
    console.error('Error fetching green spaces:', error);
    return NextResponse.json(
      { message: 'Failed to fetch green spaces' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();
    
    // Validate the request body
    if (!body.location || !body.area || !body.type) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new green space entry
    const newGreenSpace: GreenSpace = {
      id: uuidv4(),
      location: body.location,
      area: Number(body.area),
      type: body.type,
      description: body.description || '',
      timestamp: new Date().toISOString(),
    };
    
    // Initialize the array if it doesn't exist
    if (!greenSpacesByProject[projectId]) {
      greenSpacesByProject[projectId] = [];
    }
    
    // Add the new green space
    greenSpacesByProject[projectId].push(newGreenSpace);
    
    return NextResponse.json(newGreenSpace, { status: 201 });
  } catch (error) {
    console.error('Error creating green space:', error);
    return NextResponse.json(
      { message: 'Failed to create green space' },
      { status: 500 }
    );
  }
} 