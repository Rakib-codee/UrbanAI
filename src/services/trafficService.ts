import axios from 'axios';
import TomTomService from './tomtomService';
import { AdvancedFilterState } from '@/components/filters/AdvancedFilters';

export interface TrafficDataItem {
  id: string;
  area: string;
  roadType: string;
  congestion: number;
  speed: number;
  travelTime: number;
  volume: number;
  incidents: number;
  timestamp: string;
}

export interface AreaOption {
  id: string;
  name: string;
  value: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

const TrafficService = {
  /**
   * Get available areas for filtering
   */
  async getAreas(): Promise<AreaOption[]> {
    try {
      // In a real app, this would fetch from an API
      const response = await axios.get('/api/traffic/areas');
      return response.data;
    } catch (error) {
      console.error('Error fetching areas:', error);
      
      // Fallback data
      return [
        { 
          id: 'dhanmondi', 
          name: 'Dhanmondi', 
          value: 'dhanmondi',
          coordinates: { lat: 23.7461, lon: 90.3742 }
        },
        { 
          id: 'gulshan', 
          name: 'Gulshan', 
          value: 'gulshan',
          coordinates: { lat: 23.7931, lon: 90.4126 }
        },
        { 
          id: 'banani', 
          name: 'Banani', 
          value: 'banani',
          coordinates: { lat: 23.7937, lon: 90.4066 }
        },
        { 
          id: 'mirpur', 
          name: 'Mirpur', 
          value: 'mirpur',
          coordinates: { lat: 23.8223, lon: 90.3654 }
        },
        { 
          id: 'uttara', 
          name: 'Uttara', 
          value: 'uttara',
          coordinates: { lat: 23.8759, lon: 90.3795 }
        },
        { 
          id: 'motijheel', 
          name: 'Motijheel', 
          value: 'motijheel',
          coordinates: { lat: 23.7331, lon: 90.4173 }
        },
        { 
          id: 'mohammadpur', 
          name: 'Mohammadpur', 
          value: 'mohammadpur',
          coordinates: { lat: 23.7659, lon: 90.3587 }
        },
        { 
          id: 'oldDhaka', 
          name: 'Old Dhaka', 
          value: 'oldDhaka',
          coordinates: { lat: 23.7104, lon: 90.4074 }
        }
      ];
    }
  },
  
  /**
   * Get traffic data based on filters
   */
  async getTrafficData(filters: AdvancedFilterState): Promise<TrafficDataItem[]> {
    try {
      // In a real app, this would be an API call with filters
      const response = await axios.get('/api/traffic/data', {
        params: {
          areas: filters.areas?.join(','),
          metrics: filters.metrics?.join(','),
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
          roadTypes: filters.roadTypes?.join(','),
          severity: filters.severity?.join(',')
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      
      // If API call fails, use TomTom API for real data where possible
      return this.getTrafficDataFromTomTom(filters);
    }
  },
  
  /**
   * Get traffic data from TomTom API
   */
  async getTrafficDataFromTomTom(filters: AdvancedFilterState): Promise<TrafficDataItem[]> {
    try {
      // Get areas
      const areas = await this.getAreas();
      
      // Filter areas if specified
      const filteredAreas = filters.areas?.length 
        ? areas.filter(area => 
            filters.areas.some((filter: string) => 
              area.value === filter
            )
          )
        : areas;
      
      // Get traffic data for each area
      const trafficData: TrafficDataItem[] = [];
      
      for (const area of filteredAreas) {
        // Get real traffic flow data from TomTom
        const flowData = await TomTomService.getTrafficFlow(
          area.coordinates.lat,
          area.coordinates.lon
        );
        
        // Get real traffic incidents from TomTom
        const incidentsData = await TomTomService.getTrafficIncidents(
          area.coordinates.lat,
          area.coordinates.lon,
          5000 // 5km radius
        );
        
        // Map incidents to our format
        const incidents = TomTomService.mapTrafficIncidents(incidentsData, area.name);
        
        // Create road types for this area
        const roadTypes = ['Highway', 'Major Road', 'Arterial Road', 'Local Street'];
        
        // Filter road types if specified
        const filteredRoadTypes = filters.roadTypes?.length
          ? roadTypes.filter(type => 
              filters.roadTypes.some(filter => 
                type.toLowerCase().includes(filter.toLowerCase())
              )
            )
          : roadTypes;
        
        for (const roadType of filteredRoadTypes) {
          // Calculate congestion based on flow data
          let congestionValue = 50; // Default value
          
          if (flowData && flowData.flowSegmentData) {
            // Calculate congestion as percentage of free flow speed vs current speed
            const { currentSpeed, freeFlowSpeed } = flowData.flowSegmentData;
            if (currentSpeed && freeFlowSpeed) {
              congestionValue = Math.max(0, Math.min(100, Math.round(100 - (currentSpeed / freeFlowSpeed * 100))));
            }
          }
          
          // Apply severity filter if specified
          if (filters.severity?.length) {
            let includeBasedOnSeverity = false;
            
            if (filters.severity.includes('low') && congestionValue <= 30) {
              includeBasedOnSeverity = true;
            } else if (filters.severity.includes('moderate') && congestionValue > 30 && congestionValue <= 60) {
              includeBasedOnSeverity = true;
            } else if (filters.severity.includes('high') && congestionValue > 60 && congestionValue <= 80) {
              includeBasedOnSeverity = true;
            } else if (filters.severity.includes('severe') && congestionValue > 80) {
              includeBasedOnSeverity = true;
            }
            
            if (!includeBasedOnSeverity) {
              continue; // Skip this road type if it doesn't match severity filter
            }
          }
          
          // Generate average speed based on congestion (inverse relationship)
          const speed = Math.max(5, Math.floor(60 - (congestionValue * 0.5)));
          
          // Generate travel time (minutes) based on congestion
          const travelTime = Math.floor(10 + (congestionValue * 0.2));
          
          // Generate traffic volume (vehicles per hour)
          const volume = Math.floor(500 + (Math.random() * 1500));
          
          // Create data point
          const dataPoint: TrafficDataItem = {
            id: `${area.value}-${roadType.toLowerCase().replace(' ', '-')}-${Date.now()}`,
            area: area.name,
            roadType,
            congestion: congestionValue,
            speed,
            travelTime,
            volume,
            incidents: incidents.filter(i => i.severity.toLowerCase() === 'high').length,
            timestamp: new Date().toISOString()
          };
          
          // Apply metric filters if specified
          if (filters.metrics?.length) {
            // Only include data points that have all the requested metrics
            const hasAllMetrics = filters.metrics.every(metric => {
              if (metric === 'congestion') return dataPoint.congestion !== undefined;
              if (metric === 'speed') return dataPoint.speed !== undefined;
              if (metric === 'travelTime') return dataPoint.travelTime !== undefined;
              if (metric === 'volume') return dataPoint.volume !== undefined;
              if (metric === 'incidents') return dataPoint.incidents !== undefined;
              return true;
            });
            
            if (hasAllMetrics) {
              trafficData.push(dataPoint);
            }
          } else {
            trafficData.push(dataPoint);
          }
        }
      }
      
      return trafficData;
    } catch (error) {
      console.error('Error getting traffic data from TomTom:', error);
      return [];
    }
  }
};

export default TrafficService; 