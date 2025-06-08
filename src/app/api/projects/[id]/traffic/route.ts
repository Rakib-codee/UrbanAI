import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define the TrafficData interface
interface TrafficData {
  id: string;
  location: string;
  density: number;
  timestamp: string;
}

// Generate mock traffic data for testing
function generateMockTrafficData(): TrafficData[] {
  const locations = [
    'Main Street',
    'Downtown Intersection',
    'Highway Exit 23',
    'Central Avenue',
    'North Bridge',
    'Market Square',
    'University Road',
    'Industrial Zone'
  ];

  const currentTime = new Date();
  
  return locations.map((location, index) => {
    // Create timestamps ranging from 60 minutes ago to now
    const timestamp = new Date(currentTime);
    timestamp.setMinutes(timestamp.getMinutes() - (60 - index * 8));
    
    // Randomize density values
    const density = Math.floor(Math.random() * 100);
    
    return {
      id: uuidv4(),
      location,
      density,
      timestamp: timestamp.toISOString()
    };
  });
}

// Mock database for traffic data with sample data
const trafficDataByProject: Record<string, TrafficData[]> = {
  // Add some sample data for the demo project
  'sample-project-id': generateMockTrafficData(),
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // If data doesn't exist for this project, generate it
    if (!trafficDataByProject[projectId]) {
      trafficDataByProject[projectId] = generateMockTrafficData();
    }
    
    // Return the traffic data for this project
    return NextResponse.json(trafficDataByProject[projectId] || []);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch traffic data' },
      { status: 500 }
    );
  }
} 