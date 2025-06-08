import axios from 'axios';

/**
 * Service for interacting with TomTom API to get traffic data
 */
export interface TrafficFlowResponse {
  flowSegmentData: {
    frc: string;
    currentSpeed: number;
    freeFlowSpeed: number;
    currentTravelTime: number;
    freeFlowTravelTime: number;
    confidence: number;
    roadClosure: boolean;
    coordinates: { latitude: number; longitude: number }[];
  };
}

export interface TrafficIncidentResponse {
  incidents: Array<{
    id: string;
    type: string;
    severity: number;
    events: Array<{
      description: string;
      code: number;
      iconCategory: number;
    }>;
    location: {
      description: string;
      polyline: string;
    };
    startTime: string;
    endTime: string;
    delay: number;
    magnitudeOfDelay: number;
  }>;
}

const TomTomService = {
  /**
   * Get traffic flow information for a location
   * @param lat Latitude
   * @param lon Longitude
   * @returns Traffic flow data
   */
  async getTrafficFlow(lat: number, lon: number): Promise<TrafficFlowResponse | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
      
      if (!apiKey) {
        console.warn('TomTom API key not set');
        return null;
      }
      
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`,
        {
          params: {
            point: `${lat},${lon}`,
            unit: 'KMPH',
            key: apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic flow data:', error);
      return null;
    }
  },
  
  /**
   * Get traffic incidents near a location
   * @param lat Latitude
   * @param lon Longitude
   * @param radius Search radius in meters
   * @returns Traffic incidents data
   */
  async getTrafficIncidents(lat: number, lon: number, radius = 5000): Promise<TrafficIncidentResponse | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
      
      if (!apiKey) {
        console.warn('TomTom API key not set');
        return null;
      }
      
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/5/incidentDetails`,
        {
          params: {
            bbox: `${lat - 0.1},${lon - 0.1},${lat + 0.1},${lon + 0.1}`,
            fields: '{incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description,code},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}',
            language: 'en-GB',
            key: apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic incidents:', error);
      return null;
    }
  },
  
  /**
   * Convert TomTom traffic incidents to our application format
   * @param incidents TomTom traffic incidents
   * @param city City name for reference
   */
  mapTrafficIncidents(tomtomData: TrafficIncidentResponse | null, city: string): { 
    id: number; 
    location: string; 
    time: string; 
    type: string; 
    severity: string; 
    status: string;
  }[] {
    if (!tomtomData || !tomtomData.incidents || tomtomData.incidents.length === 0) {
      return [];
    }
    
    // Map severity from TomTom format (0-4) to our format
    const mapSeverity = (severityCode: number): string => {
      switch (severityCode) {
        case 0: return "Low";
        case 1: return "Low";
        case 2: return "Medium";
        case 3: return "High";
        case 4: return "High";
        default: return "Medium";
      }
    };
    
    // Map incident type
    const mapType = (events: any[]): string => {
      if (!events || events.length === 0) return "Congestion";
      
      const description = events[0].description.toLowerCase();
      
      if (description.includes('accident')) return "Accident";
      if (description.includes('construction')) return "Construction";
      if (description.includes('closure')) return "Road Closure";
      if (description.includes('event')) return "Public Event";
      
      return "Congestion";
    };
    
    return tomtomData.incidents.slice(0, 5).map((incident, index) => {
      return {
        id: index + 1,
        location: incident.location?.description || `${city} Area ${index + 1}`,
        time: new Date(incident.startTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        type: mapType(incident.events),
        severity: mapSeverity(incident.severity),
        status: new Date(incident.endTime) > new Date() ? "Ongoing" : "Resolved"
      };
    });
  }
};

export default TomTomService; 