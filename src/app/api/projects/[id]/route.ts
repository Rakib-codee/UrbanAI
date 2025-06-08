import { NextRequest, NextResponse } from 'next/server';

// Define the Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Mock database for projects - this should be imported from a shared file in a real app
const projects: Project[] = [
  {
    id: 'sample-project-id',
    name: 'Sample Urban Development Project',
    description: 'A comprehensive urban development project for the downtown area',
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-05-20').toISOString(),
  },
  {
    id: 'riverside-project',
    name: 'Riverside Revitalization',
    description: 'Project focused on revitalizing the riverside area with green spaces and community facilities',
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-04-25').toISOString(),
  },
  {
    id: 'transit-project',
    name: 'Transit-Oriented Development',
    description: 'Developing high-density, mixed-use areas around public transit stations',
    createdAt: new Date('2023-02-20').toISOString(),
    updatedAt: new Date('2023-06-01').toISOString(),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Remove the project from the array
    projects.splice(projectIndex, 1);
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 