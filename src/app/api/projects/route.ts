import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define the Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Mock database for projects
const projects: Project[] = [
  {
    id: 'sample-project-id',
    name: 'Sample Urban Development Project',
    description: 'A comprehensive urban development project for the downtown area',
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-05-20').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Riverside Revitalization',
    description: 'Project focused on revitalizing the riverside area with green spaces and community facilities',
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-04-25').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Transit-Oriented Development',
    description: 'Developing high-density, mixed-use areas around public transit stations',
    createdAt: new Date('2023-02-20').toISOString(),
    updatedAt: new Date('2023-06-01').toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.name || !body.description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new project
    const newProject: Project = {
      id: uuidv4(),
      name: body.name,
      description: body.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add the new project to our mock database
    projects.push(newProject);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Failed to create project' },
      { status: 500 }
    );
  }
} 